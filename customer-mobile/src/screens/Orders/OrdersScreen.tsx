import { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Modal, TouchableOpacity, Text, SafeAreaView, Platform } from 'react-native';
import { ActivityIndicator, Divider } from 'react-native-paper';
import { apiClient } from '../../api/client';
import { Colors, FontSize, FontWeight, Spacing, Radius, Shadow } from '../../theme/tokens';

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  total: number;
  status: 'pending' | 'paid' | 'processing' | 'verified' | 'completed' | 'cancelled' | 'refunded';
  createdAt: string;
  items: OrderItem[];
}

export default function OrdersScreen({ navigation }: any) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    try {
      const { data } = await apiClient.get('/orders/my');
      setOrders(data.data.docs || data.data || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const getStatusConfig = (status: Order['status']) => {
    switch (status) {
      case 'completed':
      case 'verified':
        return { bg: Colors.primaryLight, text: Colors.primaryDark };
      case 'paid':
      case 'processing':
        return { bg: Colors.secondaryLight, text: Colors.secondary };
      case 'pending':
        return { bg: Colors.warningLight, text: Colors.warning };
      case 'cancelled':
      case 'refunded':
        return { bg: Colors.dangerLight, text: Colors.danger };
      default:
        return { bg: Colors.border, text: Colors.textMuted };
    }
  };

  const renderOrderItem = ({ item }: { item: Order }) => {
    const formattedDate = new Date(item.createdAt).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    
    const statusCfg = getStatusConfig(item.status);

    return (
      <TouchableOpacity style={styles.orderCard} onPress={() => setSelectedOrder(item)}>
        <View style={styles.cardHeader}>
          <Text style={styles.orderNumber}>{item.orderNumber}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusCfg.bg }]}>
            <Text style={[styles.statusBadgeText, { color: statusCfg.text }]}>
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>
        <Text style={styles.dateText}>{formattedDate}</Text>
        <Divider style={{ marginVertical: Spacing.sm }} />
        <View style={styles.cardFooter}>
          <Text style={styles.itemsCount}>
            🛒 {item.items.length} {item.items.length === 1 ? 'item' : 'items'}
          </Text>
          <Text style={styles.totalAmount}>
            ₹{item.total.toFixed(2)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Block */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={renderOrderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <Text style={styles.emptySubtitle}>All orders placed via self-checkout will appear here.</Text>
            <TouchableOpacity
              style={styles.goShoppingBtn}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.goShoppingBtnText}>Go Shopping</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Slide up Detail Modal */}
      <Modal
        visible={!!selectedOrder}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedOrder(null)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => setSelectedOrder(null)} />
          <View style={styles.modalContent}>
            {selectedOrder && (
              <>
                <View style={styles.modalHeader}>
                  <View>
                    <Text style={styles.modalTitle}>Order Details</Text>
                    <Text style={styles.modalSubtitle}>{selectedOrder.orderNumber}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedOrder(null)} style={styles.closeBtn}>
                    <Text style={styles.closeBtnText}>✕</Text>
                  </TouchableOpacity>
                </View>

                <FlatList
                  data={selectedOrder.items}
                  keyExtractor={(item, index) => `${item.productId}-${index}`}
                  style={styles.modalItemsList}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <View style={styles.modalItemRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemMeta}>
                          ₹{item.price} × {item.quantity}
                        </Text>
                      </View>
                      <Text style={styles.itemTotal}>₹{(item.price * item.quantity).toFixed(2)}</Text>
                    </View>
                  )}
                  ItemSeparatorComponent={() => <Divider />}
                />

                <Divider />

                <View style={styles.modalTotalRow}>
                  <Text style={styles.modalTotalLabel}>Total Paid</Text>
                  <Text style={styles.modalTotalVal}>
                    ₹{selectedOrder.total.toFixed(2)}
                  </Text>
                </View>

                {['paid', 'processing', 'verified'].includes(selectedOrder.status) && (
                  <TouchableOpacity
                    style={styles.modalActionBtn}
                    onPress={() => {
                      const order = selectedOrder;
                      setSelectedOrder(null);
                      navigation.navigate('QRCode', { orderId: order._id, items: order.items });
                    }}
                  >
                    <Text style={styles.modalActionBtnText}>View Exit QR Code</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.modalCancelBtn}
                  onPress={() => setSelectedOrder(null)}
                >
                  <Text style={styles.modalCancelBtnText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  
  listContent: { padding: Spacing.lg, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  orderCard: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    ...Shadow.sm,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderNumber: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.text },
  statusBadge: { paddingHorizontal: Spacing.md, paddingVertical: 4, borderRadius: Radius.sm },
  statusBadgeText: { fontSize: 10, fontWeight: FontWeight.extrabold },
  dateText: { color: Colors.textMuted, fontSize: FontSize.xs, marginTop: Spacing.xs },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemsCount: { color: Colors.textMuted, fontSize: FontSize.xs, fontWeight: FontWeight.semibold },
  totalAmount: { fontSize: FontSize.base, fontWeight: FontWeight.extrabold, color: Colors.text },

  emptyContainer: { padding: 40, alignItems: 'center', justifyContent: 'center' },
  emptyIcon: { fontSize: 64, marginBottom: Spacing.lg },
  emptyTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text },
  emptySubtitle: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.xs, marginBottom: Spacing.xl },
  goShoppingBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    height: 48,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goShoppingBtnText: { color: Colors.white, fontWeight: FontWeight.bold, fontSize: FontSize.sm },

  modalOverlay: { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'flex-end' },
  modalContent: { backgroundColor: Colors.white, borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, padding: Spacing.xl, minHeight: 380, ...Shadow.lg },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.base },
  modalTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text },
  modalSubtitle: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.surfaceAlt, justifyContent: 'center', alignItems: 'center' },
  closeBtnText: { fontSize: FontSize.xs, color: Colors.textMuted, fontWeight: FontWeight.bold },
  
  modalItemsList: { maxHeight: 220, marginVertical: Spacing.base },
  modalItemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.base },
  itemName: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.text },
  itemMeta: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  itemTotal: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.text },

  modalTotalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.lg },
  modalTotalLabel: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.text },
  modalTotalVal: { fontSize: FontSize.lg, fontWeight: FontWeight.extrabold, color: Colors.primaryDark },

  modalActionBtn: {
    height: 52,
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  modalActionBtnText: { color: Colors.white, fontWeight: FontWeight.bold, fontSize: FontSize.base },
  modalCancelBtn: { height: 50, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center' },
  modalCancelBtnText: { color: Colors.textMuted, fontWeight: FontWeight.bold, fontSize: FontSize.sm },
});
