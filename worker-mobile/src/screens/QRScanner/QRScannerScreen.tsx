import { useState, useEffect, useRef } from 'react';
import {
  View, StyleSheet, Alert, Animated, TouchableOpacity,
  Text, Platform, StatusBar, SafeAreaView,
} from 'react-native';
import { Camera } from 'expo-camera';
import { ActivityIndicator } from 'react-native-paper';
import { apiClient } from '../../api/client';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../theme/tokens';

export default function QRScannerScreen({ navigation }: any) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [flash, setFlash] = useState<'off' | 'on'>('off');

  const laserAnim = useRef(new Animated.Value(0)).current;
  const FRAME = 240;

  useEffect(() => {
    Camera.requestCameraPermissionsAsync().then(({ status }) =>
      setHasPermission(status === 'granted')
    );
  }, []);

  useEffect(() => {
    if (hasPermission && !scanned) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(laserAnim, { toValue: FRAME, duration: 2000, useNativeDriver: true }),
          Animated.timing(laserAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [hasPermission, scanned]);

  useEffect(() => {
    const unsub = navigation.addListener('focus', () => setScanned(false));
    return unsub;
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
        Alert.alert('Invalid QR ❌', result.data.message || 'This QR pass is not valid.', [
          { text: 'Scan Again', onPress: () => setScanned(false) },
        ]);
      }
    } catch (err: any) {
      Alert.alert('Error ⚠️', err.response?.data?.message || 'Could not connect to server.', [
        { text: 'Try Again', onPress: () => setScanned(false) },
      ]);
    } finally {
      setLoading(false);
    }
  };

  /* ─── Permission Screens ─── */
  if (hasPermission === null) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.primary} size="large" />
        <Text style={styles.permText}>Requesting camera access…</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 48, marginBottom: 16 }}>📷</Text>
        <Text style={styles.permText}>Camera permission is required{'\n'}to scan customer QR passes.</Text>
        <TouchableOpacity style={styles.permBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.permBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <Camera
        style={StyleSheet.absoluteFillObject}
        onBarCodeScanned={scanned ? undefined : handleScan}
        flashMode={flash === 'on' ? 'torch' : 'off'}
        barCodeScannerSettings={{ barCodeTypes: ['qr'] }}
      />

      {/* Dark overlay top & bottom */}
      <View style={styles.overlayTop} />
      <View style={styles.overlayBottom} />
      <View style={styles.overlaySideLeft} />
      <View style={styles.overlaySideRight} />

      {/* Header */}
      <SafeAreaView style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.iconBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan QR Code</Text>
        <TouchableOpacity style={styles.iconBtn} onPress={() => setFlash(f => f === 'off' ? 'on' : 'off')}>
          <Text style={styles.iconBtnText}>{flash === 'on' ? '🔦' : '⚡'}</Text>
        </TouchableOpacity>
      </SafeAreaView>

      {/* Scan Frame */}
      <View style={styles.frameContainer}>
        <View style={styles.frame}>
          {/* Corner brackets */}
          <View style={[styles.bracket, styles.tl]} />
          <View style={[styles.bracket, styles.tr]} />
          <View style={[styles.bracket, styles.bl]} />
          <View style={[styles.bracket, styles.br]} />
          {/* Laser beam */}
          {!scanned && (
            <Animated.View
              style={[styles.laser, { transform: [{ translateY: laserAnim }] }]}
            />
          )}
        </View>
        <Text style={styles.hint}>Point camera at the customer exit QR ticket</Text>
      </View>

      {/* Bottom info card */}
      <View style={styles.bottomCard}>
        <View style={styles.bottomCardInner}>
          <Text style={styles.bottomCardIcon}>🔍</Text>
          <View>
            <Text style={styles.bottomCardTitle}>Auto-Scan Enabled</Text>
            <Text style={styles.bottomCardSub}>Position the QR code inside the frame</Text>
          </View>
        </View>
      </View>

      {/* Loading overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator color={Colors.primary} size="large" />
            <Text style={styles.loadingTitle}>Validating QR Pass…</Text>
            <Text style={styles.loadingSub}>Please wait</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const FRAME_SIZE = 250;
const OVERLAY_COLOR = 'rgba(0,0,0,0.72)';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: {
    flex: 1, backgroundColor: '#f8fafc',
    justifyContent: 'center', alignItems: 'center', padding: 32,
  },
  permText: {
    fontSize: FontSize.base, color: Colors.text, textAlign: 'center',
    marginBottom: 24, lineHeight: 24,
  },
  permBtn: {
    paddingHorizontal: 28, paddingVertical: 13,
    borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.primary,
  },
  permBtnText: { color: Colors.primary, fontWeight: FontWeight.bold, fontSize: FontSize.sm },

  /* Overlay quadrants */
  overlayTop: {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: '30%', backgroundColor: OVERLAY_COLOR,
  },
  overlayBottom: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: '28%', backgroundColor: OVERLAY_COLOR,
  },
  overlaySideLeft: {
    position: 'absolute', left: 0,
    top: '30%', bottom: '28%',
    width: '10%', backgroundColor: OVERLAY_COLOR,
  },
  overlaySideRight: {
    position: 'absolute', right: 0,
    top: '30%', bottom: '28%',
    width: '10%', backgroundColor: OVERLAY_COLOR,
  },

  /* Header */
  header: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 10 : 16, paddingBottom: 16,
    zIndex: 10,
  },
  iconBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center',
  },
  iconBtnText: { fontSize: 19, color: '#fff' },
  headerTitle: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: '#fff' },

  /* Scan frame */
  frameContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center', zIndex: 5,
  },
  frame: {
    width: FRAME_SIZE, height: FRAME_SIZE,
    position: 'relative', justifyContent: 'center', alignItems: 'center',
  },
  bracket: {
    position: 'absolute', width: 36, height: 36, borderColor: Colors.primary,
  },
  tl: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 12 },
  tr: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 12 },
  bl: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 12 },
  br: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 12 },
  laser: {
    position: 'absolute',
    top: 0, left: 4, right: 4, height: 2,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  hint: {
    marginTop: 24, color: '#fff', fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold, textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.8)', textShadowRadius: 6,
    textShadowOffset: { width: 0, height: 1 },
  },

  /* Bottom card */
  bottomCard: {
    position: 'absolute', bottom: 40, left: 24, right: 24, zIndex: 10,
  },
  bottomCardInner: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: Radius.lg, padding: 18,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  bottomCardIcon: { fontSize: 26 },
  bottomCardTitle: { color: '#fff', fontWeight: FontWeight.bold, fontSize: FontSize.sm },
  bottomCardSub: { color: 'rgba(255,255,255,0.65)', fontSize: FontSize.xs, marginTop: 2 },

  /* Loading overlay */
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', alignItems: 'center',
    zIndex: 20,
  },
  loadingCard: {
    backgroundColor: '#fff', borderRadius: Radius.xl,
    padding: 36, alignItems: 'center', width: 220,
  },
  loadingTitle: {
    fontSize: FontSize.base, fontWeight: FontWeight.bold,
    color: Colors.text, marginTop: 18,
  },
  loadingSub: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 4 },
});
