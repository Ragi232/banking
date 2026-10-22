import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme';
import { AppText } from './AppText';

interface Props {
  /** When set, renders a large in-screen title and pads for the status bar (tab screens). */
  title?: string;
  right?: React.ReactNode;
  scroll?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  /** Pad the bottom by the safe-area inset (stack screens without a tab bar). */
  bottomInset?: boolean;
  padded?: boolean;
  children: React.ReactNode;
}

export function Screen({
  title,
  right,
  scroll,
  refreshing,
  onRefresh,
  bottomInset,
  padded = true,
  children,
}: Props) {
  const insets = useSafeAreaInsets();
  const outer = {
    paddingTop: title !== undefined ? insets.top : 0,
    paddingBottom: bottomInset ? insets.bottom : 0,
  };
  const inner = padded ? styles.padded : undefined;

  const header =
    title !== undefined ? (
      <View style={styles.header}>
        <AppText variant="h1" accessibilityRole="header">
          {title}
        </AppText>
        {right}
      </View>
    ) : null;

  return (
    <View style={[styles.root, outer]}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={[inner, styles.scrollContent]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            onRefresh ? <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} /> : undefined
          }
        >
          {header}
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex, inner]}>
          {header}
          {children}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  padded: { paddingHorizontal: spacing.lg },
  scrollContent: { paddingBottom: spacing.xxl },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
  },
});
