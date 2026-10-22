import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { Field } from '../components/Field';
import { IconCircle } from '../components/IconCircle';
import { Nav } from '../navigation/types';
import { DEMO_EMAIL, DEMO_PASSWORD } from '../services/mockData';
import { useStore } from '../store';
import { colors, spacing } from '../theme';
import { haptic } from '../utils/haptics';

export default function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const login = useStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email.trim() || !password) return setError('Enter your email and password.');
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigation.navigate('TwoFactor');
    } catch (e) {
      haptic.error();
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.xxl, paddingBottom: insets.bottom + spacing.xl }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.brand}>
          <IconCircle icon="shield-checkmark" size={72} background={colors.primaryTint} color={colors.primary} />
          <AppText variant="h1" style={styles.title}>
            Welcome to SafeMoney
          </AppText>
          <AppText variant="caption">Log in to continue</AppText>
        </View>

        <Field
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          textContentType="emailAddress"
          placeholder="you@example.com"
        />
        <Field
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          textContentType="password"
          placeholder="Your password"
          error={error}
          onSubmitEditing={submit}
        />

        <Button title="Log In" icon="log-in-outline" onPress={submit} loading={loading} />

        <Button
          title="Use demo account"
          variant="ghost"
          onPress={() => {
            setEmail(DEMO_EMAIL);
            setPassword(DEMO_PASSWORD);
            setError(null);
          }}
          style={styles.demo}
        />
        <AppText variant="caption" style={styles.hint}>
          Demo: {DEMO_EMAIL} / {DEMO_PASSWORD}
        </AppText>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: spacing.xl },
  brand: { alignItems: 'center', marginBottom: spacing.xxl },
  title: { marginTop: spacing.lg, marginBottom: spacing.xs },
  demo: { marginTop: spacing.sm },
  hint: { textAlign: 'center' },
});
