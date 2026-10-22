import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '../theme';
import { formatAmountInput } from '../utils/format';
import { AppText } from './AppText';
import { Keypad } from './Keypad';

interface Props {
  value: string; // raw, e.g. "1250.5"
  onChange: (next: string) => void;
  error?: string | null;
}

const MAX_WHOLE_DIGITS = 7;

export function AmountInput({ value, onChange, error }: Props) {
  const onKey = (k: string) => {
    if (k === 'del') return onChange(value.slice(0, -1));
    if (k === '.') {
      if (value.includes('.')) return;
      return onChange(value === '' ? '0.' : `${value}.`);
    }
    const [whole = '', cents] = value.split('.');
    if (cents !== undefined) {
      if (cents.length >= 2) return;
    } else if (whole.length >= MAX_WHOLE_DIGITS) {
      return;
    }
    if (value === '0' && k === '0') return;
    onChange(value === '0' ? k : value + k);
  };

  const display = formatAmountInput(value === '' ? '0' : value);
  return (
    <View style={styles.wrap}>
      <View accessible accessibilityLabel={`Amount ${display}`} accessibilityLiveRegion="polite">
        <AppText variant="display" color={value === '' ? colors.textMuted : colors.text} style={styles.amount}>
          {display}
        </AppText>
      </View>
      <View style={styles.errorBox}>
        {error ? (
          <AppText variant="caption" color={colors.primary}>
            {error}
          </AppText>
        ) : null}
      </View>
      <Keypad onKey={onKey} leftKey="." />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', alignItems: 'center' },
  amount: { textAlign: 'center', fontSize: 48, lineHeight: 56 },
  errorBox: { minHeight: 24, marginVertical: spacing.sm },
});
