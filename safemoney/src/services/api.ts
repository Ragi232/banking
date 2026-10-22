/**
 * Mock API layer. Every method returns a Promise with simulated latency, so
 * swapping in a real REST/GraphQL client only means re-implementing this
 * object — the store and screens never touch mock data directly.
 */
import { Snapshot, Transaction, User, Contact } from '../types';
import { calcFee } from '../utils/format';
import { createSeed, DEMO_2FA_CODE, DEMO_EMAIL, DEMO_PASSWORD, DEMO_USER } from './mockData';

const MOCK_TOKEN = 'mock-token-demo';
const delay = (ms = 500) => new Promise<void>((r) => setTimeout(r, ms));

let db: Snapshot = createSeed();

export const api = {
  async login(email: string, password: string): Promise<{ requires2FA: true }> {
    await delay(700);
    if (email.trim().toLowerCase() !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      throw new Error('Incorrect email or password.');
    }
    return { requires2FA: true };
  },

  async verify2FA(code: string): Promise<{ token: string; user: User }> {
    await delay(500);
    if (code !== DEMO_2FA_CODE) throw new Error('That code is not correct. Try again.');
    return { token: MOCK_TOKEN, user: DEMO_USER };
  },

  async getUser(token: string): Promise<User> {
    await delay(150);
    if (token !== MOCK_TOKEN) throw new Error('Session expired.');
    return DEMO_USER;
  },

  async getSnapshot(): Promise<Snapshot> {
    await delay(900);
    return { ...db };
  },

  async sendMoney(
    recipient: Contact,
    amount: number,
  ): Promise<{ transaction: Transaction; balance: number }> {
    await delay(600);
    const total = amount + calcFee(amount);
    if (amount <= 0) throw new Error('Enter an amount greater than zero.');
    if (total > db.balance) throw new Error('Insufficient funds for this transfer.');
    const transaction: Transaction = {
      id: `t_${Date.now()}`,
      name: recipient.name,
      category: 'Transfer',
      amount: -total,
      date: new Date().toISOString(),
    };
    db = { ...db, balance: round(db.balance - total), transactions: [transaction, ...db.transactions] };
    return { transaction, balance: db.balance };
  },

  async topUp(amount: number): Promise<{ transaction: Transaction; balance: number }> {
    await delay(500);
    const transaction: Transaction = {
      id: `t_${Date.now()}`,
      name: 'Top Up',
      category: 'Income',
      amount,
      date: new Date().toISOString(),
    };
    db = { ...db, balance: round(db.balance + amount), transactions: [transaction, ...db.transactions] };
    return { transaction, balance: db.balance };
  },

  async setCardFrozen(frozen: boolean): Promise<boolean> {
    await delay(400);
    db = { ...db, card: { ...db.card, frozen } };
    return frozen;
  },
};

const round = (n: number) => Math.round(n * 100) / 100;
