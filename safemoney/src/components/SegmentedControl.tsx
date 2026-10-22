import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '../theme';
import { haptic } from '../utils/haptics';
import { AppText } from './AppText';

interface Props<T extends string> {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}

export function SegmentedControl<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <View style={styles.wrap} accessibilityRole="tablist">
      {options.map((o) => {
        const active = o === value;
        return (
          <Pressable
            key={o}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => {
              haptic.light();
              onChange(o);
            }}
            style={[styles.seg, active && styles.segActive]}
          >
            <AppText variant="bodyBold" color={active ? colors.white : colors.text}>
              {o}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    backgroundColor: colors.neutralTint,
    borderRadius: radius.button,
    padding: spacing.xs,
    marginBottom: spacing.md,
  },
  seg: {
    flex: 1,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.button - 4,
  },
  segActive: { backgroundColor: colors.slate },
});
