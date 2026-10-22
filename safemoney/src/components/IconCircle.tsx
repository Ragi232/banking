import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, sizes } from '../theme';
import { IconName } from './Button';

interface Props {
  icon: IconName;
  size?: number;
  background?: string;
  color?: string;
}

export function IconCircle({
  icon,
  size = sizes.iconCircle,
  background = colors.primary,
  color = colors.white,
}: Props) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.circle, { width: size, height: size, borderRadius: size / 2, backgroundColor: background }]}
    >
      <Ionicons name={icon} size={size * 0.5} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  circle: { alignItems: 'center', justifyContent: 'center' },
});
