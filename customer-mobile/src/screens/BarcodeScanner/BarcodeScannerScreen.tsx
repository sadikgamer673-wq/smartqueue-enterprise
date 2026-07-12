import { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Alert, Animated, Image, TouchableOpacity, Text, Dimensions, Platform } from 'react-native';
import { Camera } from 'expo-camera';
import { ActivityIndicator } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { addItem, updateQuantity } from '../../redux/slices/cartSlice';
import { apiClient } from '../../api/client';
import { Colors, FontSize, FontWeight, Spacing, Radius, Shadow } from '../../theme/tokens';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function BarcodeScannerScreen({ navigation }: any) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [scannedProduct, setScannedProduct] = useState<any>(null);
  const [qty, setQty] = useState(1);
  
  const selectedStoreId = useAppSelector((s) => s.auth.selectedStoreId);
  const cartItems = useAppSelector((s) => s.cart.items);
  const dispatch = useAppDispatch();

  // Animation values
  const laserPosition = useRef(new Animated.Value(0)).current;
  const bottomSheetPosition = useRef(new Animated.Value(350)).current; // starts hidden below screen

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Loop scan laser animation
  useEffect(() => {
    if (hasPermission && !scanned) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(laserPosition, {
            toValue: 240,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(laserPosition, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [hasPermission, scanned]);

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    if (scanned || loading) return;
    setScanned(true);
    setLoading(true);

    try {
      const { data: product } = await apiClient.get(`/products/barcode/${data}`, {
        params: { storeId: selectedStoreId },
      });
      
      const itemData = {
        productId: product.data._id,
        name: product.data.name,
        image: product.data.images?.[0] || '',
        price: product.data.price,
        quantity: 1,
        barcode: data,
      };

      dispatch(addItem(itemData));
      setScannedProduct(itemData);
      setQty(1); // Reset local qty to 1
      showBottomSheet();
    } catch (err: any) {
      Alert.alert(
        'Product not found', 
        err.response?.data?.message || `No product found for barcode ${data}`, 
        [{ text: 'Try again', onPress: () => setScanned(false) }]
      );
    } finally {
      setLoading(false);
    }
  };

  const showBottomSheet = () => {
    Animated.spring(bottomSheetPosition, {
      toValue: 0,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
  };

  const hideBottomSheet = () => {
    Animated.timing(bottomSheetPosition, {
      toValue: 350,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setScannedProduct(null);
      setScanned(false);
    });
  };

  const adjustQty = (newQty: number) => {
    if (newQty < 1) return;
    setQty(newQty);
    if (scannedProduct) {
      dispatch(updateQuantity({ productId: scannedProduct.productId, quantity: newQty }));
    }
  };

  const toggleFlash = () => {
    setFlash((prev) => (prev === 'off' ? 'on' : 'off'));
  };

  if (hasPermission === null) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.center}>
        <Text style={styles.permissionText}>Camera permission is required to scan barcodes.</Text>
        <TouchableOpacity style={styles.btnOutline} onPress={() => navigation.goBack()}>
          <Text style={styles.btnOutlineText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFillObject}
        onBarCodeScanned={scanned ? undefined : handleBarcodeScanned}
        flashMode={flash === 'on' ? 'torch' : 'off'}
        barCodeScannerSettings={{
          barCodeTypes: ['ean13', 'ean8', 'upca', 'upce', 'code128'],
        }}
      />

      {/* Screen Overlay (scanner cutout window) */}
      <View style={styles.overlay}>
        {/* Top Header Block */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.headerIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scan Product</Text>
          <TouchableOpacity style={styles.iconBtn} onPress={toggleFlash}>
            <Text style={styles.headerIcon}>{flash === 'on' ? '🔦' : '⚡'}</Text>
          </TouchableOpacity>
        </View>

        {/* Scan Frame */}
        <View style={styles.scanFrameContainer}>
          <View style={styles.scanBox}>
            {/* Brackets */}
            <View style={[styles.bracket, styles.topLeft]} />
            <View style={[styles.bracket, styles.topRight]} />
            <View style={[styles.bracket, styles.bottomLeft]} />
            <View style={[styles.bracket, styles.bottomRight]} />

            {/* Laser Line */}
            {!scanned && (
              <Animated.View
                style={[
                  styles.laser,
                  {
                    transform: [{ translateY: laserPosition }],
                  },
                ]}
              />
            )}
          </View>
          <Text style={styles.hintText}>Align barcode within the frame</Text>
        </View>

        {/* Bottom controls */}
        <View style={styles.bottomControls}>
          <TouchableOpacity style={styles.controlBtn} onPress={toggleFlash}>
            <Text style={styles.controlIcon}>{flash === 'on' ? '🔦' : '⚡'}</Text>
            <Text style={styles.controlText}>Flash</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlBtn} onPress={() => Alert.alert('Enter Code', 'Manual entry not implemented yet.')}>
            <Text style={styles.controlIcon}>⌨️</Text>
            <Text style={styles.controlText}>Enter Code</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Success Bottom Sheet — Storyboard Screen 6 "Item Added (Quick)" */}
      {scannedProduct && (
        <Animated.View
          style={[
            styles.bottomSheet,
            {
              transform: [{ translateY: bottomSheetPosition }],
            },
          ]}
        >
          {/* Green Check Circle */}
          <View style={styles.successIconContainer}>
            <View style={styles.checkCircle}>
              <Text style={styles.checkTick}>✓</Text>
            </View>
            <Text style={styles.successTitleText}>Item Added</Text>
          </View>

          {/* Product row details with quantity adjuster */}
          <View style={styles.productRow}>
            {scannedProduct.image ? (
              <Image source={{ uri: scannedProduct.image }} style={styles.productImg} />
            ) : (
              <View style={styles.productImgPlaceholder}>
                <Text style={styles.productPlaceholderText}>{scannedProduct.name[0]}</Text>
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.productName} numberOfLines={1}>{scannedProduct.name}</Text>
              <Text style={styles.productPrice}>₹{scannedProduct.price}</Text>
            </View>

            {/* Stepper counter directly in sheet */}
            <View style={styles.stepperContainer}>
              <TouchableOpacity style={styles.stepperBtn} onPress={() => adjustQty(qty - 1)}>
                <Text style={styles.stepperBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.stepperVal}>{qty}</Text>
              <TouchableOpacity style={styles.stepperBtn} onPress={() => adjustQty(qty + 1)}>
                <Text style={styles.stepperBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.sheetActions}>
            <TouchableOpacity style={styles.btnContinueScanning} onPress={hideBottomSheet}>
              <Text style={styles.btnContinueScanningText}>Continue Scanning</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.btnViewCartLink} 
              onPress={() => {
                hideBottomSheet();
                navigation.navigate('Cart');
              }}
            >
              <Text style={styles.btnViewCartLinkText}>View Cart ({cartItems.length})</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator color={Colors.white} size="large" />
          <Text style={styles.loadingText}>Adding to cart...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background, padding: Spacing.xl },
  permissionText: { fontSize: FontSize.base, color: Colors.text, textAlign: 'center', marginBottom: Spacing.lg },
  btnOutline: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  btnOutlineText: { color: Colors.primary, fontWeight: FontWeight.bold, fontSize: FontSize.sm },
  
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'space-between', paddingBottom: 30 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingHorizontal: Spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  iconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },
  headerIcon: { fontSize: 20, color: Colors.white },
  headerTitle: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.white },

  scanFrameContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scanBox: {
    width: 250,
    height: 250,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bracket: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderColor: Colors.primary,
  },
  topLeft: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 16 },
  topRight: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 16 },
  bottomLeft: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 16 },
  bottomRight: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 16 },
  
  laser: {
    width: '90%',
    height: 3,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 3,
    position: 'absolute',
    top: 5,
  },
  hintText: { color: Colors.white, fontSize: FontSize.sm, fontWeight: FontWeight.semibold, marginTop: Spacing.xl, textShadowColor: 'black', textShadowRadius: 4, textShadowOffset: { width: 1, height: 1 } },

  bottomControls: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: Spacing.md, backgroundColor: 'rgba(0,0,0,0.5)' },
  controlBtn: { alignItems: 'center' },
  controlIcon: { fontSize: 24, color: Colors.white },
  controlText: { fontSize: 11, color: Colors.white, marginTop: 4, fontWeight: FontWeight.semibold },

  // Storyboard Screen 6 layout
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 310,
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.xl,
    ...Shadow.lg,
  },
  successIconContainer: { alignItems: 'center', marginBottom: Spacing.md },
  checkCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  checkTick: { color: Colors.white, fontSize: FontSize.xl, fontWeight: 'bold' },
  successTitleText: { fontSize: FontSize.base, fontWeight: FontWeight.extrabold, color: Colors.primaryDark },

  productRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.base, marginBottom: Spacing.xl, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, padding: Spacing.sm },
  productImg: { width: 50, height: 50, borderRadius: Radius.sm },
  productImgPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productPlaceholderText: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.primaryDark },
  productName: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.text },
  productPrice: { fontSize: FontSize.sm, fontWeight: FontWeight.extrabold, color: Colors.primaryDark, marginTop: 2 },
  
  stepperContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.sm, height: 32, width: 80, backgroundColor: Colors.surfaceAlt },
  stepperBtn: { flex: 1, justifyContent: 'center', alignItems: 'center', height: '100%' },
  stepperBtnText: { fontSize: 16, fontWeight: FontWeight.bold, color: Colors.text },
  stepperVal: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.text, width: 24, textAlign: 'center' },

  sheetActions: { alignItems: 'center' },
  btnContinueScanning: {
    width: '100%',
    height: 48,
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
  btnContinueScanningText: { color: Colors.white, fontSize: FontSize.sm, fontWeight: FontWeight.bold },
  btnViewCartLink: { marginTop: Spacing.md },
  btnViewCartLinkText: { color: Colors.primaryDark, fontWeight: FontWeight.bold, fontSize: FontSize.sm },

  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: Colors.white, marginTop: Spacing.md, fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
});
