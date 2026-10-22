import React from 'react';
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native';
import { colors, radius, shadow, spacing } from '../theme';

interface Props extends ViewProps {
  style?: StyleProp<ViewStyle>;
}

export function Card({ style, ...rest }: Props) {
  return <View {...rest} style={[styles.card, style]} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    padding: spacing.lg,
    ...shadow,
  },
});
