import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { EmptyState } from '../components/EmptyState';
import { Screen } from '../components/Screen';
import { SegmentedControl } from '../components/SegmentedControl';
import { Skeleton } from '../components/Skeleton';
import { TransactionRow } from '../components/TransactionRow';
import { useStore } from '../store';
import { colors, spacing } from '../theme';

const FILTERS = ['All', 'Sent', 'Received'] as const;
type Filter = (typeof FILTERS)[number];

export default function HistoryScreen() {
  const transactions = useStore((s) => s.transactions);
  const status = useStore((s) => s.status);
  const loadData = useStore((s) => s.loadData);
  const [filter, setFilter] = useState<Filter>('All');

  const data = useMemo(() => {
    if (filter === 'Sent') return transactions.filter((t) => t.amount < 0);
    if (filter === 'Received') return transactions.filter((t) => t.amount > 0);
    return transactions;
  }, [transactions, filter]);

  const loading = status === 'idle' || status === 'loading';

  return (
    <Screen title="History">
      <SegmentedControl options={FILTERS} value={filter} onChange={setFilter} />
      {status === 'error' ? (
        <EmptyState
          tone="error"
          icon="cloud-offline"
          title="Couldn’t load transactions"
          message="Check your connection and try again."
          actionLabel="Retry"
          onAction={loadData}
        />
      ) : loading && transactions.length === 0 ? (
        <View>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} height={48} style={styles.skel} />
          ))}
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(t) => t.id}
          renderItem={({ item }) => <TransactionRow tx={item} />}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          refreshing={status === 'loading'}
          onRefresh={loadData}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <EmptyState
              icon="receipt-outline"
              title={filter === 'All' ? 'No transactions yet' : `Nothing ${filter.toLowerCase()} yet`}
              message="Your activity will appear here."
            />
          }
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { paddingBottom: spacing.xl },
  sep: { height: 1, backgroundColor: colors.border },
  skel: { marginBottom: spacing.md },
});
