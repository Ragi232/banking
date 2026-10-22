import { AppNotification, Contact, Snapshot, Transaction, User, VirtualCard } from '../types';

export const DEMO_EMAIL = 'demo@safemoney.app';
export const DEMO_PASSWORD = '123456';
export const DEMO_2FA_CODE = '123456';

export const DEMO_USER: User = { id: 'u_1', name: 'Demo User', email: DEMO_EMAIL };

const DAY = 86_400_000;
const isoDaysAgo = (d: number, hour = 12) => {
  const date = new Date(Date.now() - d * DAY);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
};

type Template = [daysAgo: number, name: string, category: Transaction['category'], amount: number];

const MONTHLY: Template[] = [
  [2, 'Salary – Acme Corp', 'Income', 3200],
  [7, 'City Apartments Rent', 'Bills', -1200],
  [6, 'Electric Co.', 'Bills', -96],
  [4, 'Netflix', 'Entertainment', -15.49],
  [1, 'Uber', 'Transport', -14.2],
  [3, 'Amazon', 'Shopping', -64.99],
  [5, 'Whole Foods', 'Food', -82.3],
  [8, 'Shell Station', 'Transport', -48.75],
  [10, 'Zara', 'Shopping', -120],
  [12, 'Cinema City', 'Entertainment', -28],
  [9, 'Starbucks', 'Food', -6.45],
  [14, 'Green Market', 'Food', -71.1],
];

function buildTransactions(): Transaction[] {
  const out: Transaction[] = [];
  for (let m = 0; m < 6; m++) {
    MONTHLY.forEach(([days, name, category, amount], idx) => {
      const vary = amount < 0 && name !== 'City Apartments Rent' ? 1 + ((((m * 7 + idx * 3) % 11) - 5) / 50) : 1;
      out.push({
        id: `t_${m}_${idx}`,
        name,
        category,
        amount: Math.round(amount * vary * 100) / 100,
        date: isoDaysAgo(days + m * 30, 9 + (idx % 9)),
      });
    });
  }
  out.push(
    { id: 't_x1', name: 'Michael Chen', category: 'Transfer', amount: 75, date: isoDaysAgo(11, 18) },
    { id: 't_x2', name: 'Sarah Johnson', category: 'Transfer', amount: -50, date: isoDaysAgo(9, 20) },
  );
  return out.sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export const CONTACTS: Contact[] = [
  { id: 'c1', name: 'Sarah Johnson', handle: '@sarahj' },
  { id: 'c2', name: 'Michael Chen', handle: '@mchen' },
  { id: 'c3', name: 'Amara Okafor', handle: '@amara' },
  { id: 'c4', name: 'Liam Walker', handle: '@liamw' },
  { id: 'c5', name: 'Sofia Rossi', handle: '@sofiar' },
  { id: 'c6', name: 'Daniel Kim', handle: '@dkim' },
  { id: 'c7', name: 'Priya Patel', handle: '@priyap' },
  { id: 'c8', name: 'Noah Martin', handle: '@noahm' },
];

export const CARD: VirtualCard = {
  id: 'card_1',
  holder: 'DEMO USER',
  number: '4821 5530 7712 9034',
  expiry: '09/29',
  cvv: '318',
  frozen: false,
};

const NOTIFICATIONS: AppNotification[] = [
  { id: 'n1', title: 'Salary received', body: 'Acme Corp sent you $3,200.00.', date: isoDaysAgo(2) },
  { id: 'n2', title: 'New sign-in', body: 'Your account was accessed from a new device.', date: isoDaysAgo(5) },
  { id: 'n3', title: 'Shield tip', body: 'Turn on biometrics for faster, safer approvals.', date: isoDaysAgo(8) },
];

export function createSeed(): Snapshot {
  return {
    balance: 12480.5,
    transactions: buildTransactions(),
    contacts: CONTACTS,
    card: { ...CARD },
    notifications: NOTIFICATIONS,
  };
}
