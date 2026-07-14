import { useState, useRef, useEffect } from 'react';
import {
  View, StyleSheet, FlatList, TouchableOpacity, Text,
  SafeAreaView, Platform, Animated, StatusBar,
} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { apiClient } from '../../api/client';
import { Colors, FontSize, FontWeight, Spacing, Radius, Shadow } from '../../theme/tokens';

/* ─── Mock fallback order ─── */
const MOCK_ORDER = {
  orderNumber: '#2168',
  total: 141,
  items: [
    { name: 'Amul Milk 1L',     quantity: 1, emoji: '🥛', price: 56,  barcode: 'bc1' },
    { name: 'Britannia Bread',  quantity: 1, emoji: '🍞', price: 38,  barcode: 'bc2' },
    { name: 'Rice 1kg',         quantity: 1, emoji: '🍚', price: 66,  barcode: 'bc3' },
    { name: 'Aashirvaad Atta',  quantity: 1, emoji: '🌾', price: 75,  barcode: 'bc4' },
    { name: 'Amul Curd 400g',   quantity: 1, emoji: '🍶', price: 41,  barcode: 'bc5' },
  ],
};

type Step = 'view_items' | 'verify_items' | 'success';

export default function VerificationScreen({ route, navigation }: any) {
  const { order = MOCK_ORDER, token = 'mock' } = route.params || {};
  const [step, setStep] = useState<Step>('view_items');
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const checkAnimMap = useRef<Record<string, Animated.Value>>({}).current;

  // Prepare per-item check animations
  order.items.forEach((item: any) => {
    const key = item.barcode || item.name;
    if (!checkAnimMap[key]) checkAnimMap[key] = new Animated.Value(0);
  });

  const allChecked = order.items.every((i: any) => checked[i.barcode || i.name]);

  useEffect(() => {
    if (step === 'success') {
      Animated.sequence([
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 60, friction: 6 }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
    }
  }, [step]);

  const toggleCheck = (key: string) => {
    if (checked[key]) return; // no un-checking
    const anim = checkAnimMap[key];
    setChecked(prev => {
      const next = { ...prev, [key]: true };
      Animated.sequence([
        Animated.timing(anim, { toValue: 1.3, duration: 120, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 1, duration: 100, useNativeDriver: true }),
      ]).start();
      return next;
    });
  };

  const verifyAll = () => {
    const all: Record<string, boolean> = {};
    order.items.forEach((i: any) => {
      const key = i.barcode || i.name;
      all[key] = true;
      Animated.sequence([
        Animated.timing(checkAnimMap[key], { toValue: 1.25, duration: 120, useNativeDriver: true }),
        Animated.timing(checkAnimMap[key], { toValue: 1, duration: 100, useNativeDriver: true }),
      ]).start();
    });
    setChecked(all);
  };

  const handleApprove = async () => {
    setLoading(true);
    try {
      await apiClient.post('/qr/complete', { token, action: 'approved' });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      navigation.navigate('MainTabs', { screen: 'Dashboard' });
    }
  };

  /* ══════════════════════════════════════════════
     STEP 1 — View Items
  ══════════════════════════════════════════════ */
  if (step === 'view_items') {
    const total = order.items.reduce((s: number, i: any) => s + (i.price || 0), 0);

    return (
      <SafeAreaView style={styles.screen}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Customer Order</Text>
            <Text style={styles.headerSub}>{order.orderNumber}</Text>
          </View>
        </View>

        {/* Items count banner */}
        <View style={styles.orderBanner}>
          <View style={styles.orderBannerLeft}>
            <Text style={styles.orderBannerIcon}>🧾</Text>
            <View>
              <Text style={styles.orderBannerTitle}>{order.orderNumber}</Text>
              <Text style={styles.orderBannerSub}>{order.items.length} Items · ₹{total}</Text>
            </View>
          </View>
          <View style={styles.pendingPill}>
            <View style={styles.pendingDot} />
            <Text style={styles.pendingText}>Pending</Text>
          </View>
        </View>

        {/* Items list */}
        <FlatList
          data={order.items}
          keyExtractor={(item: any, i: number) => `${item.barcode}-${i}`}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }: any) => (
            <View style={[styles.itemRow, index === order.items.length - 1 && { borderBottomWidth: 0 }]}>
              <View style={styles.itemEmoji}>
                <Text style={{ fontSize: 20 }}>{item.emoji || '📦'}</Text>
              </View>
              <Text style={styles.itemName}>{item.name}</Text>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.itemPrice}>₹{item.price || '--'}</Text>
                <Text style={styles.itemQty}>x{item.quantity}</Text>
              </View>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
        />

        {/* Footer CTA */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.btnPrimary} onPress={() => setStep('verify_items')}>
            <Text style={styles.btnPrimaryText}>Verify Items →</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  /* ══════════════════════════════════════════════
     STEP 2 — Verify Items
  ══════════════════════════════════════════════ */
  if (step === 'verify_items') {
    const checkedCount = Object.values(checked).filter(Boolean).length;

    return (
      <SafeAreaView style={styles.screen}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setStep('view_items')}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Verify Items</Text>
          <View style={styles.progressPill}>
            <Text style={styles.progressPillText}>{checkedCount}/{order.items.length}</Text>
          </View>
        </View>

        {/* Progress bar */}
        <View style={styles.progressBarTrack}>
          <Animated.View
            style={[
              styles.progressBarFill,
              { width: `${(checkedCount / order.items.length) * 100}%` },
            ]}
          />
        </View>

        {/* Items with tap-to-check */}
        <FlatList
          data={order.items}
          keyExtractor={(item: any, i: number) => `v-${item.barcode}-${i}`}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 12 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }: any) => {
            const key = item.barcode || item.name;
            const done = !!checked[key];
            const scaleAn = checkAnimMap[key] || new Animated.Value(1);
            return (
              <TouchableOpacity
                style={[styles.verifyRow, done && styles.verifyRowDone]}
                onPress={() => toggleCheck(key)}
                activeOpacity={0.7}
              >
                <View style={styles.itemEmoji}>
                  <Text style={{ fontSize: 18 }}>{item.emoji || '📦'}</Text>
                </View>
                <Text style={[styles.itemName, done && styles.itemNameDone]}>{item.name}</Text>
                <Animated.View
                  style={[
                    styles.checkCircle,
                    done && styles.checkCircleDone,
                    { transform: [{ scale: scaleAn }] },
                  ]}
                >
                  {done && <Text style={styles.checkMark}>✓</Text>}
                </Animated.View>
              </TouchableOpacity>
            );
          }}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
        />

        {/* Footer */}
        <View style={styles.footer}>
          {!allChecked && (
            <TouchableOpacity style={styles.btnSecondary} onPress={verifyAll}>
              <Text style={styles.btnSecondaryText}>Verify All Items</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.btnPrimary, !allChecked && styles.btnDisabled]}
            onPress={() => { if (allChecked) setStep('success'); }}
            disabled={!allChecked}
          >
            <Text style={styles.btnPrimaryText}>
              {allChecked ? 'All Items Verified ✓' : `Tap items to verify (${checkedCount}/${order.items.length})`}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  /* ══════════════════════════════════════════════
     STEP 3 — Success / Approve & Done
  ══════════════════════════════════════════════ */
  return (
    <SafeAreaView style={styles.successScreen}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.successContent}>
        {/* Big green check circle */}
        <Animated.View style={[styles.bigCheckOuter, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.bigCheckInner}>
            <Text style={styles.bigCheckText}>✓</Text>
          </View>
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
          <Text style={styles.successTitle}>Order Verified</Text>
          <Text style={styles.successSub}>Customer can exit now</Text>

          {/* Order mini card */}
          <View style={styles.successOrderCard}>
            <View style={styles.successOrderRow}>
              <Text style={styles.successOrderLabel}>Order ID</Text>
              <Text style={styles.successOrderValue}>{order.orderNumber}</Text>
            </View>
            <View style={[styles.successOrderRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.successOrderLabel}>Items</Text>
              <Text style={styles.successOrderValue}>{order.items.length} verified ✓</Text>
            </View>
          </View>
        </Animated.View>
      </View>

      {/* Buttons */}
      <View style={styles.successFooter}>
        <TouchableOpacity
          style={styles.btnApprove}
          onPress={handleApprove}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" size="small" />
            : <Text style={styles.btnApproveText}>Approve &amp; Complete</Text>}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnNextCustomer}
          onPress={() => navigation.navigate('MainTabs', { screen: 'Dashboard' })}
        >
          <Text style={styles.btnNextCustomerText}>Next Customer →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },

  /* ── Header ── */
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 8 : 16,
    paddingBottom: 14,
    borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
    backgroundColor: '#fff',
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  backArrow: { fontSize: 18, color: Colors.text, fontWeight: FontWeight.bold },
  headerTitle: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.text },
  headerSub: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },

  progressPill: {
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 4,
    marginLeft: 'auto',
  },
  progressPillText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.primary },

  /* ── Order banner ── */
  orderBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    margin: 16, padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: Radius.lg, borderWidth: 1, borderColor: '#E2E8F0',
    ...Shadow.sm,
  },
  orderBannerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  orderBannerIcon: { fontSize: 26 },
  orderBannerTitle: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.text },
  orderBannerSub: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  pendingPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#FEF9C3', paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: Radius.full,
  },
  pendingDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#F59E0B' },
  pendingText: { fontSize: 10, fontWeight: FontWeight.bold, color: '#B45309' },

  /* ── Item rows ── */
  itemRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 14, paddingHorizontal: 4,
  },
  itemEmoji: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center',
    marginRight: 12, borderWidth: 1, borderColor: '#F1F5F9',
  },
  itemName: {
    flex: 1, fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.text,
  },
  itemNameDone: { color: Colors.textMuted, textDecorationLine: 'line-through' },
  itemPrice: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.text },
  itemQty: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },

  divider: { height: 1, backgroundColor: '#F1F5F9', marginHorizontal: 4 },

  /* ── Progress bar ── */
  progressBarTrack: {
    height: 4, backgroundColor: '#F1F5F9', marginHorizontal: 20,
  },
  progressBarFill: {
    height: '100%', backgroundColor: Colors.primary, borderRadius: 2,
  },

  /* ── Verify rows ── */
  verifyRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 14, paddingHorizontal: 12,
    borderRadius: Radius.md, marginVertical: 1,
  },
  verifyRowDone: { backgroundColor: '#F0FDF4' },
  checkCircle: {
    width: 28, height: 28, borderRadius: 14,
    borderWidth: 2, borderColor: '#CBD5E1',
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkCircleDone: {
    borderColor: Colors.primary, backgroundColor: Colors.primary,
  },
  checkMark: { color: '#fff', fontSize: 13, fontWeight: FontWeight.bold },

  /* ── Footer ── */
  footer: {
    padding: 20, borderTopWidth: 1, borderTopColor: '#F1F5F9',
    backgroundColor: '#fff', gap: 10,
  },
  btnPrimary: {
    height: 54, backgroundColor: Colors.primary,
    borderRadius: Radius.md, justifyContent: 'center', alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 5,
  },
  btnDisabled: { backgroundColor: '#A3E4B8', shadowOpacity: 0 },
  btnPrimaryText: { color: '#fff', fontWeight: FontWeight.bold, fontSize: FontSize.base },
  btnSecondary: {
    height: 48, borderRadius: Radius.md,
    borderWidth: 1.5, borderColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  btnSecondaryText: { color: Colors.primary, fontWeight: FontWeight.bold, fontSize: FontSize.sm },

  /* ── Success screen ── */
  successScreen: { flex: 1, backgroundColor: '#fff' },
  successContent: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32,
  },
  bigCheckOuter: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(22,163,74,0.12)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 28,
  },
  bigCheckInner: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35, shadowRadius: 20, elevation: 10,
  },
  bigCheckText: { color: '#fff', fontSize: 44, fontWeight: FontWeight.bold, marginTop: -4 },
  successTitle: {
    fontSize: FontSize['2xl'], fontWeight: FontWeight.extrabold,
    color: Colors.text, marginBottom: 8, textAlign: 'center',
  },
  successSub: {
    fontSize: FontSize.base, color: Colors.textMuted,
    textAlign: 'center', marginBottom: 28, lineHeight: 22,
  },
  successOrderCard: {
    width: '100%', backgroundColor: '#F8FAFC',
    borderRadius: Radius.lg, borderWidth: 1, borderColor: '#E2E8F0',
    overflow: 'hidden', ...Shadow.sm,
  },
  successOrderRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  successOrderLabel: { fontSize: FontSize.sm, color: Colors.textMuted, fontWeight: FontWeight.semibold },
  successOrderValue: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.text },

  successFooter: { padding: 20, gap: 12 },
  btnApprove: {
    height: 56, backgroundColor: Colors.primary, borderRadius: Radius.md,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3, shadowRadius: 14, elevation: 6,
  },
  btnApproveText: { color: '#fff', fontWeight: FontWeight.bold, fontSize: FontSize.base },
  btnNextCustomer: {
    height: 50, borderRadius: Radius.md,
    borderWidth: 1.5, borderColor: '#E2E8F0',
    justifyContent: 'center', alignItems: 'center',
  },
  btnNextCustomerText: { color: Colors.textMuted, fontWeight: FontWeight.bold, fontSize: FontSize.sm },
});
