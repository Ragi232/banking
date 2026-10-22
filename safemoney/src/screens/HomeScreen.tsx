import React from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useAuthConfirm } from '../components/ConfirmModal';
import { EmptyState } from '../components/EmptyState';
import { IconCircle } from '../components/IconCircle';
import { Screen } from '../components/Screen';
import { Skeleton } from '../components/Skeleton';
import { TransactionRow } from '../components/TransactionRow';
import { Nav } from '../navigation/types';
import { useStore } from '../store';
import { colors, radius, sizes, spacing } from '../theme';
import { formatCurrency, initials } from '../utils/format';
import { haptic } from '../utils/haptics';

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const user = useStore((s) => s.user);
  const balance = useStore((s) => s.balance);
  const transactions = useStore((s) => s.transactions);
  const status = useStore((s) => s.status);
  const notifications = useStore((s) => s.notifications);
  const loadData = useStore((s) => s.loadData);
  const topUp = useStore((s) => s.topUp);
  const { confirm, modal } = useAuthConfirm('Confirm top up');

  const loading = status === 'idle' || status === 'loading';
  const actions = [
    { label: 'Send', icon: 'paper-plane' as const, onPress: () => navigation.navigate('SendRecipient') },
    { label: 'Pay', icon: 'receipt' as const, onPress: () => Alert.alert('Pay bills', 'Bill payments are coming soon.') },
    {
      label: 'Top Up',
      icon: 'add' as const,
      onPress: () =>
        Alert.alert('Top up $100.00?', 'Add $100.00 from your linked card.', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Continue', onPress: () => confirm(() => topUp(100)) },
        ]),
    },
  ];

  return (
    <Screen scroll refreshing={status === 'loading' && transactions.length > 0} onRefresh={loadData}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open profile"
          onPress={() => navigation.navigate('Main', { screen: 'Profile' })}
          style={styles.avatar}
        >
          <AppText variant="bodyBold" color={colors.white}>
            {initials(user?.name ?? 'U')}
          </AppText>
        </Pressable>
        <View style={styles.greeting}>
          <AppText variant="caption">Good day,</AppText>
          <AppText variant="h3">{user?.name ?? ''}</AppText>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Notifications, ${notifications.length} new`}
          onPress={() => {
            haptic.light();
            navigation.navigate('Notifications');
          }}
          style={styles.bell}
          hitSlop={8}
        >
          <Ionicons name="notifications-outline" size={26} color={colors.text} />
          {notifications.length > 0 ? <View style={styles.badge} /> : null}
        </Pressable>
      </View>

      {status === 'error' ? (
        <EmptyState
          tone="error"
          icon="cloud-offline"
          title="Couldn’t load your account"
          message="Check your connection and try again."
          actionLabel="Retry"
          onAction={loadData}
        />
      ) : (
        <>
          <LinearGradient colors={[colors.slate, colors.text]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.balanceCard}>
            <AppText variant="caption" color="#CFD8DC">
              Total balance
            </AppText>
            {loading ? (
              <Skeleton width={180} height={40} style={styles.balanceSkeleton} />
            ) : (
              <AppText variant="display" color={colors.white} accessibilityLabel={`Total balance ${formatCurrency(balance)}`}>
                {formatCurrency(balance)}
              </AppText>
            )}
            <View style={styles.shieldRow}>
              <Ionicons name="shield-checkmark" size={16} color={colors.income} />
              <AppText variant="caption" color="#CFD8DC" style={styles.shieldText}>
                SafeMoney Shield active
              </AppText>
            </View>
          </LinearGradient>

          <View style={styles.actions}>
            {actions.map((a) => (
              <Pressable
                key={a.label}
                accessibilityRole="button"
                accessibilityLabel={a.label}
                onPress={() => {
                  haptic.light();
                  a.onPress();
                }}
                style={styles.action}
              >
                <IconCircle icon={a.icon} size={sizes.iconCircle + 8} />
                <AppText variant="bodyBold" style={styles.actionLabel}>
                  {a.label}
                </AppText>
              </Pressable>
            ))}
          </View>

          <View style={styles.sectionHeader}>
            <AppText variant="h2" accessibilityRole="header">
              Recent transactions
            </AppText>
            <Button
              title="See all"
              variant="ghost"
              onPress={() => navigation.navigate('Main', { screen: 'History' })}
              style={styles.seeAll}
            />
          </View>

          <Card style={styles.listCard}>
            {loading ? (
              [0, 1, 2, 3].map((i) => (
                <View key={i} style={styles.skelRow}>
                  <Skeleton width={sizes.iconCircle} height={sizes.iconCircle} rounded={sizes.iconCircle / 2} />
                  <View style={styles.skelText}>
                    <Skeleton width="60%" height={14} />
                    <Skeleton width="35%" height={12} style={styles.skelLine} />
                  </View>
                  <Skeleton width={60} height={14} />
                </View>
              ))
            ) : transactions.length === 0 ? (
              <EmptyState
                icon="receipt-outline"
                title="No transactions yet"
                message="Send or receive money and it will show up here."
              />
            ) : (
              transactions.slice(0, 5).map((t) => <TransactionRow key={t.id} tx={t} />)
            )}
          </Card>
        </>
      )}
      {modal}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.lg },
  avatar: {
    width: sizes.avatar,
    height: sizes.avatar,
    borderRadius: sizes.avatar / 2,
    backgroundColor: colors.slate,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: { flex: 1, marginLeft: spacing.md },
  bell: { width: sizes.touch, height: sizes.touch, alignItems: 'center', justifyContent: 'center' },
  badge: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.bg,
  },
  balanceCard: { borderRadius: radius.card, padding: spacing.xl },
  balanceSkeleton: { marginVertical: spacing.sm, backgroundColor: '#546E7A' },
  shieldRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
  shieldText: { marginLeft: spacing.xs },
  actions: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: spacing.xl },
  action: { alignItems: 'center', minWidth: 72 },
  actionLabel: { marginTop: spacing.sm },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  seeAll: { minHeight: 40, paddingHorizontal: spacing.sm },
  listCard: { paddingVertical: spacing.xs },
  skelRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md },
  skelText: { flex: 1, marginHorizontal: spacing.md },
  skelLine: { marginTop: spacing.sm },
});
