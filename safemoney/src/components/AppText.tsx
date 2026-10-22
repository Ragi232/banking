import React from 'react';
import { Text, TextProps } from 'react-native';
import { typography } from '../theme';

interface Props extends TextProps {
  variant?: keyof typeof typography;
  color?: string;
}

export function AppText({ variant = 'body', color, style, ...rest }: Props) {
  return <Text {...rest} style={[typography[variant], color ? { color } : null, style]} />;
}
