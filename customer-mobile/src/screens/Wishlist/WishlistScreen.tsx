import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';

export default function WishlistScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.headerTitle}>
        My Wishlist
      </Text>
      <View style={styles.emptyContainer}>
        <Text variant="titleMedium" style={{ color: '#6B7280' }}>
          Your wishlist is empty
        </Text>
        <Text style={{ color: '#9CA3AF', marginTop: 4, textAlign: 'center' }}>
          Save products you want to buy later here.
        </Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Home')}
          style={{ marginTop: 20 }}
        >
          Browse Products
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', paddingHorizontal: 16, paddingTop: 40 },
  headerTitle: { fontWeight: '700', marginBottom: 16 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
});
