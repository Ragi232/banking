import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { PinPad } from '../components/PinPad';
import { secure } from '../services/secure';
import { useStore } from '../store';
import { colors, spacing } from '../theme';
import { haptic } from '../utils/haptics';

export default function UnlockScreen() {
  const insets = useSafeAreaInsets();
  const unlock = useStore((s) => s.unlock);
  const biometricEnabled = useStore((s) => s.biometricEnabled);
  const [error, setError] = useState<string | null>(null);
  const [canBio, setCanBio] = useState(false);

  const tryBio = useCallback(async () => {
    if (await secure.authenticate('Unlock SafeMoney')) {
      haptic.success();
      unlock();
    }
  }, [unlock]);

  useEffect(() => {
    (async () => {
      const ok = biometricEnabled && (await secure.biometricAvailable());
      setCanBio(ok);
      if (ok) void tryBio();
    })();
  }, [biometricEnabled, tryBio]);

  const onPin = async (pin: string) => {
    if (await secure.verifyPin(pin)) {
      haptic.success();
      unlock();
    } else {
      haptic.error();
      setError('Incorrect PIN. Try again.');
    }
  };

  return (
    <View style={[styles.root, { paddingBottom: insets.bottom }]}>
      <Ionicons name="lock-closed" size={36} color={colors.text} />
      <AppText variant="h2" style={styles.title}>
        Welcome back
      </AppText>
      <AppText variant="caption">Enter your PIN to unlock SafeMoney</AppText>
      <PinPad onComplete={onPin} error={error} />
      {canBio ? <Button title="Use biometrics" variant="ghost" icon="finger-print" onPress={tryBio} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  title: { marginTop: spacing.md, marginBottom: spacing.xs },
});
