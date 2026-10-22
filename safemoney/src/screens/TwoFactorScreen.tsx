import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../components/AppText';
import { PinPad } from '../components/PinPad';
import { DEMO_2FA_CODE } from '../services/mockData';
import { useStore } from '../store';
import { colors, spacing } from '../theme';
import { haptic } from '../utils/haptics';
import { Ionicons } from '@expo/vector-icons';

export default function TwoFactorScreen() {
  const insets = useSafeAreaInsets();
  const verify2FA = useStore((s) => s.verify2FA);
  const [error, setError] = useState<string | null>(null);

  const onComplete = async (code: string) => {
    try {
      setError(null);
      await verify2FA(code);
      haptic.success();
    } catch (e) {
      haptic.error();
      setError(e instanceof Error ? e.message : 'Verification failed.');
    }
  };

  return (
    <View style={[styles.root, { paddingBottom: insets.bottom }]}>
      <View style={styles.top}>
        <Ionicons name="mail-open-outline" size={40} color={colors.text} />
        <AppText variant="h2" style={styles.title}>
          Two-factor verification
        </AppText>
        <AppText variant="caption" style={styles.center}>
          Enter the 6-digit code we sent to your device.
        </AppText>
        <AppText variant="caption" style={styles.center}>
          Demo code: {DEMO_2FA_CODE}
        </AppText>
      </View>
      <PinPad onComplete={onComplete} error={error} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  top: { alignItems: 'center', paddingHorizontal: spacing.xl, marginBottom: spacing.lg },
  title: { marginTop: spacing.md, marginBottom: spacing.xs },
  center: { textAlign: 'center' },
});
