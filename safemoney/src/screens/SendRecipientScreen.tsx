import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../components/AppText';
import { EmptyState } from '../components/EmptyState';
import { IconCircle } from '../components/IconCircle';
import { Screen } from '../components/Screen';
import { Nav } from '../navigation/types';
import { useStore } from '../store';
import { colors, fonts, radius, sizes, spacing } from '../theme';
import { Contact } from '../types';
import { haptic } from '../utils/haptics';
import { initials } from '../utils/format';
import { Alert } from 'react-native';

export default function SendRecipientScreen() {
  const navigation = useNavigation<Nav>();
  const contacts = useStore((s) => s.contacts);
  const setDraft = useStore((s) => s.setDraft);
  const resetDraft = useStore((s) => s.resetDraft);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? contacts.filter((c) => c.name.toLowerCase().includes(q) || c.handle.toLowerCase().includes(q)) : contacts;
  }, [contacts, query]);

  const pick = (c: Contact) => {
    haptic.light();
    resetDraft();
    setDraft({ recipient: c });
    navigation.navigate('SendAmount');
  };

  return (
    <Screen bottomInset>
      <View style={styles.searchRow}>
        <View style={styles.search}>
          <Ionicons name="search" size={20} color={colors.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search name or @handle"
            placeholderTextColor={colors.textMuted}
            accessibilityLabel="Search contacts"
            style={styles.input}
            autoCorrect={false}
          />
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Scan QR code"
          onPress={() => Alert.alert('Scan QR', 'QR scanning is coming soon.')}
          style={styles.qr}
        >
          <Ionicons name="qr-code" size={24} color={colors.text} />
        </Pressable>
      </View>

      {!query && contacts.length > 0 ? (
        <View style={styles.recent}>
          <AppText variant="caption" style={styles.sectionLabel}>
            Recent
          </AppText>
          <View style={styles.recentRow}>
            {contacts.slice(0, 4).map((c) => (
              <Pressable
                key={c.id}
                accessibilityRole="button"
                accessibilityLabel={`Send to ${c.name}`}
                onPress={() => pick(c)}
                style={styles.recentItem}
              >
                <IconCircle icon="person" size={56} background={colors.neutralTint} color={colors.text} />
                <AppText variant="caption" color={colors.text} numberOfLines={1} style={styles.recentName}>
                  {c.name.split(' ')[0]}
                </AppText>
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}

      <AppText variant="caption" style={styles.sectionLabel}>
        Contacts
      </AppText>
      <FlatList
        data={filtered}
        keyExtractor={(c) => c.id}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <EmptyState
            icon="search"
            title={contacts.length === 0 ? 'No contacts yet' : 'No matches'}
            message={contacts.length === 0 ? 'Contacts you send money to will appear here.' : `Nothing found for “${query}”.`}
          />
        }
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${item.name}, ${item.handle}`}
            onPress={() => pick(item)}
            style={({ pressed }) => [styles.contact, pressed && styles.pressed]}
          >
            <View style={styles.avatar}>
              <AppText variant="bodyBold">{initials(item.name)}</AppText>
            </View>
            <View style={styles.contactText}>
              <AppText variant="bodyBold">{item.name}</AppText>
              <AppText variant="caption">{item.handle}</AppText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </Pressable>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
  search: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.button,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    minHeight: sizes.touch + 4,
  },
  input: { flex: 1, marginLeft: spacing.sm, fontFamily: fonts.regular, fontSize: 16, color: colors.text },
  qr: {
    width: sizes.touch + 4,
    height: sizes.touch + 4,
    marginLeft: spacing.sm,
    borderRadius: radius.button,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionLabel: { marginTop: spacing.lg, marginBottom: spacing.sm },
  recent: {},
  recentRow: { flexDirection: 'row' },
  recentItem: { alignItems: 'center', width: 76 },
  recentName: { marginTop: spacing.xs },
  contact: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, minHeight: sizes.touch + 8 },
  pressed: { opacity: 0.6 },
  avatar: {
    width: sizes.avatar,
    height: sizes.avatar,
    borderRadius: sizes.avatar / 2,
    backgroundColor: colors.neutralTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactText: { flex: 1, marginLeft: spacing.md },
});
