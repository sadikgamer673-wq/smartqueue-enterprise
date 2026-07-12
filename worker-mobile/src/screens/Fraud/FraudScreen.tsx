import { View, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';

export default function FraudScreen() {
  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.headerTitle}>
        Security Alerts
      </Text>
      <View style={styles.empty}>
        <Text variant="titleMedium" style={{ color: '#6B7280' }}>
          No security issues flagged
        </Text>
        <Text style={{ color: '#9CA3AF', marginTop: 4, textAlign: 'center' }}>
          All exit scans are normal. Discrepancies and double scans will appear here.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', paddingHorizontal: 16, paddingTop: 40 },
  headerTitle: { fontWeight: '700', marginBottom: 16 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
});
