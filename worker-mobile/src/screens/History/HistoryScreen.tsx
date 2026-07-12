import { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Text, SafeAreaView, Platform } from 'react-native';
import { ActivityIndicator, Divider } from 'react-native-paper';
import { useAppSelector } from '../../redux/store';
import { apiClient } from '../../api/client';
import { Colors, FontSize, FontWeight, Spacing, Radius, Shadow } from '../../theme/tokens';

interface OrderItem {
  name: string;
  quantity: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
  user?: {
    name: string;
  };
  workerVerification?: {
    action: 'approved' | 'rejected';
    verifiedAt: string;
    notes?: string;
  };
}

export default function HistoryScreen() {
  const worker = useAppSelector((s) => s.auth.worker);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'today' | 'week' | 'month'>('today');

  const fetchHistory = async () => {
    if (!worker?.storeId) return;
    try {
      const { data } = await apiClient.get('/orders/admin', {
        params: { storeId: worker.storeId, limit: 50 },
      });
      const docs = data.data.docs || data.data || [];
      // Filter orders that have been verified by a worker
      const verifiedOrders = docs.filter((o: Order) => o.workerVerification);
      setOrders(verifiedOrders);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [worker]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistory();
  };

  // Filter orders based on active tab
  const getFilteredOrders = () => {
    const now = new Date();
    return orders.filter((o) => {
      const verifiedDate = new Date(o.workerVerification?.verifiedAt || o.createdAt);
      const diffMs = now.getTime() - verifiedDate.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);

      if (activeTab === 'today') return diffDays <= 1;
      if (activeTab === 'week') return diffDays <= 7;
      return diffDays <= 30; // month
    });
  };

  const renderHistoryItem = ({ item }: { item: Order }) => {
    const customerName = item.user?.name || 'Rahul Sharma';
    const formattedTime = new Date(item.workerVerification?.verifiedAt || item.createdAt).toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderIdText}>Order #{item.orderNumber.slice(-4).toUpperCase()}</Text>
            <Text style={styles.customerNameText}>{customerName}</Text>
            <Text style={styles.timeText}>{formattedTime}</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Verified</Text>
          </View>
        </View>
        <Divider style={{ marginVertical: Spacing.sm }} />
        <Text style={styles.itemsSummary}>
          {item.items.map((i) => `${i.name} x${i.quantity}`).join(', ')}
        </Text>
        <Text style={styles.totalText}>Total Amount: ₹{item.total}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const filtered = getFilteredOrders();

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header Block */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Scan History</Text>
      </View>

      {/* Tabs Row */}
      <View style={styles.tabContainer}>
        {(['today', 'week', 'month'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        renderItem={renderHistoryItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No history records found for this period</Text>
        }
        contentContainerStyle={{ padding: Spacing.lg, paddingBottom: 40 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingTop: Platform.OS === 'ios' ? 44 : 20,
  },
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    padding: Spacing.xs,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  tabButton: { flex: 1, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: Radius.sm },
  tabActive: { backgroundColor: Colors.primaryLight },
  tabText: { fontSize: 11, fontWeight: FontWeight.bold, color: Colors.textMuted },
  tabTextActive: { color: Colors.primaryDark },

  orderCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  orderIdText: { fontSize: FontSize.sm, fontWeight: FontWeight.extrabold, color: Colors.text },
  customerNameText: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  timeText: { fontSize: FontSize.xs, color: Colors.textLight, marginTop: 2 },
  badge: { backgroundColor: '#DCFCE7', paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: Radius.full },
  badgeText: { fontSize: 10, color: Colors.primaryDark, fontWeight: FontWeight.extrabold },
  itemsSummary: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: Spacing.xs },
  totalText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.text, marginTop: Spacing.xs },
  emptyText: { textAlign: 'center', color: Colors.textLight, marginTop: 40, fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
});
