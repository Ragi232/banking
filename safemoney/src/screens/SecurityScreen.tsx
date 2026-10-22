import React from 'react';
import { Alert, Pressable, StyleSheet, Switch, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../components/AppText';
import { Card } from '../components/Card';
import { useAuthConfirm } from '../components/ConfirmModal';
import { IconCircle } from '../components/IconCircle';
import { Screen } from '../components/Screen';
import { Nav } from '../navigation/types';
import { secure } from '../services/secure';
import { useStore } from '../store';
import { colors, spacing } from '../theme';

export default function SecurityScreen() {
  const navigation = useNavigation<Nav>();
  const biometricEnabled = useStore((s) => s.biometricEnabled);
  const hasPin = useStore((s) => s.hasPin);
  const setBiometric = useStore((s) => s.setBiometric);
  const { confirm, modal } = useAuthConfirm();

  // Shield score: PIN + biometrics + 2FA (2FA is always on in this build).
  const checks = [
    { label: 'PIN protection', ok: hasPin },
    { label: 'Biometric approval', ok: biometricEnabled },
    { label: 'Two-factor login', ok: true },
  ];
  const score = checks.filter((c) => c.ok).length;
  const protectedFully = score === checks.length;

  const onToggleBiometric = async (next: boolean) => {
    if (next && !(await secure.biometricAvailable())) {
      Alert.alert('Biometrics unavailable', 'Set up Face ID or fingerprint in your device settings first.');
      return;
    }
    confirm(() => setBiometric(next));
  };

  return (
    <Screen scroll bottomInset>
      <Card style={styles.shield}>
        <IconCircle
          icon={protectedFully ? 'shield-checkmark' : 'shield-half'}
          size={72}
          background={protectedFully ? colors.incomeTint : colors.primaryTint}
          color={protectedFully ? colors.incomeText : colors.primary}
        />
        <AppText variant="h2" style={styles.shieldTitle} accessibilityRole="header">
          SafeMoney Shield
        </AppText>
        <AppText variant="bodyBold" color={protectedFully ? colors.incomeText : colors.primary}>
          {protectedFully ? 'Fully protected' : 'Needs attention'} · {score}/{checks.length}
        </AppText>
        <View style={styles.checks}>
          {checks.map((c) => (
            <View key={c.label} style={styles.checkRow}>
              <Ionicons
                name={c.ok ? 'checkmark-circle' : 'alert-circle'}
                size={20}
                color={c.ok ? colors.incomeText : colors.primary}
              />
              <AppText variant="body" style={styles.checkLabel}>
                {c.label}
              </AppText>
              <AppText variant="caption">{c.ok ? 'On' : 'Off'}</AppText>
            </View>
          ))}
        </View>
      </Card>

      <Card style={styles.group}>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <AppText variant="h3">Biometric approval</AppText>
            <AppText variant="caption">Use Face ID or fingerprint to confirm transfers.</AppText>
          </View>
          <Switch
            value={biometricEnabled}
            onValueChange={onToggleBiometric}
            trackColor={{ false: colors.border, true: colors.incomeText }}
            thumbColor={colors.white}
            accessibilityLabel="Biometric approval"
          />
        </View>
      </Card>

      <Card style={styles.group}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Change PIN"
          onPress={() => confirm(() => navigation.navigate('ChangePin'))}
          style={styles.row}
        >
          <View style={styles.rowText}>
            <AppText variant="h3">Change PIN</AppText>
            <AppText variant="caption">Confirm with your current PIN first.</AppText>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </Pressable>
      </Card>
      {modal}
    </Screen>
  );
}

const styles = StyleSheet.create({
  shield: { alignItems: 'center', marginTop: spacing.md },
  shieldTitle: { marginTop: spacing.md, marginBottom: spacing.xs },
  checks: { alignSelf: 'stretch', marginTop: spacing.lg },
  checkRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.xs + 2 },
  checkLabel: { flex: 1, marginLeft: spacing.sm },
  group: { marginTop: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 48 },
  rowText: { flex: 1, paddingRight: spacing.md },
});
