# SafeMoney

A mobile banking app built with Expo (React Native) and TypeScript.

## Run it

Requirements: Node 18+ and the **Expo Go** app on your phone (or an iOS simulator / Android emulator).

```bash
npm install
npx expo install --fix   # aligns native module versions with your Expo SDK
npx expo start
```

Scan the QR code with Expo Go, or press `i` (iOS simulator) / `a` (Android emulator).

Type-check: `npm run typecheck`

## Demo login

| Field | Value |
| --- | --- |
| Email | `demo@safemoney.app` |
| Password | `123456` |
| 2FA code | `123456` |

Then create any 6-digit PIN. Tap **Use demo account** on the login screen to fill the credentials.

## App flow

Onboarding → Login → 2FA → PIN setup (+ optional biometrics) → Home.
On later launches the app asks for your PIN or biometrics to unlock.

Fastest transfer: Home → **Send** → tap a contact → type amount → **Continue** → **Send** → confirm with PIN or biometrics.

Sensitive actions that require PIN/biometric confirmation: sending money, topping up, revealing card details, freezing/unfreezing the card, toggling biometrics, changing PIN, and logging out.

Note: biometrics need real hardware or an enrolled simulator. If unavailable, the PIN prompt is used automatically.

## Project structure

```
App.tsx                     fonts + providers
src/
  theme/                    colors, spacing, radius, typography (single source of truth)
  types/                    shared TypeScript types
  services/
    api.ts                  mock API (async, simulated latency) - swap for real REST/GraphQL
    mockData.ts             accounts, transactions, contacts, card, notifications
    secure.ts               SecureStore (token, hashed PIN), biometrics, AsyncStorage settings
  store/                    Zustand store (session, data, send-flow draft)
  navigation/               root stack (auth-gated) + bottom tabs
  components/               Button, Card, IconCircle, TransactionRow, AmountInput,
                            Keypad, PinPad, ConfirmModal, Skeleton, EmptyState, charts...
  screens/                  all screens
  utils/                    formatting, haptics, category icons
```

## Swapping in a real backend

All data access goes through `src/services/api.ts`. Keep the method signatures and replace the bodies with `fetch`/GraphQL calls; the store and screens do not need to change. Store the real access token with `secure.setToken`.

## Design notes

- SafeRed `#D32F2F` is used for CTAs, active tab, frozen state and the success screen. Every red element has an icon or text label.
- Credit amounts use a darker green (`#2E7D32`) for text so they pass WCAG AA; the lighter Soft Green `#4CAF50` is used for icons and accents.
- Charts are drawn with `react-native-svg` and always have a text legend / value labels, so they do not rely on color alone.
- Dashboard shows skeleton loaders while data loads; every list has empty and error states with retry.

## Security caveats (read before production)

This is a demo. Before shipping: move authentication, PIN verification and 2FA to the server, use real device-bound tokens with refresh, add certificate pinning, rate-limit/lock out repeated wrong PINs, and never ship the demo credentials.
