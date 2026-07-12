import { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, SafeAreaView, Platform, Animated, Image } from 'react-native';
import { Camera } from 'expo-camera';
import { ActivityIndicator, Divider } from 'react-native-paper';
import { apiClient } from '../../api/client';
import { Colors, FontSize, FontWeight, Spacing, Radius, Shadow } from '../../theme/tokens';

export default function VerificationScreen({ route, navigation }: any) {
  const { order, token } = route.params || { order: { orderNumber: '#2156', total: 141, items: [{ name: 'Amul Milk 1L', quantity: 1, barcode: '123' }, { name: 'Britannia Bread', quantity: 1, barcode: '456' }] }, token: 'mock' };
  const [step, setStep] = useState<'customer_order' | 'verify_items' | 'success'>('customer_order');
  const [loading, setLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  
  // Keep track of verified items
  const [verifiedCount, setVerifiedCount] = useState(0);
  const [scannedItems, setScannedItems] = useState<Record<string, boolean>>({});
  
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const laserPosition = useRef(new Animated.Value(0)).current;

  // Request camera permission for item scanning step
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Loop scan laser animation in scan step
  useEffect(() => {
    if (step === 'verify_items') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(laserPosition, { toValue: 120, duration: 1500, useNativeDriver: true }),
          Animated.timing(laserPosition, { toValue: 0, duration: 1500, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [step]);

  const startVerification = () => {
    setStep('verify_items');
  };

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (loading) return;
    
    // Find item with matching barcode
    const matchedItem = order.items.find((item: any) => item.barcode === data || data.includes(item.barcode));
    
    if (matchedItem && !scannedItems[matchedItem.productId || matchedItem.name]) {
      const newScanned = { ...scannedItems, [matchedItem.productId || matchedItem.name]: true };
      setScannedItems(newScanned);
      const newCount = verifiedCount + 1;
      setVerifiedCount(newCount);
      
      // Auto-advance if we verified 2 items (or all items if order size is smaller)
      const targetCount = Math.min(2, order.items.length);
      if (newCount >= targetCount) {
        setStep('success');
        // Play success check pop animation
        Animated.sequence([
          Animated.timing(scaleAnim, { toValue: 1.2, duration: 300, useNativeDriver: true }),
          Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
        ]).start();
      }
    }
  };

  // Mock scan verification for testing/demo
  const handleManualVerification = () => {
    setStep('success');
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.2, duration: 300, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  };

  const handleApproveComplete = async () => {
    setLoading(true);
    try {
      await apiClient.post('/qr/complete', { token, action: 'approved' });
      navigation.navigate('MainTabs', { screen: 'Dashboard' });
    } catch (err) {
      console.error(err);
      // Fallback
      navigation.navigate('MainTabs', { screen: 'Dashboard' });
    } finally {
      setLoading(false);
    }
  };

  const targetItemsToVerify = Math.min(2, order.items.length);

  // 1. STEP 1: Customer Order (Screen 5)
  if (step === 'customer_order') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.closeBtnText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Customer Order</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.orderCard}>
            <Text style={styles.orderNumber}>Order ID #{order.orderNumber.slice(-6).toUpperCase()}</Text>
            <Text style={styles.metaText}>{order.items.length} items</Text>
          </View>

          {/* Items checklist view */}
          <Text style={styles.sectionTitle}>Items list</Text>
          <FlatList
            data={order.items}
            keyExtractor={(item, idx) => `${item.barcode}-${idx}`}
            renderItem={({ item }) => (
              <View style={styles.itemRow}>
                <Text style={styles.itemBullet}>•</Text>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQty}>x {item.quantity}</Text>
              </View>
            )}
            ItemSeparatorComponent={() => <Divider />}
            style={{ flex: 1 }}
          />

          {/* Verification Target Banner */}
          <View style={styles.verificationTargetCard}>
            <Text style={styles.targetTitleText}>Verify any {targetItemsToVerify} items</Text>
            <Text style={styles.targetSubtitleText}>Selected 0/{targetItemsToVerify}</Text>
            <View style={styles.targetProgressBar}>
              <View style={[styles.targetProgressBarFill, { width: '0%' }]} />
            </View>
          </View>

          <TouchableOpacity style={styles.btnPrimary} onPress={startVerification}>
            <Text style={styles.btnText}>Start Verification</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // 2. STEP 2: Verify Items Screen (Screen 6)
  if (step === 'verify_items') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => setStep('customer_order')}>
            <Text style={styles.closeBtnText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Verify Items</Text>
        </View>

        <View style={styles.scannerWrapper}>
          {hasPermission ? (
            <Camera
              style={StyleSheet.absoluteFillObject}
              onBarCodeScanned={handleBarcodeScanned}
              barCodeScannerSettings={{
                barCodeTypes: ['ean13', 'ean8', 'upca', 'upce', 'code128'],
              }}
            />
          ) : (
            <View style={styles.cameraPlaceholder}>
              <Text style={{ color: Colors.white }}>No camera access</Text>
            </View>
          )}

          {/* Scanner corner brackets cutout */}
          <View style={styles.scannerCutoutContainer}>
            <View style={styles.scanBox}>
              <View style={[styles.bracket, styles.topLeft]} />
              <View style={[styles.bracket, styles.topRight]} />
              <View style={[styles.bracket, styles.bottomLeft]} />
              <View style={[styles.bracket, styles.bottomRight]} />

              <Animated.View style={[styles.laser, { transform: [{ translateY: laserPosition }] }]} />
            </View>
            <Text style={styles.scanHintText}>Waiting for scan...</Text>
          </View>
        </View>

        <View style={styles.scanFooter}>
          <View style={styles.verificationTargetCard}>
            <Text style={styles.targetTitleText}>{verifiedCount} of {targetItemsToVerify} items Verified</Text>
            <View style={styles.targetProgressBar}>
              <View style={[styles.targetProgressBarFill, { width: `${(verifiedCount / targetItemsToVerify) * 100}%` }]} />
            </View>
          </View>

          <TouchableOpacity style={styles.btnOutline} onPress={handleManualVerification}>
            <Text style={styles.btnOutlineText}>Manual Entry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // 3. STEP 3: Verification Success (Screen 7)
  return (
    <SafeAreaView style={styles.successContainer}>
      <View style={styles.successContent}>
        <Animated.View style={[styles.successIconOuter, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={{ fontSize: 50 }}>✓</Text>
        </Animated.View>
        
        <Text style={styles.successTitle}>Customer Verified!</Text>
        <Text style={styles.successSubtitle}>
          Order ID #{order.orderNumber.slice(-6).toUpperCase()}{"\n"}
          All selected items are verified
        </Text>

        <TouchableOpacity 
          style={styles.btnApproveComplete} 
          onPress={handleApproveComplete}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} size="small" />
          ) : (
            <Text style={styles.btnApproveCompleteText}>Approve & Complete</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.btnNextCustomer} 
          onPress={() => navigation.navigate('MainTabs', { screen: 'Dashboard' })}
        >
          <Text style={styles.btnNextCustomerText}>Next Customer</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
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
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.surfaceAlt, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md },
  closeBtnText: { fontSize: 18, color: Colors.textMuted, fontWeight: 'bold' },
  headerTitle: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.text },

  content: { flex: 1, padding: Spacing.lg },
  
  orderCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
    ...Shadow.sm,
  },
  orderNumber: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text },
  metaText: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: Spacing.xs },

  sectionTitle: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: Spacing.md, paddingLeft: Spacing.xs },
  
  itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md, paddingHorizontal: Spacing.xs },
  itemBullet: { fontSize: 18, color: Colors.textMuted, marginRight: Spacing.sm },
  itemName: { flex: 1, fontSize: FontSize.sm, color: Colors.text, fontWeight: FontWeight.semibold },
  itemQty: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.text },

  verificationTargetCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
    ...Shadow.sm,
    width: '100%',
  },
  targetTitleText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.text, textAlign: 'center' },
  targetSubtitleText: { fontSize: FontSize.xs, color: Colors.textMuted, textAlign: 'center', marginTop: 2 },
  targetProgressBar: { height: 6, backgroundColor: Colors.surfaceAlt, borderRadius: 3, marginTop: Spacing.sm, overflow: 'hidden' },
  targetProgressBarFill: { height: '100%', backgroundColor: Colors.primary },

  btnPrimary: {
    height: 54,
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  btnText: { color: Colors.white, fontSize: FontSize.base, fontWeight: FontWeight.bold },

  // Verification Screen 2 (Scanner)
  scannerWrapper: { flex: 1, backgroundColor: 'black', position: 'relative' },
  cameraPlaceholder: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  scannerCutoutContainer: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  scanBox: { width: 200, height: 120, position: 'relative', justifyContent: 'center', alignItems: 'center' },
  bracket: { position: 'absolute', width: 24, height: 24, borderColor: Colors.primary },
  topLeft: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 8 },
  topRight: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 8 },
  bottomLeft: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 8 },
  bottomRight: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 8 },
  laser: { width: '90%', height: 2, backgroundColor: Colors.primary, position: 'absolute', top: 5 },
  scanHintText: { color: Colors.white, fontSize: FontSize.sm, fontWeight: FontWeight.semibold, marginTop: Spacing.lg },

  scanFooter: { padding: Spacing.lg, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.border },
  btnOutline: { height: 50, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center' },
  btnOutlineText: { color: Colors.textMuted, fontWeight: FontWeight.bold, fontSize: FontSize.sm },

  // Screen 7: Verification Success
  successContainer: { flex: 1, backgroundColor: Colors.white, justifyContent: 'center' },
  successContent: { alignItems: 'center', padding: Spacing.xl },
  successIconOuter: { width: 96, height: 96, borderRadius: 48, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.xl, ...Shadow.lg },
  successTitle: { fontSize: FontSize['2xl'], fontWeight: FontWeight.extrabold, color: Colors.primaryDark, marginBottom: Spacing.sm },
  successSubtitle: { fontSize: FontSize.base, color: Colors.textMuted, textAlign: 'center', marginBottom: Spacing['3xl'], lineHeight: 22 },
  btnApproveComplete: { width: '100%', height: 54, backgroundColor: Colors.primary, borderRadius: Radius.md, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.md, ...Shadow.md },
  btnApproveCompleteText: { color: Colors.white, fontWeight: FontWeight.bold, fontSize: FontSize.base },
  btnNextCustomer: { width: '100%', height: 52, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  btnNextCustomerText: { color: Colors.primaryDark, fontWeight: FontWeight.bold, fontSize: FontSize.sm },
});
