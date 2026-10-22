import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { PinPad } from '../components/PinPad';
import { Nav } from '../navigation/types';
import { secure } from '../services/secure';
import { useStore } from '../store';
import { colors, spacing } from '../theme';
import { haptic } from '../utils/haptics';

/** Used both for first-time PIN creation ("PinSetup") and changing it ("ChangePin"). */
export default function PinSetupScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute();
  const isChange = route.name === 'ChangePin';
  const insets = useSafeAreaInsets();
  const setPin = useStore((s) => s.setPin);
  const activatePin = useStore((s) => s.activatePin);
  const biometricEnabled = useStore((s) => s.biometricEnabled);
  const setBiometric = useStore((s) => s.setBiometric);

  const [first, setFirst] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [offerBio, setOfferBio] = useState(false);

  const onComplete = async (pin: string) => {
    if (first === null) {
      setFirst(pin);
      setError(null);
      return;
    }
    if (pin !== first) {
      haptic.error();
      setFirst(null);
      setError('PINs did not match. Start again.');
      return;
    }
    haptic.success();
    if (isChange) {
      await setPin(pin);
      navigation.goBack();
      return;
    }
    // First-time setup: hold off activating the PIN so we can offer biometrics before the navigator moves on.
    await setPin(pin, false);
    if (!biometricEnabled && (await secure.biometricAvailable())) setOfferBio(true);
    else activatePin();
  };

  if (offerBio) {
    return (
      <View style={[styles.root, { paddingBottom: insets.bottom + spacing.xl }]}>
        <Ionicons name="finger-print" size={64} color={colors.text} />
        <AppText variant="h2" style={styles.title}>
          Enable biometrics?
        </AppText>
        <AppText variant="caption" style={styles.center}>
          Approve transfers with your fingerprint or face. You can change this any time in Security Center.
        </AppText>
        <View style={styles.actions}>
          <Button
            title="Enable biometrics"
            icon="finger-print"
            onPress={() => {
              void setBiometric(true).then(activatePin);
            }}
          />
          <Button title="Not now" variant="ghost" onPress={activatePin} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingBottom: insets.bottom }]}>
      <View style={styles.top}>
        <Ionicons name="keypad" size={36} color={colors.text} />
        <AppText variant="h2" style={styles.title}>
          {first === null ? (isChange ? 'Choose a new PIN' : 'Create your PIN') : 'Confirm your PIN'}
        </AppText>
        <AppText variant="caption" style={styles.center}>
          {first === null ? 'Choose 6 digits you will remember.' : 'Enter the same 6 digits again.'}
        </AppText>
      </View>
      <PinPad onComplete={onComplete} error={error} resetKey={first ?? 'first'} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl },
  top: { alignItems: 'center', marginBottom: spacing.lg },
  title: { marginTop: spacing.md, marginBottom: spacing.xs, textAlign: 'center' },
  center: { textAlign: 'center' },
  actions: { width: '100%', marginTop: spacing.xxl },
});
