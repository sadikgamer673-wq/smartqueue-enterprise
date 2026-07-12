import { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Text, SafeAreaView, Platform, StatusBar } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { logout } from '../../redux/slices/authSlice';
import { apiClient } from '../../api/client';
import { Colors, FontSize, FontWeight, Spacing, Radius, Shadow } from '../../theme/tokens';

interface DashboardData {
  worker: {
    name: string;
    employeeId: string;
    totalScans: number;
    totalApprovals: number;
    totalRejections: number;
  };
  pendingOrders: number;
  todayScans: number;
}

export default function DashboardScreen({ navigation }: any) {
  const worker = useAppSelector((s) => s.auth.worker);
  const dispatch = useAppDispatch();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const res = await apiClient.get('/workers/dashboard');
      setData(res.data.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const initial = (worker?.name || data?.worker?.name || 'Arjun')[0].toUpperCase();
  const displayName = worker?.name || 'Arjun';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      {/* Top Header Block */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <View style={{ marginLeft: Spacing.md, flex: 1 }}>
          <Text style={styles.workerGreeting}>Hello, {displayName} 👋</Text>
          <Text style={styles.subtitle}>Good Morning</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={() => dispatch(logout())}>
          <Text style={{ fontSize: 18 }}>🚪</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Shift Timings Active Card */}
        <View style={styles.shiftCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.shiftTitle}>Current Shift</Text>
            <Text style={styles.shiftHours}>09:00 AM - 06:00 PM</Text>
          </View>
          <View style={styles.activePill}>
            <View style={styles.activeDot} />
            <Text style={styles.activeText}>Active</Text>
          </View>
        </View>

        {/* 3 Columns stats row matching Storyboard Screen 3 */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: Colors.primary }]}>
              {data?.todayScans ?? 28}
            </Text>
            <Text style={styles.statLabel}>Verified Today</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: Colors.warning }]}>
              {data?.pendingOrders ?? 2}
            </Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: Colors.text }]}>
              {data?.worker?.totalScans ?? 156}
            </Text>
            <Text style={styles.statLabel}>Total Verified</Text>
          </View>
        </View>

        {/* Action Button: Scan Customer QR */}
        <TouchableOpacity 
          style={styles.actionBtn} 
          onPress={() => navigation.navigate('Scan')}
        >
          <Text style={styles.actionBtnIcon}>📷</Text>
          <Text style={styles.actionBtnText}>Scan Customer QR</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingTop: Platform.OS === 'ios' ? 44 : 20,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.primaryDark },
  workerGreeting: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.text },
  subtitle: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  logoutBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surfaceAlt, justifyContent: 'center', alignItems: 'center' },
  
  scroll: { padding: Spacing.lg },

  shiftCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669', // Dark green matching storyboard
    borderRadius: Radius.md,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
    ...Shadow.sm,
  },
  shiftTitle: { color: '#D1FAE5', fontSize: FontSize.xs, fontWeight: FontWeight.semibold, textTransform: 'uppercase' },
  shiftHours: { color: Colors.white, fontSize: FontSize.base, fontWeight: FontWeight.bold, marginTop: 4 },
  activePill: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: Spacing.md, paddingVertical: 4, borderRadius: Radius.full },
  activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#34D399', marginRight: 6 },
  activeText: { color: Colors.white, fontSize: FontSize.xs, fontWeight: FontWeight.bold },

  statsRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing['2xl'] },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    ...Shadow.sm,
  },
  statValue: { fontSize: FontSize.xl, fontWeight: FontWeight.extrabold },
  statLabel: { fontSize: FontSize.xs - 1, color: Colors.textMuted, marginTop: Spacing.xs, fontWeight: FontWeight.bold, textAlign: 'center' },
  
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: Radius.md,
    gap: Spacing.md,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  actionBtnIcon: { fontSize: 20 },
  actionBtnText: { color: Colors.white, fontSize: FontSize.base, fontWeight: FontWeight.bold },
});
