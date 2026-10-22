import React, { useState } from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useAuthConfirm } from '../components/ConfirmModal';
import { EmptyState } from '../components/EmptyState';
import { Screen } from '../components/Screen';
import { Skeleton } from '../components/Skeleton';
import { useStore } from '../store';
import { colors, radius, spacing } from '../theme';

export default function CardsScreen() {
  const card = useStore((s) => s.card);
  const status = useStore((s) => s.status);
  const loadData = useStore((s) => s.loadData);
  const toggleFreeze = useStore((s) => s.toggleFreeze);
  const [revealed, setRevealed] = useState(false);
  const { confirm, modal } = useAuthConfirm();

  const frozen = !!card?.frozen;
  const masked = card ? `•••• •••• •••• ${card.number.slice(-4)}` : '';

  return (
    <Screen title="Cards" scroll>
      {status === 'error' ? (
        <EmptyState tone="error" icon="cloud-offline" title="Couldn’t load your card" message="Check your connection and try again." actionLabel="Retry" onAction={loadData} />
      ) : !card ? (
        status === 'ready' ? (
          <EmptyState icon="card-outline" title="No cards yet" message="Your virtual card will appear here." />
        ) : (
          <Skeleton height={200} rounded={radius.card} />
        )
      ) : (
        <>
          <LinearGradient
            colors={frozen ? ['#78909C', '#546E7A'] : [colors.slate, colors.text]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
            accessible
            accessibilityLabel={`Virtual card ending ${card.number.slice(-4)}, ${frozen ? 'frozen' : 'active'}`}
          >
            <View style={styles.cardTop}>
              <AppText variant="h3" color={colors.white}>
                SafeMoney
              </AppText>
              <Ionicons name="wifi" size={24} color={colors.white} style={styles.contactless} />
            </View>
            <AppText variant="h2" color={colors.white} style={styles.number}>
              {revealed ? card.number : masked}
            </AppText>
            <View style={styles.cardBottom}>
              <View>
                <AppText variant="caption" color="#CFD8DC">Card holder</AppText>
                <AppText variant="bodyBold" color={colors.white}>{card.holder}</AppText>
              </View>
              <View>
                <AppText variant="caption" color="#CFD8DC">Expires</AppText>
                <AppText variant="bodyBold" color={colors.white}>{card.expiry}</AppText>
              </View>
              <View>
                <AppText variant="caption" color="#CFD8DC">CVV</AppText>
                <AppText variant="bodyBold" color={colors.white}>{revealed ? card.cvv : '•••'}</AppText>
              </View>
            </View>
            {frozen ? (
              <View style={styles.frozenBadge}>
                <Ionicons name="snow" size={16} color={colors.white} />
                <AppText variant="bodyBold" color={colors.white} style={styles.frozenText}>
                  FROZEN
                </AppText>
              </View>
            ) : null}
          </LinearGradient>

          <Button
            title={revealed ? 'Hide card details' : 'Show card details'}
            variant="secondary"
            icon={revealed ? 'eye-off' : 'eye'}
            onPress={() => (revealed ? setRevealed(false) : confirm(() => setRevealed(true)))}
            style={styles.reveal}
          />

          <Card>
            <View style={styles.freezeRow}>
              <View style={styles.freezeText}>
                <AppText variant="h3">{frozen ? 'Card is frozen' : 'Freeze card'}</AppText>
                <AppText variant="caption">
                  {frozen ? 'All purchases are blocked until you unfreeze.' : 'Temporarily block all purchases.'}
                </AppText>
              </View>
              <Switch
                value={frozen}
                onValueChange={() => confirm(toggleFreeze)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.white}
                accessibilityLabel={frozen ? 'Unfreeze card' : 'Freeze card'}
              />
            </View>
          </Card>
        </>
      )}
      {modal}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.card, padding: spacing.xl, minHeight: 200, justifyContent: 'space-between' },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  contactless: { transform: [{ rotate: '90deg' }] },
  number: { letterSpacing: 1, marginVertical: spacing.lg },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between' },
  frozenBadge: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.xxl + spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
  },
  frozenText: { marginLeft: spacing.xs },
  reveal: { marginVertical: spacing.lg },
  freezeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  freezeText: { flex: 1, paddingRight: spacing.md },
});
