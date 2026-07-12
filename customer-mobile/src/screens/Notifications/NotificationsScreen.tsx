import { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, ActivityIndicator, List, Divider, Button } from 'react-native-paper';
import { apiClient } from '../../api/client';

interface Notification {
  _id: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    try {
      const { data } = await apiClient.get('/notifications');
      setNotifications(data.data.docs || data.data || []);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await apiClient.patch('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await apiClient.patch(`/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.headerTitle}>
          Notifications
        </Text>
        {notifications.some((n) => !n.isRead) && (
          <Button onPress={handleMarkAllRead} labelStyle={{ fontSize: 12 }}>
            Mark all read
          </Button>
        )}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <List.Item
            title={item.title}
            description={item.body}
            left={(props) => (
              <List.Icon
                {...props}
                icon={item.isRead ? 'bell-outline' : 'bell'}
                color={item.isRead ? '#9CA3AF' : '#4F46E5'}
              />
            )}
            style={!item.isRead ? styles.unreadItem : undefined}
            onPress={() => !item.isRead && handleMarkRead(item._id)}
          />
        )}
        ItemSeparatorComponent={() => <Divider />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchNotifications} />}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No notifications yet</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', paddingTop: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 8 },
  headerTitle: { fontWeight: '700' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  unreadItem: { backgroundColor: '#EEF2FF' },
  emptyText: { textAlign: 'center', color: '#6B7280', marginTop: 40, fontSize: 14 },
});
