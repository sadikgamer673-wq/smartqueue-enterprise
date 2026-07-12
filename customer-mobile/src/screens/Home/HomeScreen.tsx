import { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Card } from 'react-native-paper';
import { useAppSelector } from '../../redux/store';
import { Colors, FontSize, FontWeight, Spacing, Radius, Shadow } from '../../theme/tokens';

export default function HomeScreen({ navigation }: any) {
  const user = useAppSelector((s) => s.auth.user);
  const cartCount = useAppSelector((s) => s.cart.items.length);
  const [greeting, setGreeting] = useState('Hello');

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting('Good Morning');
    else if (hours < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  // Static mock recent orders
  const recentOrders = [
    { id: '2156', amount: 1240, date: 'Today, 04:30 PM', status: 'Completed' },
    { id: '2094', amount: 560, date: '2 July, 11:20 AM', status: 'Completed' },
    { id: '1987', amount: 890, date: '28 June, 07:15 PM', status: 'Completed' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      {/* Top Header Block */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.appName}>SmartQueue 🛒</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={styles.bellBtn}>
            <Text style={{ fontSize: 20 }}>🔔</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'Rahul'} 👋</Text>
        <Text style={styles.subtitle}>Which store are you visiting today?</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        {/* Main Store Banner Card */}
        <Card style={styles.storeCard}>
          <Card.Content>
            <View style={styles.storeHeader}>
              <Text style={styles.storeIcon}>🏪</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.storeName}>Reliance Smart Bazaar</Text>
                <View style={styles.storeStatusRow}>
                  <View style={styles.greenDot} />
                  <Text style={styles.storeStatusText}>NFC Road, Bengaluru  ·  Open - Closes 10:00 PM</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.startShoppingBtn}
              onPress={() => navigation.navigate('Scanner')}
            >
              <Text style={styles.startShoppingBtnText}>Start Shopping</Text>
            </TouchableOpacity>
          </Card.Content>
        </Card>

        {/* Quick Actions Row */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('Scanner')}>
            <View style={[styles.actionIconContainer, { backgroundColor: '#F0FDF4' }]}>
              <Text style={{ fontSize: 24 }}>📷</Text>
            </View>
            <Text style={styles.actionLabel}>Scan</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('Orders')}>
            <View style={[styles.actionIconContainer, { backgroundColor: '#F0FDF4' }]}>
              <Text style={{ fontSize: 24 }}>📦</Text>
            </View>
            <Text style={styles.actionLabel}>My Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('Cart')}>
            <View style={[styles.actionIconContainer, { backgroundColor: '#F0FDF4' }]}>
              <Text style={{ fontSize: 24 }}>🎟️</Text>
              {cartCount > 0 && <View style={styles.cartCountBadge}><Text style={styles.cartCountText}>{cartCount}</Text></View>}
            </View>
            <Text style={styles.actionLabel}>Coupons</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} onPress={() => alert('Smart Wallet: Balance ₹500.00')}>
            <View style={[styles.actionIconContainer, { backgroundColor: '#F0FDF4' }]}>
              <Text style={{ fontSize: 24 }}>💳</Text>
            </View>
            <Text style={styles.actionLabel}>Wallet</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Orders Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Orders')}>
            <Text style={styles.seeAllLink}>See All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.ordersScroll}>
          {recentOrders.map((order, i) => (
            <TouchableOpacity key={i} style={styles.orderCard} onPress={() => navigation.navigate('Orders')}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderNumber}>Order #{order.id}</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusBadgeText}>{order.status}</Text>
                </View>
              </View>
              <Text style={styles.orderAmount}>₹{order.amount}</Text>
              <Text style={styles.orderDate}>{order.date}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* How it works Banner */}
        <Text style={styles.sectionTitle}>How it works</Text>
        {[
          { icon: '📷', title: 'Scan each item as you shop', desc: 'Point your phone camera directly at the item barcode' },
          { icon: '💳', title: 'Pay securely in the app', desc: 'Checkout with UPI, card, or wallet options' },
          { icon: '🚪', title: 'Show your QR code at exit', desc: 'Scan the exit ticket at the gate screen to unlock the barrier' },
        ].map((step, i) => (
          <View key={i} style={styles.stepCard}>
            <View style={styles.stepNumCircle}>
              <Text style={styles.stepNumText}>{i + 1}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.stepTitle}>{step.title} {step.icon}</Text>
              <Text style={styles.stepDesc}>{step.desc}</Text>
            </View>
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Platform.OS === 'ios' ? Spacing.sm : Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  appName: { fontSize: FontSize.lg, fontWeight: FontWeight.extrabold, color: Colors.primary },
  bellBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' },
  greeting: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.text },
  subtitle: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: Spacing.xs },
  
  scroll: { padding: Spacing.lg },
  storeCard: { 
    borderRadius: Radius.lg, 
    backgroundColor: Colors.white,
    marginBottom: Spacing.xl,
    borderLeftWidth: 5,
    borderLeftColor: Colors.primary,
    ...Shadow.md,
  },
  storeHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.lg },
  storeIcon: { fontSize: 32 },
  storeName: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text },
  storeStatusRow: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.xs },
  greenDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary, marginRight: Spacing.sm },
  storeStatusText: { fontSize: FontSize.xs, color: Colors.textMuted, fontWeight: FontWeight.semibold },
  startShoppingBtn: {
    backgroundColor: Colors.primary,
    height: 52,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  startShoppingBtnText: { color: Colors.white, fontSize: FontSize.base, fontWeight: FontWeight.bold },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  sectionTitle: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: Spacing.md, marginTop: Spacing.sm },
  seeAllLink: { fontSize: FontSize.sm, color: Colors.secondary, fontWeight: FontWeight.semibold },

  actionsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.xl },
  actionItem: { alignItems: 'center', flex: 1 },
  actionIconContainer: {
    width: 64,
    height: 64,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    ...Shadow.sm,
    position: 'relative',
  },
  actionLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.text },
  cartCountBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: Colors.danger,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  cartCountText: { color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold },

  ordersScroll: { paddingBottom: Spacing.md, gap: Spacing.md, marginBottom: Spacing.lg },
  orderCard: {
    width: 170,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  orderNumber: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.text },
  statusBadge: { backgroundColor: '#DCFCE7', paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: Radius.sm },
  statusBadgeText: { fontSize: 10, color: Colors.primaryDark, fontWeight: FontWeight.bold },
  orderAmount: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text, marginVertical: Spacing.sm },
  orderDate: { fontSize: FontSize.xs, color: Colors.textMuted },

  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.white,
    padding: Spacing.base,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
  },
  stepNumCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumText: { color: Colors.primaryDark, fontWeight: FontWeight.bold, fontSize: FontSize.base },
  stepTitle: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.text },
  stepDesc: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
});
