import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'safemoney.token';
const PIN_KEY = 'safemoney.pin';
const SALT = 'safemoney.v1.';
const SETTINGS_KEY = 'safemoney.settings';

const hashPin = (pin: string) =>
  Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, SALT + pin);

export const secure = {
  getToken: () => SecureStore.getItemAsync(TOKEN_KEY),
  setToken: (t: string) => SecureStore.setItemAsync(TOKEN_KEY, t),
  clearToken: () => SecureStore.deleteItemAsync(TOKEN_KEY),

  async hasPin(): Promise<boolean> {
    return (await SecureStore.getItemAsync(PIN_KEY)) !== null;
  },
  async setPin(pin: string): Promise<void> {
    await SecureStore.setItemAsync(PIN_KEY, await hashPin(pin));
  },
  async verifyPin(pin: string): Promise<boolean> {
    const stored = await SecureStore.getItemAsync(PIN_KEY);
    return stored !== null && stored === (await hashPin(pin));
  },

  async biometricAvailable(): Promise<boolean> {
    try {
      return (
        (await LocalAuthentication.hasHardwareAsync()) &&
        (await LocalAuthentication.isEnrolledAsync())
      );
    } catch {
      return false;
    }
  },
  async authenticate(reason: string): Promise<boolean> {
    try {
      const res = await LocalAuthentication.authenticateAsync({
        promptMessage: reason,
        cancelLabel: 'Use PIN',
        disableDeviceFallback: true,
      });
      return res.success;
    } catch {
      return false;
    }
  },
};

export interface Settings {
  onboarded: boolean;
  biometricEnabled: boolean;
  notificationsEnabled: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  onboarded: false,
  biometricEnabled: false,
  notificationsEnabled: true,
};

export const settingsStore = {
  async load(): Promise<Settings> {
    try {
      const raw = await AsyncStorage.getItem(SETTINGS_KEY);
      return raw ? { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<Settings>) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },
  async save(s: Settings): Promise<void> {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  },
};
