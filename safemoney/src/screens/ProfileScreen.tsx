import React from 'react';
import { Linking, Pressable, StyleSheet, Switch, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useAuthConfirm } from '../components/ConfirmModal';
import { Screen } from '../components/Screen';
import { Nav } from '../navigation/types';
import { useStore } from '../store';
import { colors, sizes, spacing } from '../theme';
import { initials } from '../utils/format';

interface RowProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  onPress?: () => void;
  right?: React.ReactNode;
}

function Row({ icon, label, onPress, right }: RowProps) {
  const content = (
    <View style={styles.row}>
      <Ionicons name={icon} size={22} color={colors.text} />
      <AppText variant="bodyBold" style={styles.rowLabel}>
        {label}
      </AppText>
      {right ?? <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />}
    </View>
  );
  return onPress ? (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress}>
      {content}
    </Pressable>
  ) : (
    content
  );
}

export default function ProfileScreen() {
  const navigation = useNavigation<Nav>();
  const user = useStore((s) => s.user);
  const notificationsEnabled = useStore((s) => s.notificationsEnabled);
  const setNotifications = useStore((s) => s.setNotifications);
  const logout = useStore((s) => s.logout);
  const { confirm, modal } = useAuthConfirm('Confirm log out');

  return (
    <Screen title="Profile" scroll>
      <View style={styles.hero}>
        <View style={styles.avatar}>
          <AppText variant="h1" color={colors.white}>
            {initials(user?.name ?? 'U')}
          </AppText>
        </View>
        <AppText variant="h2" style={styles.name}>
          {user?.name}
        </AppText>
        <AppText variant="caption">{user?.email}</AppText>
      </View>

      <Card style={styles.card}>
        <Row icon="shield-checkmark-outline" label="Security Center" onPress={() => navigation.navigate('Security')} />
        <View style={styles.divider} />
        <Row
          icon="notifications-outline"
          label="Notifications"
          right={
            <Switch
              value={notificationsEnabled}
              onValueChange={(v) => void setNotifications(v)}
              trackColor={{ false: colors.border, true: colors.incomeText }}
              thumbColor={colors.white}
              accessibilityLabel="Notifications"
            />
          }
        />
        <View style={styles.divider} />
        <Row icon="help-circle-outline" label="Help & support" onPress={() => void Linking.openURL('mailto:support@safemoney.app')} />
      </Card>

      <Button
        title="Log out"
        variant="secondary"
        icon="log-out-outline"
        onPress={() => confirm(logout)}
        style={styles.logout}
      />
      <AppText variant="caption" style={styles.version}>
        SafeMoney 1.0.0
      </AppText>
      {modal}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', marginVertical: spacing.lg },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.slate,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { marginTop: spacing.md },
  card: { paddingVertical: spacing.xs },
  row: { flexDirection: 'row', alignItems: 'center', minHeight: sizes.touch + 8 },
  rowLabel: { flex: 1, marginLeft: spacing.md },
  divider: { height: 1, backgroundColor: colors.border },
  logout: { marginTop: spacing.xl },
  version: { textAlign: 'center', marginTop: spacing.lg },
});
