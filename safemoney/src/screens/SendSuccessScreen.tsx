import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { Nav } from '../navigation/types';
import { useStore } from '../store';
import { colors, spacing } from '../theme';
import { formatCurrency } from '../utils/format';
import { haptic } from '../utils/haptics';

export default function SendSuccessScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const lastTransfer = useStore((s) => s.lastTransfer);
  const resetDraft = useStore((s) => s.resetDraft);
  const scale = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    haptic.success();
    Animated.sequence([
      Animated.spring(scale, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }),
      Animated.timing(fade, { toValue: 1, duration: 300, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]).start();
  }, [scale, fade]);

  const done = () => {
    resetDraft();
    navigation.popToTop();
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom + spacing.lg }]}>
      <View style={styles.center}>
        <Animated.View style={{ transform: [{ scale }] }}>
          <Ionicons name="checkmark-circle" size={140} color={colors.white} />
        </Animated.View>
        <Animated.View style={[styles.textBlock, { opacity: fade }]} accessibilityLiveRegion="polite">
          <AppText variant="h1" color={colors.white}>
            Money sent!
          </AppText>
          {lastTransfer ? (
            <AppText variant="body" color={colors.white} style={styles.sub}>
              {formatCurrency(Math.abs(lastTransfer.amount))} to {lastTransfer.name}
            </AppText>
          ) : null}
        </Animated.View>
      </View>
      <Button title="Done" variant="inverse" onPress={done} style={styles.btn} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.primary, paddingHorizontal: spacing.xl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  textBlock: { alignItems: 'center', marginTop: spacing.xl },
  sub: { marginTop: spacing.sm, textAlign: 'center' },
  btn: {},
});
