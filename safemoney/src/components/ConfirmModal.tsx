import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { secure } from '../services/secure';
import { useStore } from '../store';
import { colors, spacing } from '../theme';
import { haptic } from '../utils/haptics';
import { AppText } from './AppText';
import { Button } from './Button';
import { PinPad } from './PinPad';

interface Props {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  title?: string;
}

/** Biometric-first, PIN-fallback confirmation for sensitive actions. */
export function ConfirmModal({ visible, onCancel, onSuccess, title = 'Confirm it’s you' }: Props) {
  const insets = useSafeAreaInsets();
  const biometricEnabled = useStore((s) => s.biometricEnabled);
  const [error, setError] = useState<string | null>(null);
  const [canBio, setCanBio] = useState(false);

  const tryBiometric = useCallback(async () => {
    if (await secure.authenticate('Confirm with biometrics')) {
      haptic.success();
      onSuccess();
    }
  }, [onSuccess]);

  useEffect(() => {
    if (!visible) return;
    setError(null);
    let active = true;
    (async () => {
      const available = biometricEnabled && (await secure.biometricAvailable());
      if (!active) return;
      setCanBio(available);
      if (available) tryBiometric();
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, biometricEnabled]);

  const onPin = async (pin: string) => {
    if (await secure.verifyPin(pin)) {
      haptic.success();
      setError(null);
      onSuccess();
    } else {
      haptic.error();
      setError('Incorrect PIN. Try again.');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onCancel}>
      <View style={[styles.root, { paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom }]}>
        <Pressable
          onPress={onCancel}
          accessibilityRole="button"
          accessibilityLabel="Cancel"
          style={styles.close}
          hitSlop={12}
        >
          <Ionicons name="close" size={28} color={colors.text} />
        </Pressable>
        <View style={styles.top}>
          <Ionicons name="lock-closed" size={32} color={colors.text} />
          <AppText variant="h2" style={styles.title}>
            {title}
          </AppText>
          <AppText variant="caption">Enter your 6-digit PIN</AppText>
        </View>
        <PinPad onComplete={onPin} error={error} />
        {canBio ? (
          <Button title="Use biometrics" variant="ghost" icon="finger-print" onPress={tryBiometric} />
        ) : null}
      </View>
    </Modal>
  );
}

/** Usage: const { confirm, modal } = useAuthConfirm(); confirm(() => doThing()); render {modal}. */
export function useAuthConfirm(title?: string) {
  const [action, setAction] = useState<(() => void | Promise<void>) | null>(null);

  const confirm = useCallback((fn: () => void | Promise<void>) => setAction(() => fn), []);

  const modal = (
    <ConfirmModal
      visible={action !== null}
      title={title}
      onCancel={() => setAction(null)}
      onSuccess={() => {
        const fn = action;
        setAction(null);
        if (fn) void fn();
      }}
    />
  );
  return { confirm, modal };
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, alignItems: 'center' },
  close: { alignSelf: 'flex-end', paddingHorizontal: spacing.lg },
  top: { alignItems: 'center', marginTop: spacing.xl },
  title: { marginTop: spacing.md, marginBottom: spacing.xs },
});
