import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppText } from '../components/AppText';
import { AmountInput } from '../components/AmountInput';
import { Button } from '../components/Button';
import { Screen } from '../components/Screen';
import { Nav } from '../navigation/types';
import { useStore } from '../store';
import { colors, spacing } from '../theme';
import { calcFee, formatCurrency, initials } from '../utils/format';

export default function SendAmountScreen() {
  const navigation = useNavigation<Nav>();
  const draft = useStore((s) => s.draft);
  const balance = useStore((s) => s.balance);
  const setDraft = useStore((s) => s.setDraft);

  const amount = parseFloat(draft.amount || '0');
  const total = amount + calcFee(amount);
  const exceeds = total > balance;
  const valid = amount > 0 && !exceeds;

  return (
    <Screen bottomInset>
      <View style={styles.top}>
        <View style={styles.avatar}>
          <AppText variant="bodyBold">{initials(draft.recipient?.name ?? '')}</AppText>
        </View>
        <AppText variant="h3" style={styles.name}>
          Send to {draft.recipient?.name}
        </AppText>
        <AppText variant="caption">Available: {formatCurrency(balance)}</AppText>
      </View>

      <View style={styles.middle}>
        <AmountInput
          value={draft.amount}
          onChange={(v) => setDraft({ amount: v })}
          error={exceeds && amount > 0 ? 'Amount plus fee exceeds your balance.' : null}
        />
      </View>

      <Button title="Continue" icon="arrow-forward" disabled={!valid} onPress={() => navigation.navigate('SendReview')} style={styles.cta} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { alignItems: 'center', marginTop: spacing.md },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.neutralTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { marginTop: spacing.sm },
  middle: { flex: 1, justifyContent: 'center', marginHorizontal: -spacing.lg },
  cta: { marginBottom: spacing.lg },
});
