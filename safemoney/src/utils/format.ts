export function formatCurrency(value: number, opts: { sign?: boolean } = {}): string {
  const abs = Math.abs(value).toFixed(2);
  const [whole, cents] = abs.split('.');
  const withCommas = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const prefix = opts.sign ? (value < 0 ? '-' : '+') : value < 0 ? '-' : '';
  return `${prefix}$${withCommas}.${cents}`;
}

/** Formats a raw keypad string like "1234.5" into "$1,234.5" while typing. */
export function formatAmountInput(raw: string): string {
  const [whole = '0', cents] = raw.split('.');
  const withCommas = (whole || '0').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `$${withCommas}${cents !== undefined ? `.${cents}` : ''}`;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function monthLabel(monthIndex: number): string {
  return MONTHS[monthIndex] ?? '';
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

export function calcFee(amount: number): number {
  return Math.round(amount * 0.005 * 100) / 100; // 0.5%
}
