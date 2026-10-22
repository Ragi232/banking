import React, { useMemo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { AppText } from '../components/AppText';
import { BarChart } from '../components/BarChart';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { PieChart } from '../components/PieChart';
import { Screen } from '../components/Screen';
import { Skeleton } from '../components/Skeleton';
import { useStore } from '../store';
import { spacing } from '../theme';
import { chartPalette } from '../utils/categories';
import { monthLabel } from '../utils/format';

const DAY = 86_400_000;

export default function AnalyticsScreen() {
  const { width } = useWindowDimensions();
  const transactions = useStore((s) => s.transactions);
  const status = useStore((s) => s.status);
  const loadData = useStore((s) => s.loadData);

  const { pie, bars } = useMemo(() => {
    const cutoff = Date.now() - 30 * DAY;
    const byCat = new Map<string, number>();
    transactions
      .filter((t) => t.amount < 0 && +new Date(t.date) >= cutoff)
      .forEach((t) => byCat.set(t.category, (byCat.get(t.category) ?? 0) + Math.abs(t.amount)));
    const sorted = [...byCat.entries()].sort((a, b) => b[1] - a[1]);
    // Keep the top 5, group the rest as "Other" so the palette stays readable.
    const top = sorted.slice(0, 5);
    const rest = sorted.slice(5).reduce((s, [, v]) => s + v, 0);
    if (rest > 0) top.push(['Other', rest]);
    const pieData = top.map(([label, value], i) => ({ label, value, color: chartPalette[i % chartPalette.length] as string }));

    const now = new Date();
    const barData = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const value = transactions
        .filter((t) => {
          const td = new Date(t.date);
          return t.amount < 0 && td.getMonth() === d.getMonth() && td.getFullYear() === d.getFullYear();
        })
        .reduce((s, t) => s + Math.abs(t.amount), 0);
      return { label: monthLabel(d.getMonth()), value };
    });
    return { pie: pieData, bars: barData };
  }, [transactions]);

  const loading = status === 'idle' || status === 'loading';
  const chartWidth = width - spacing.lg * 4;

  return (
    <Screen title="Analytics" scroll refreshing={status === 'loading' && transactions.length > 0} onRefresh={loadData}>
      {status === 'error' ? (
        <EmptyState
          tone="error"
          icon="cloud-offline"
          title="Couldn’t load analytics"
          message="Check your connection and try again."
          actionLabel="Retry"
          onAction={loadData}
        />
      ) : loading && transactions.length === 0 ? (
        <>
          <Skeleton height={260} style={styles.gap} />
          <Skeleton height={220} />
        </>
      ) : pie.length === 0 ? (
        <EmptyState icon="pie-chart-outline" title="No spending yet" message="Make a payment and your analytics will appear here." />
      ) : (
        <>
          <Card style={styles.gap}>
            <AppText variant="h3" style={styles.cardTitle} accessibilityRole="header">
              Spending by category · last 30 days
            </AppText>
            <PieChart data={pie} />
          </Card>
          <Card>
            <AppText variant="h3" style={styles.cardTitle} accessibilityRole="header">
              Monthly spending
            </AppText>
            <View>
              <BarChart data={bars} width={chartWidth} />
            </View>
          </Card>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  gap: { marginBottom: spacing.lg },
  cardTitle: { marginBottom: spacing.lg },
});
