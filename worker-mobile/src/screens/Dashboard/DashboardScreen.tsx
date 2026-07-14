import { useEffect, useState } from 'react';
import {
  View, StyleSheet, ScrollView, RefreshControl,
  TouchableOpacity, Text, SafeAreaView, Platform, StatusBar,
} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { logout } from '../../redux/slices/authSlice';
import { apiClient } from '../../api/client';
import { Colors, FontSize, FontWeight, Spacing, Radius, Shadow } from '../../theme/tokens';

interface DashboardData {
  worker: { name: string; employeeId: string; totalScans: number; totalApprovals: number; totalRejections: number };
  pendingOrders: number;
  todayScans: number;
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export default function DashboardScreen({ navigation }: any) {
  const worker = useAppSelector((s) => s.auth.worker);
  const dispatch = useAppDispatch();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const res = await apiClient.get('/workers/dashboard');
      setData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const displayName = worker?.name || data?.worker?.name || 'Worker';
  const initial = displayName[0].toUpperCase();
  const todayScans = data?.todayScans ?? 28;
  const pending = data?.pendingOrders ?? 2;
  const totalScans = data?.worker?.totalScans ?? 156;
  const approvals = data?.worker?.totalApprovals ?? 148;

  /* Recent activity mock */
  const recentActivity = [
    { order: '#2168', customer: 'Rahul M.', items: 5, time: '2 min ago', status: 'approved' },
    { order: '#2167', customer: 'Priya S.', items: 3, time: '8 min ago', status: 'approved' },
    { order: '#2164', customer: 'Amit K.', items: 7, time: '22 min ago', status: 'rejected' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* ── Green Header ── */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={styles.greetText}>{greeting()}, {displayName.split(' ')[0]} 👋</Text>
            <View style={styles.shiftRow}>
              <View style={styles.activeDot} />
              <Text style={styles.shiftText}>Shift Active · 09:00 AM – 06:00 PM</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={() => dispatch(logout())}>
            <Text style={{ fontSize: 18 }}>🚪</Text>
          </TouchableOpacity>
        </View>

        {/* Stats strip inside header */}
        <View style={styles.statsStrip}>
          {[
            { v: todayScans, l: 'Today', color: '#fff' },
            { v: pending,    l: 'Pending', color: '#FDE68A' },
            { v: totalScans, l: 'Total', color: '#fff' },
            { v: approvals,  l: 'Approved', color: '#A7F3D0' },
          ].map((s, i) => (
            <View key={s.l} style={[styles.statItem, i < 3 && styles.statBorder]}>
              <Text style={[styles.statVal, { color: s.color }]}>{s.v}</Text>
              <Text style={styles.statLbl}>{s.l}</Text>
            </View>
          ))}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} tintColor={Colors.primary} />
        }
      >
        {/* ── Main Scan CTA ── */}
        <TouchableOpacity style={styles.scanBtn} onPress={() => navigation.navigate('Scan')} activeOpacity={0.85}>
          <View style={styles.scanBtnIconWrap}>
            <Text style={styles.scanBtnIcon}>📷</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.scanBtnTitle}>Scan Customer QR</Text>
            <Text style={styles.scanBtnSub}>Tap to open scanner</Text>
          </View>
          <Text style={{ fontSize: 20, color: Colors.primary }}>→</Text>
        </TouchableOpacity>

        {/* ── Quick actions ── */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>
        <View style={styles.quickRow}>
          {[
            { icon: '📋', label: 'History', onPress: () => navigation.navigate('History') },
            { icon: '🔔', label: 'Alerts', onPress: () => navigation.navigate('Notifications') },
            { icon: '🚨', label: 'Fraud', onPress: () => navigation.navigate('Fraud') },
            { icon: '⚙️', label: 'Settings', onPress: () => navigation.navigate('Settings') },
          ].map(a => (
            <TouchableOpacity key={a.label} style={styles.quickItem} onPress={a.onPress}>
              <View style={styles.quickIconWrap}>
                <Text style={{ fontSize: 22 }}>{a.icon}</Text>
              </View>
              <Text style={styles.quickLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Recent Activity ── */}
        <View style={[styles.sectionRow, { marginTop: 24 }]}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity onPress={() => navigation.navigate('History')}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {recentActivity.map((act, i) => (
          <View key={i} style={styles.activityCard}>
            <View style={[styles.activityIcon, { backgroundColor: act.status === 'approved' ? Colors.primaryLight : '#FEE2E2' }]}>
              <Text style={{ fontSize: 16 }}>{act.status === 'approved' ? '✅' : '❌'}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.activityOrder}>{act.order} · {act.customer}</Text>
              <Text style={styles.activityMeta}>{act.items} items · {act.time}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: act.status === 'approved' ? Colors.primaryLight : '#FEE2E2' }]}>
              <Text style={[styles.statusText, { color: act.status === 'approved' ? Colors.primary : '#DC2626' }]}>
                {act.status === 'approved' ? 'Approved' : 'Rejected'}
              </Text>
            </View>
          </View>
        ))}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },

  /* Header */
  header: {
    backgroundColor: Colors.primary,
    paddingTop: Platform.OS === 'ios' ? 0 : 16,
    paddingBottom: 0,
    paddingHorizontal: 20,
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16 },
  avatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarText: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: '#fff' },
  greetText: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: '#fff' },
  shiftRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 },
  activeDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#34D399' },
  shiftText: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.75)', fontWeight: FontWeight.semibold },
  logoutBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center',
  },

  /* Stats strip */
  statsStrip: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.12)',
    borderRadius: Radius.lg, marginBottom: 18,
    overflow: 'hidden',
  },
  statItem: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  statBorder: { borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.15)' },
  statVal: { fontSize: FontSize.xl, fontWeight: FontWeight.extrabold },
  statLbl: { fontSize: 9, color: 'rgba(255,255,255,0.7)', fontWeight: FontWeight.bold, marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5 },

  scroll: { padding: 20 },

  /* Main scan button */
  scanBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    backgroundColor: '#fff',
    borderRadius: Radius.xl, padding: 20,
    borderWidth: 1.5, borderColor: 'rgba(22,163,74,0.2)',
    marginBottom: 24,
    ...Shadow.md,
  },
  scanBtnIconWrap: {
    width: 52, height: 52, borderRadius: 14,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center', alignItems: 'center',
  },
  scanBtnIcon: { fontSize: 26 },
  scanBtnTitle: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.text },
  scanBtnSub: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },

  /* Section headers */
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.text, textTransform: 'uppercase', letterSpacing: 0.5 },
  seeAll: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: FontWeight.bold },

  /* Quick actions */
  quickRow: { flexDirection: 'row', gap: 12 },
  quickItem: { flex: 1, alignItems: 'center', gap: 8 },
  quickIconWrap: {
    width: 56, height: 56, borderRadius: 16,
    backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: '#E2E8F0',
    ...Shadow.sm,
  },
  quickLabel: { fontSize: 11, color: Colors.textMuted, fontWeight: FontWeight.bold },

  /* Activity cards */
  activityCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderRadius: Radius.lg,
    padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: '#F1F5F9',
    ...Shadow.sm,
  },
  activityIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  activityOrder: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.text },
  activityMeta: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.full },
  statusText: { fontSize: 10, fontWeight: FontWeight.bold },
});
