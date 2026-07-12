import { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, SafeAreaView, Animated, Platform, ScrollView } from 'react-native';
import { ActivityIndicator, Divider } from 'react-native-paper';
import { apiClient } from '../../api/client';
import { io, Socket } from 'socket.io-client';
import { Colors, FontSize, FontWeight, Spacing, Radius, Shadow } from '../../theme/tokens';
import { useAppDispatch } from '../../redux/store';
import { clearCart } from '../../redux/slices/cartSlice';

export default function QRCodeScreen({ route, navigation }: any) {
  const { orderId, items = [] } = route.params || {};
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [timeLeft, setTimeLeft] = useState(105); // 1:45 countdown
  
  const dispatch = useAppDispatch();
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchQR = async () => {
      try {
        const { data } = await apiClient.get(`/qr/generate/${orderId}`);
        setQrImage(data.data.qrImage);
      } catch (err) {
        console.error('Error fetching QR:', err);
      }
    };
    fetchQR();

    // Timer countdown
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Listen for real-time exit verification (using correct local IP)
    let socket: Socket;
    try {
      socket = io('http://192.168.0.104:5000');
      socket.on('order:verified', (payload: any) => {
        if (payload.orderId === orderId) {
          setVerified(true);
          dispatch(clearCart());
          // Play scale check animation
          Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 1.2, duration: 300, useNativeDriver: true }),
            Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
          ]).start();
        }
      });
    } catch (err) {
      console.error('Socket init error:', err);
    }

    return () => {
      clearInterval(timer);
      socket?.disconnect();
    };
  }, [orderId]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Screen 10: At Exit Gate (Verified Success State)
  if (verified) {
    return (
      <SafeAreaView style={styles.successContainer}>
        <View style={styles.successContent}>
          <Animated.View style={[styles.successIconOuter, { transform: [{ scale: scaleAnim }] }]}>
            <Text style={{ fontSize: 50 }}>✅</Text>
          </Animated.View>
          <Text style={styles.successTitle}>Exit Approved!</Text>
          <Text style={styles.successSubtitle}>Thank you for shopping with SmartQueue!</Text>
          
          {/* Verified Items Checklist */}
          <View style={styles.successInfoCard}>
            <Text style={styles.successInfoLabel}>Verified Items</Text>
            <Divider style={{ marginVertical: Spacing.sm, backgroundColor: 'rgba(255,255,255,0.2)' }} />
            {items.map((item: any, i: number) => (
              <View key={i} style={styles.successItemRow}>
                <Text style={styles.successCheckIcon}>✓</Text>
                <Text style={styles.successItemText}>{item.name} x {item.quantity}</Text>
              </View>
            ))}
          </View>

          {/* Thank You Box */}
          <View style={styles.thankYouBox}>
            <Text style={styles.thankYouText}>Thank You! Visit Again 🤝</Text>
          </View>

          <TouchableOpacity 
            style={styles.doneBtn} 
            onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
          >
            <Text style={styles.doneBtnText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Screen 9: QR Pass (Instant)
  return (
    <SafeAreaView style={styles.container}>
      {/* Top success Banner header block */}
      <View style={styles.topBanner}>
        <View style={styles.successCircle}>
          <Text style={styles.successCheck}>✓</Text>
        </View>
        <Text style={styles.bannerHeading}>Payment Successful!</Text>
        <Text style={styles.bannerSubheading}>Show this QR at the exit gate</Text>
        
        <View style={[styles.timerBadge, { backgroundColor: timeLeft > 0 ? Colors.primaryLight : Colors.dangerLight }]}>
          <View style={[styles.statusDot, { backgroundColor: timeLeft > 0 ? Colors.primary : Colors.danger }]} />
          <Text style={[styles.timerText, { color: timeLeft > 0 ? Colors.primaryDark : Colors.danger }]}>
            {timeLeft > 0 ? `Valid  ·  Expires in ${formatTime(timeLeft)}` : 'Expired'}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        {/* QR Code box */}
        <View style={styles.qrCard}>
          {qrImage ? (
            <Image source={{ uri: qrImage }} style={styles.qrImg} />
          ) : (
            <View style={styles.qrLoading}>
              <ActivityIndicator color={Colors.primary} size="large" />
              <Text style={styles.loadingText}>Generating pass...</Text>
            </View>
          )}
        </View>

        <Text style={styles.orderLabel}>Order #{orderId.slice(-6).toUpperCase()}</Text>

        <TouchableOpacity 
          style={styles.goOrdersBtn} 
          onPress={() => navigation.navigate('MainTabs', { screen: 'Orders' })}
        >
          <Text style={styles.goOrdersBtnText}>Go to Orders</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topBanner: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingTop: Platform.OS === 'ios' ? 44 : 20,
  },
  successCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  successCheck: { color: Colors.white, fontSize: 20, fontWeight: 'bold' },
  bannerHeading: { fontSize: FontSize.lg, fontWeight: FontWeight.extrabold, color: Colors.primaryDark },
  bannerSubheading: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  timerBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: 6, borderRadius: Radius.full, marginTop: Spacing.md },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: Spacing.sm },
  timerText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold },

  scroll: { padding: Spacing.lg, alignItems: 'center' },
  
  qrCard: {
    width: 260,
    height: 260,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.md,
    marginBottom: Spacing.lg,
  },
  qrImg: { width: 220, height: 220 },
  qrLoading: { alignItems: 'center' },
  loadingText: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: Spacing.md },
  orderLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: Spacing.xl },

  goOrdersBtn: { width: '100%', height: 50, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.primary, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.white },
  goOrdersBtnText: { color: Colors.primaryDark, fontWeight: FontWeight.bold, fontSize: FontSize.sm },

  // Success Screen (Screen 10: At Exit Gate)
  successContainer: { flex: 1, backgroundColor: Colors.primary, justifyContent: 'center' },
  successContent: { alignItems: 'center', padding: Spacing.xl },
  successIconOuter: { width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.xl, ...Shadow.lg },
  successTitle: { fontSize: FontSize['2xl'], fontWeight: FontWeight.extrabold, color: Colors.white, marginBottom: Spacing.sm },
  successSubtitle: { fontSize: FontSize.base, color: '#DCFCE7', textAlign: 'center', marginBottom: Spacing['2xl'] },
  
  successInfoCard: { width: '100%', backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderRadius: Radius.md, marginBottom: Spacing.xl },
  successInfoLabel: { fontSize: FontSize.xs, color: '#DCFCE7', textTransform: 'uppercase', fontWeight: FontWeight.bold },
  successItemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.xs },
  successCheckIcon: { color: Colors.white, fontWeight: 'bold', marginRight: Spacing.sm, fontSize: FontSize.base },
  successItemText: { color: Colors.white, fontSize: FontSize.sm },

  thankYouBox: { width: '100%', backgroundColor: Colors.white, paddingVertical: Spacing.md, borderRadius: Radius.md, alignItems: 'center', marginBottom: Spacing['3xl'] },
  thankYouText: { color: Colors.primaryDark, fontWeight: FontWeight.extrabold, fontSize: FontSize.base },
  
  doneBtn: { width: '100%', height: 54, backgroundColor: Colors.white, borderRadius: Radius.md, justifyContent: 'center', alignItems: 'center', ...Shadow.md },
  doneBtnText: { color: Colors.primaryDark, fontWeight: FontWeight.bold, fontSize: FontSize.base },
});
