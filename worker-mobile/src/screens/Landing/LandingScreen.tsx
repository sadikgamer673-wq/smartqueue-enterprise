import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView, Platform } from 'react-native';
import { Colors, FontSize, FontWeight, Spacing, Radius, Shadow } from '../../theme/tokens';

export default function LandingScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoSection}>
        <Text style={styles.logoText}>👷</Text>
        <Text style={styles.title}>SmartQueue Worker</Text>
        <Text style={styles.tagline}>Scan, Verify & Serve</Text>
      </View>

      <View style={styles.illustrationSection}>
        <View style={styles.hardHatContainer}>
          <Text style={styles.illustrationText}>🛡️</Text>
          <View style={styles.badgeRow}>
            <Text style={{ fontSize: 24 }}>✨</Text>
            <Text style={{ fontSize: 24 }}>✅</Text>
            <Text style={{ fontSize: 24 }}>⚙️</Text>
          </View>
        </View>
        <Text style={styles.infoTitle}>Fast Verification{"\n"}Safe Checkouts</Text>
        <Text style={styles.infoSubtitle}>Help shoppers exit securely with real-time tracking</Text>
      </View>

      <View style={styles.buttonSection}>
        <TouchableOpacity 
          style={styles.btnPrimary} 
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.btnPrimaryText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white, justifyContent: 'space-between', paddingVertical: Spacing['3xl'] },
  logoSection: { alignItems: 'center', marginTop: Spacing.xl },
  logoText: { fontSize: 48, marginBottom: Spacing.xs },
  title: { fontSize: FontSize.xl, fontWeight: FontWeight.extrabold, color: Colors.primary },
  tagline: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: Spacing.xs, fontWeight: FontWeight.semibold },
  
  illustrationSection: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  hardHatContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    position: 'relative',
    ...Shadow.sm,
  },
  illustrationText: { fontSize: 64 },
  badgeRow: {
    flexDirection: 'row',
    position: 'absolute',
    top: -10,
    gap: 4,
  },
  infoTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.extrabold, color: Colors.text, textAlign: 'center', lineHeight: 28 },
  infoSubtitle: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.sm, fontWeight: FontWeight.medium },

  buttonSection: { paddingHorizontal: Spacing.xl, marginBottom: Spacing.lg },
  btnPrimary: {
    height: 52,
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
  btnPrimaryText: { color: Colors.white, fontSize: FontSize.base, fontWeight: FontWeight.bold },
});
