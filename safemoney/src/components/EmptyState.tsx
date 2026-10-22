import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '../theme';
import { AppText } from './AppText';
import { Button, IconName } from './Button';
import { IconCircle } from './IconCircle';

interface Props {
  icon: IconName;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  tone?: 'neutral' | 'error';
}

export function EmptyState({ icon, title, message, actionLabel, onAction, tone = 'neutral' }: Props) {
  return (
    <View style={styles.wrap} accessible accessibilityLabel={`${title}. ${message}`}>
      <IconCircle
        icon={icon}
        size={72}
        background={tone === 'error' ? colors.primaryTint : colors.neutralTint}
        color={tone === 'error' ? colors.primary : colors.textMuted}
      />
      <AppText variant="h3" style={styles.title}>
        {title}
      </AppText>
      <AppText variant="caption" style={styles.message}>
        {message}
      </AppText>
      {actionLabel && onAction ? (
        <Button title={actionLabel} onPress={onAction} variant="secondary" style={styles.btn} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', padding: spacing.xxl },
  title: { marginTop: spacing.lg, textAlign: 'center' },
  message: { marginTop: spacing.xs, textAlign: 'center' },
  btn: { marginTop: spacing.lg },
});
