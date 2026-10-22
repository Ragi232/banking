import { create } from 'zustand';
import { api } from '../services/api';
import { secure, settingsStore } from '../services/secure';
import {
  AppNotification,
  Contact,
  Transaction,
  TransferDraft,
  User,
  VirtualCard,
} from '../types';

type Status = 'idle' | 'loading' | 'ready' | 'error';

const EMPTY_DRAFT: TransferDraft = { recipient: null, amount: '' };

interface AppState {
  // session / settings
  hydrated: boolean;
  onboarded: boolean;
  token: string | null;
  user: User | null;
  pending2FA: boolean;
  hasPin: boolean;
  locked: boolean;
  biometricEnabled: boolean;
  notificationsEnabled: boolean;

  // data
  status: Status;
  balance: number;
  transactions: Transaction[];
  contacts: Contact[];
  card: VirtualCard | null;
  notifications: AppNotification[];

  // send flow
  draft: TransferDraft;
  lastTransfer: Transaction | null;

  init: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  verify2FA: (code: string) => Promise<void>;
  /** Saves the PIN. Pass activate=false to defer flipping hasPin (lets PinSetup show a biometrics offer first). */
  setPin: (pin: string, activate?: boolean) => Promise<void>;
  activatePin: () => void;
  unlock: () => void;
  setBiometric: (enabled: boolean) => Promise<void>;
  setNotifications: (enabled: boolean) => Promise<void>;
  logout: () => Promise<void>;
  loadData: () => Promise<void>;
  setDraft: (patch: Partial<TransferDraft>) => void;
  resetDraft: () => void;
  sendMoney: () => Promise<Transaction>;
  topUp: (amount: number) => Promise<void>;
  toggleFreeze: () => Promise<void>;
}

export const useStore = create<AppState>((set, get) => {
  const persist = async () => {
    const { onboarded, biometricEnabled, notificationsEnabled } = get();
    await settingsStore.save({ onboarded, biometricEnabled, notificationsEnabled });
  };

  return {
    hydrated: false,
    onboarded: false,
    token: null,
    user: null,
    pending2FA: false,
    hasPin: false,
    locked: false,
    biometricEnabled: false,
    notificationsEnabled: true,

    status: 'idle',
    balance: 0,
    transactions: [],
    contacts: [],
    card: null,
    notifications: [],

    draft: EMPTY_DRAFT,
    lastTransfer: null,

    init: async () => {
      const settings = await settingsStore.load();
      const [token, hasPin] = await Promise.all([secure.getToken(), secure.hasPin()]);
      let user: User | null = null;
      let validToken = token;
      if (token) {
        try {
          user = await api.getUser(token);
        } catch {
          validToken = null;
          await secure.clearToken();
        }
      }
      set({
        ...settings,
        token: validToken,
        user,
        hasPin,
        locked: !!validToken && hasPin,
        hydrated: true,
      });
    },

    completeOnboarding: async () => {
      set({ onboarded: true });
      await persist();
    },

    login: async (email, password) => {
      await api.login(email, password);
      set({ pending2FA: true });
    },

    verify2FA: async (code) => {
      const { token, user } = await api.verify2FA(code);
      await secure.setToken(token);
      set({ token, user, pending2FA: false, locked: false, status: 'idle' });
    },

    setPin: async (pin, activate = true) => {
      await secure.setPin(pin);
      if (activate) set({ hasPin: true });
    },

    activatePin: () => set({ hasPin: true }),

    unlock: () => set({ locked: false }),

    setBiometric: async (enabled) => {
      set({ biometricEnabled: enabled });
      await persist();
    },

    setNotifications: async (enabled) => {
      set({ notificationsEnabled: enabled });
      await persist();
    },

    logout: async () => {
      await secure.clearToken();
      set({
        token: null,
        user: null,
        pending2FA: false,
        locked: false,
        status: 'idle',
        transactions: [],
        card: null,
        draft: EMPTY_DRAFT,
      });
    },

    loadData: async () => {
      set({ status: 'loading' });
      try {
        const snap = await api.getSnapshot();
        set({
          status: 'ready',
          balance: snap.balance,
          transactions: snap.transactions,
          contacts: snap.contacts,
          card: snap.card,
          notifications: snap.notifications,
        });
      } catch {
        set({ status: 'error' });
      }
    },

    setDraft: (patch) => set((s) => ({ draft: { ...s.draft, ...patch } })),
    resetDraft: () => set({ draft: EMPTY_DRAFT }),

    sendMoney: async () => {
      const { draft } = get();
      if (!draft.recipient) throw new Error('Choose a recipient first.');
      const { transaction, balance } = await api.sendMoney(draft.recipient, parseFloat(draft.amount));
      set((s) => ({
        balance,
        transactions: [transaction, ...s.transactions],
        lastTransfer: transaction,
      }));
      return transaction;
    },

    topUp: async (amount) => {
      const { transaction, balance } = await api.topUp(amount);
      set((s) => ({ balance, transactions: [transaction, ...s.transactions] }));
    },

    toggleFreeze: async () => {
      const card = get().card;
      if (!card) return;
      const frozen = await api.setCardFrozen(!card.frozen);
      set({ card: { ...card, frozen } });
    },
  };
});
