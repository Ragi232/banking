import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '../theme';
import { AppText } from './AppText';
import { Keypad } from './Keypad';

interface Props {
  length?: number;
  onComplete: (code: string) => void;
  error?: string | null;
  /** Change this value to clear the entered digits (e.g. between steps). */
  resetKey?: string | number;
}

export function PinPad({ length = 6, onComplete, error, resetKey }: Props) {
  const [code, setCode] = useState('');

  useEffect(() => setCode(''), [resetKey]);

  const onKey = (k: string) => {
    if (k === 'del') return setCode((c) => c.slice(0, -1));
    if (code.length >= length) return;
    const next = code + k;
    setCode(next);
    if (next.length === length) {
      setTimeout(() => {
        onComplete(next);
        setCode('');
      }, 120);
    }
  };

  return (
    <View style={styles.wrap}>
      <View
        style={styles.dots}
        accessible
        accessibilityLabel={`${code.length} of ${length} digits entered`}
      >
        {Array.from({ length }).map((_, i) => (
          <View key={i} style={[styles.dot, i < code.length && styles.dotFilled]} />
        ))}
      </View>
      <View style={styles.errorBox} accessibilityLiveRegion="polite">
        {error ? (
          <AppText variant="caption" color={colors.primary} style={styles.error}>
            {error}
          </AppText>
        ) : null}
      </View>
      <Keypad onKey={onKey} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', alignItems: 'center' },
  dots: { flexDirection: 'row', marginVertical: spacing.lg },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginHorizontal: spacing.sm,
    borderWidth: 2,
    borderColor: colors.text,
  },
  dotFilled: { backgroundColor: colors.text },
  errorBox: { minHeight: 24, marginBottom: spacing.lg },
  error: { textAlign: 'center', fontFamily: 'Inter_600SemiBold' },
});
