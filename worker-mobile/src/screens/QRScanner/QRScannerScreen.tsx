import { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Alert, Animated, TouchableOpacity, Text, Dimensions, Platform } from 'react-native';
import { Camera } from 'expo-camera';
import { ActivityIndicator } from 'react-native-paper';
import { apiClient } from '../../api/client';
import { Colors, FontSize, FontWeight, Spacing, Radius, Shadow } from '../../theme/tokens';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function QRScannerScreen({ navigation }: any) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [flash, setFlash] = useState<'off' | 'on'>('off');

  const laserPosition = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Scan loop animation
  useEffect(() => {
    if (hasPermission && !scanned) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(laserPosition, { toValue: 240, duration: 2000, useNativeDriver: true }),
          Animated.timing(laserPosition, { toValue: 0, duration: 2000, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [hasPermission, scanned]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setScanned(false);
    });
    return unsubscribe;
  }, [navigation]);

  const handleScan = async ({ data }: { data: string }) => {
    if (scanned || loading) return;
    setScanned(true);
    setLoading(true);
    try {
      const { data: result } = await apiClient.post('/qr/validate', { encryptedData: data });
      if (result.data.valid) {
        navigation.navigate('Verification', { order: result.data.order, token: data });
      } else {
        Alert.alert('Invalid Pass ❌', result.data.message || 'Verification failed.', [
          { text: 'Try again', onPress: () => setScanned(false) },
        ]);
      }
    } catch (err: any) {
      Alert.alert(
        'Scan Error ⚠️', 
        err.response?.data?.message || 'Failed to communicate with exit server.', 
        [{ text: 'Try again', onPress: () => setScanned(false) }]
      );
    } finally {
      setLoading(false);
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
        <Text style={styles.permissionText}>Camera permission is required to scan passes.</Text>
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
        onBarCodeScanned={scanned ? undefined : handleScan}
        flashMode={flash === 'on' ? 'torch' : 'off'}
        barCodeScannerSettings={{
          barCodeTypes: ['qr'],
        }}
      />

      {/* Screen Overlay */}
      <View style={styles.overlay}>
        {/* Top Header Block */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.headerIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scan Customer QR Pass</Text>
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
          <Text style={styles.hintText}>Point camera at the customer exit QR ticket</Text>
        </View>
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator color={Colors.white} size="large" />
          <Text style={styles.loadingText}>Validating Exit Ticket...</Text>
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
  
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'space-between', paddingBottom: 100 },
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

  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: Colors.white, marginTop: Spacing.md, fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
});
