import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, sizes, spacing } from '../theme';
import { haptic } from '../utils/haptics';
import { AppText } from './AppText';

interface Props {
  onKey: (key: string) => void; // '0'-'9', '.', 'del'
  leftKey?: '.' | '';
}

export function Keypad({ onKey, leftKey = '' }: Props) {
  const rows: string[][] = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    [leftKey, '0', 'del'],
  ];
  return (
    <View style={styles.pad}>
      {rows.map((row, i) => (
        <View key={i} style={styles.row}>
          {row.map((k, j) =>
            k === '' ? (
              <View key={j} style={styles.key} />
            ) : (
              <Pressable
                key={j}
                accessibilityRole="button"
                accessibilityLabel={k === 'del' ? 'Delete' : k === '.' ? 'Decimal point' : k}
                onPress={() => {
                  haptic.light();
                  onKey(k);
                }}
                style={({ pressed }) => [styles.key, pressed && styles.pressed]}
              >
                {k === 'del' ? (
                  <Ionicons name="backspace-outline" size={26} color={colors.text} />
                ) : (
                  <AppText variant="h1">{k}</AppText>
                )}
              </Pressable>
            ),
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  pad: { width: '100%', paddingHorizontal: spacing.xl },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  key: {
    flex: 1,
    height: sizes.keypadKey,
    marginHorizontal: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: sizes.keypadKey / 2,
  },
  pressed: { backgroundColor: colors.neutralTint },
});
