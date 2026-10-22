export type Category =
  | 'Food'
  | 'Transport'
  | 'Shopping'
  | 'Bills'
  | 'Entertainment'
  | 'Transfer'
  | 'Income';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Transaction {
  id: string;
  name: string;
  category: Category;
  /** Positive = credit (received), negative = debit (sent/spent). */
  amount: number;
  date: string; // ISO
}

export interface Contact {
  id: string;
  name: string;
  handle: string;
}

export interface VirtualCard {
  id: string;
  holder: string;
  number: string;
  expiry: string;
  cvv: string;
  frozen: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  date: string;
}

export interface Snapshot {
  balance: number;
  transactions: Transaction[];
  contacts: Contact[];
  card: VirtualCard;
  notifications: AppNotification[];
}

export interface TransferDraft {
  recipient: Contact | null;
  amount: string;
}
