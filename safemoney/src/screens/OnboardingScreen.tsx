import React, { useRef, useState } from 'react';
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../components/AppText';
import { Button, IconName } from '../components/Button';
import { IconCircle } from '../components/IconCircle';
import { useStore } from '../store';
import { colors, spacing } from '../theme';

interface Slide {
  id: string;
  icon: IconName;
  title: string;
  body: string;
}

const SLIDES: Slide[] = [
  {
    id: '1',
    icon: 'shield-checkmark',
    title: 'Bank with confidence',
    body: 'SafeMoney Shield protects every transfer with biometrics, a PIN and two-factor checks.',
  },
  {
    id: '2',
    icon: 'flash',
    title: 'Send money in seconds',
    body: 'Pick a contact, enter an amount and confirm. Most transfers take under 30 seconds.',
  },
  {
    id: '3',
    icon: 'pie-chart',
    title: 'Understand your spending',
    body: 'Clear charts show where your money goes each month, so you stay in control.',
  },
];

export default function OnboardingScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const completeOnboarding = useStore((s) => s.completeOnboarding);
  const listRef = useRef<FlatList<Slide>>(null);
  const [index, setIndex] = useState(0);
  const last = index === SLIDES.length - 1;

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) =>
    setIndex(Math.round(e.nativeEvent.contentOffset.x / width));

  const next = () => {
    if (last) return void completeOnboarding();
    listRef.current?.scrollToIndex({ index: index + 1, animated: true });
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom + spacing.lg }]}>
      <View style={styles.skipRow}>
        {!last ? <Button title="Skip" variant="ghost" onPress={() => void completeOnboarding()} /> : null}
      </View>

      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(s) => s.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <IconCircle icon={item.icon} size={140} background={colors.primaryTint} color={colors.primary} />
            <AppText variant="h1" style={styles.title}>
              {item.title}
            </AppText>
            <AppText variant="body" color={colors.textMuted} style={styles.body}>
              {item.body}
            </AppText>
          </View>
        )}
      />

      <View style={styles.dots} accessibilityLabel={`Slide ${index + 1} of ${SLIDES.length}`} accessible>
        {SLIDES.map((s, i) => (
          <View key={s.id} style={[styles.dot, i === index && styles.dotActive]} />
        ))}
      </View>

      <View style={styles.footer}>
        <Button
          title={last ? 'Get Started' : 'Next'}
          icon={last ? 'arrow-forward' : undefined}
          onPress={next}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  skipRow: { height: 56, alignItems: 'flex-end', justifyContent: 'center', paddingHorizontal: spacing.md },
  slide: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xxl },
  title: { marginTop: spacing.xxl, textAlign: 'center' },
  body: { marginTop: spacing.md, textAlign: 'center' },
  dots: { flexDirection: 'row', justifyContent: 'center', marginVertical: spacing.xl },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border, marginHorizontal: 4 },
  dotActive: { width: 24, backgroundColor: colors.text },
  footer: { paddingHorizontal: spacing.xl },
});
