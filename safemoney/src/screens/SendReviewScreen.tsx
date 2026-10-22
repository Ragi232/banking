import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useAuthConfirm } from '../components/ConfirmModal';
import { Screen } from '../components/Screen';
import { Nav } from '../navigation/types';
import { useStore } from '../store';
import { colors, spacing } from '../theme';
import { calcFee, formatCurrency } from '../utils/format';
import { haptic } from '../utils/haptics';

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <View style={styles.row}>
      <AppText variant={bold ? 'bodyBold' : 'body'} color={bold ? colors.text : colors.textMuted}>
        {label}
      </AppText>
      <AppText variant={bold ? 'h3' : 'bodyBold'}>{value}</AppText>
    </View>
  );
}

export default function SendReviewScreen() {
  const navigation = useNavigation<Nav>();
  const draft = useStore((s) => s.draft);
  const sendMoney = useStore((s) => s.sendMoney);
  const { confirm, modal } = useAuthConfirm('Confirm transfer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const amount = parseFloat(draft.amount || '0');
  const fee = calcFee(amount);
  const total = amount + fee;

  const send = async () => {
    setLoading(true);
    setError(null);
    try {
      await sendMoney();
      navigation.replace('SendSuccess');
    } catch (e) {
      haptic.error();
      setError(e instanceof Error ? e.message : 'Transfer failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen bottomInset>
      <AppText variant="h2" style={styles.title}>
        Review transfer
      </AppText>
      <Card>
        <Row label="To" value={draft.recipient?.name ?? ''} />
        <Row label="Handle" value={draft.recipient?.handle ?? ''} />
        <Row label="Amount" value={formatCurrency(amount)} />
        <Row label="Fee (0.5%)" value={formatCurrency(fee)} />
        <View style={styles.divider} />
        <Row label="Total" value={formatCurrency(total)} bold />
      </Card>

      {error ? (
        <AppText variant="caption" color={colors.primary} style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </AppText>
      ) : null}

      <View style={styles.spacer} />
      <Button
        title={`Send ${formatCurrency(total)}`}
        icon="lock-closed"
        loading={loading}
        onPress={() => confirm(send)}
        accessibilityHint="Asks for biometrics or your PIN"
        style={styles.cta}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: spacing.md, marginBottom: spacing.lg },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.sm },
  error: { marginTop: spacing.md, textAlign: 'center' },
  spacer: { flex: 1 },
  cta: { marginBottom: spacing.lg },
});
