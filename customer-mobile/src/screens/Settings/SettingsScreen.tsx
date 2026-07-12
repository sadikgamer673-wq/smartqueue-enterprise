import { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, List, Switch, Divider, Card } from 'react-native-paper';

export default function SettingsScreen() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineSmall" style={styles.headerTitle}>
        Settings
      </Text>

      <Card style={styles.card}>
        <Card.Content style={{ padding: 0 }}>
          <List.Item
            title="Push Notifications"
            description="Receive real-time notifications for QR verification"
            right={() => (
              <Switch value={pushEnabled} onValueChange={setPushEnabled} color="#4F46E5" />
            )}
          />
          <Divider />
          <List.Item
            title="Email Updates"
            description="Receive invoices & order confirmations by email"
            right={() => (
              <Switch value={emailEnabled} onValueChange={setEmailEnabled} color="#4F46E5" />
            )}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content style={{ padding: 0 }}>
          <List.Item
            title="Biometric Login"
            description="Use FaceID / TouchID to unlock"
            right={() => (
              <Switch value={biometricsEnabled} onValueChange={setBiometricsEnabled} color="#4F46E5" />
            )}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content style={{ padding: 0 }}>
          <List.Item
            title="Terms of Service"
            onPress={() => {}}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
          <Divider />
          <List.Item
            title="Privacy Policy"
            onPress={() => {}}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
          <Divider />
          <List.Item
            title="App Version"
            description="v1.0.0"
          />
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', paddingHorizontal: 16, paddingTop: 40 },
  headerTitle: { fontWeight: '700', marginBottom: 16 },
  card: { marginBottom: 16, borderRadius: 12, backgroundColor: 'white', elevation: 1 },
});
