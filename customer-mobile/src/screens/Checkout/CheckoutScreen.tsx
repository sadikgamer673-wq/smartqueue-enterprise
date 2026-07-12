import { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, Divider, Card } from 'react-native-paper';
import { useAppSelector } from '../../redux/store';
import { apiClient } from '../../api/client';

export default function CheckoutScreen({ navigation }: any) {
  const items = useAppSelector((s) => s.cart.items);
  const subtotal = useAppSelector((s) => s.cart.subtotal);
  const storeId = useAppSelector((s) => s.auth.selectedStoreId);
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);

  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const handleCreateOrder = async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.post('/orders', {
        storeId,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      });
      navigation.navigate('Payment', { orderId: data.data._id, total: data.data.total });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={{ marginBottom: 12 }}>Order Summary</Text>
          {items.map((item) => (
            <View key={item.productId} style={styles.row}>
              <Text style={{ flex: 1 }}>{item.name} × {item.quantity}</Text>
              <Text>₹{(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
          <Divider style={{ marginVertical: 12 }} />
          <View style={styles.row}><Text>Subtotal</Text><Text>₹{subtotal.toFixed(2)}</Text></View>
          <View style={styles.row}><Text>Tax (18%)</Text><Text>₹{tax.toFixed(2)}</Text></View>
          <Divider style={{ marginVertical: 12 }} />
          <View style={styles.row}>
            <Text variant="titleMedium">Total</Text>
            <Text variant="titleMedium">₹{total.toFixed(2)}</Text>
          </View>
        </Card.Content>
      </Card>

      <TextInput
        label="Coupon code (optional)"
        value={couponCode}
        onChangeText={setCouponCode}
        mode="outlined"
        style={{ margin: 16 }}
      />

      <Button mode="contained" style={styles.payBtn} onPress={handleCreateOrder} loading={loading}>
        Continue to Payment
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  card: { margin: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  payBtn: { marginHorizontal: 16, marginBottom: 24, paddingVertical: 4 },
});
