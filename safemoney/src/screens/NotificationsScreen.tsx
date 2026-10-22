import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { AppText } from '../components/AppText';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { IconCircle } from '../components/IconCircle';
import { Screen } from '../components/Screen';
import { useStore } from '../store';
import { colors, spacing } from '../theme';
import { formatDate } from '../utils/format';

export default function NotificationsScreen() {
  const notifications = useStore((s) => s.notifications);
  return (
    <Screen bottomInset>
      <FlatList
        data={notifications}
        keyExtractor={(n) => n.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState icon="notifications-off-outline" title="You’re all caught up" message="New alerts about your account will show up here." />
        }
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <IconCircle icon="notifications" background={colors.neutralTint} color={colors.text} />
            <View style={styles.text}>
              <AppText variant="bodyBold">{item.title}</AppText>
              <AppText variant="body" color={colors.textMuted}>
                {item.body}
              </AppText>
              <AppText variant="caption">{formatDate(item.date)}</AppText>
            </View>
          </Card>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { paddingVertical: spacing.md },
  card: { flexDirection: 'row', marginBottom: spacing.md },
  text: { flex: 1, marginLeft: spacing.md },
});
