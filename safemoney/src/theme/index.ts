import { TextStyle, ViewStyle } from 'react-native';

export const colors = {
  primary: '#D32F2F', // SafeRed
  primaryDark: '#B71C1C',
  primaryTint: '#FDECEA',
  text: '#212121', // Charcoal
  textMuted: '#616161', // 5.5:1 on Off-White (AA)
  bg: '#F5F5F5', // Off-White
  card: '#FFFFFF',
  white: '#FFFFFF',
  income: '#4CAF50', // Soft Green (icons / accents)
  incomeText: '#2E7D32', // Green for text (AA on white)
  incomeTint: '#E8F5E9',
  border: '#E0E0E0',
  skeleton: '#E0E0E0',
  slate: '#37474F',
  warning: '#F9A825',
  neutralTint: '#EEEEEE',
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;

export const radius = { card: 16, button: 12, pill: 999 } as const;

export const fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

export const typography = {
  display: { fontFamily: fonts.bold, fontSize: 36, lineHeight: 44, color: colors.text },
  h1: { fontFamily: fonts.bold, fontSize: 28, lineHeight: 34, color: colors.text },
  h2: { fontFamily: fonts.semibold, fontSize: 20, lineHeight: 26, color: colors.text },
  h3: { fontFamily: fonts.semibold, fontSize: 16, lineHeight: 22, color: colors.text },
  body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22, color: colors.text },
  bodyBold: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 22, color: colors.text },
  caption: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 18, color: colors.textMuted },
  button: { fontFamily: fonts.semibold, fontSize: 16, lineHeight: 22, color: colors.white },
} satisfies Record<string, TextStyle>;

export const shadow: ViewStyle = {
  shadowColor: '#000',
  shadowOpacity: 0.06,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  elevation: 2,
};

export const sizes = {
  touch: 48,
  keypadKey: 68,
  avatar: 44,
  iconCircle: 48,
} as const;

export const theme = { colors, spacing, radius, fonts, typography, shadow, sizes };
export type Theme = typeof theme;
