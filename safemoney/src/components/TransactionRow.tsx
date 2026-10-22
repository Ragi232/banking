import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '../theme';
import { Transaction } from '../types';
import { categoryIcon } from '../utils/categories';
import { formatCurrency, formatDate } from '../utils/format';
import { AppText } from './AppText';
import { IconCircle } from './IconCircle';

export function TransactionRow({ tx }: { tx: Transaction }) {
  const credit = tx.amount > 0;
  return (
    <View
      style={styles.row}
      accessible
      accessibilityLabel={`${tx.name}, ${formatDate(tx.date)}, ${credit ? 'received' : 'spent'} ${formatCurrency(Math.abs(tx.amount))}`}
    >
      <IconCircle
        icon={categoryIcon[tx.category]}
        background={credit ? colors.incomeTint : colors.neutralTint}
        color={credit ? colors.incomeText : colors.text}
      />
      <View style={styles.middle}>
        <AppText variant="bodyBold" numberOfLines={1}>
          {tx.name}
        </AppText>
        <AppText variant="caption">
          {formatDate(tx.date)} · {tx.category}
        </AppText>
      </View>
      <AppText variant="bodyBold" color={credit ? colors.incomeText : colors.text}>
        {formatCurrency(tx.amount, { sign: true })}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md },
  middle: { flex: 1, marginHorizontal: spacing.md },
});
