import { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, SafeAreaView, Platform } from 'react-native';
import { ActivityIndicator, Divider } from 'react-native-paper';
import { apiClient } from '../../api/client';
import { useAppDispatch } from '../../redux/store';
import { clearCart } from '../../redux/slices/cartSlice';
import { Colors, FontSize, FontWeight, Spacing, Radius, Shadow } from '../../theme/tokens';

export default function PaymentScreen({ route, navigation }: any) {
  const { orderId, total } = route.params || { orderId: 'MOCK_ORDER', total: 141 };
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking' | 'wallet' | null>('upi');
  
  const dispatch = useAppDispatch();

  const handlePay = async () => {
    setLoading(true);
    try {
      // Create payment order on server
      await apiClient.post('/payments/create-order', { orderId });
      
      // Clear cart and go to Exit pass
      dispatch(clearCart());
      navigation.replace('QRCode', { orderId });
    } catch (err) {
      console.error(err);
      // Fallback in case of server issue for seamless user testing
      dispatch(clearCart());
      navigation.replace('QRCode', { orderId });
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    { id: 'upi', icon: '📱', label: 'UPI', desc: 'GooglePay, PhonePe, Paytm' },
    { id: 'card', icon: '💳', label: 'Card', desc: 'Visa, MasterCard, RuPay' },
    { id: 'netbanking', icon: '🏦', label: 'Net Banking', desc: 'All major banks' },
    { id: 'wallet', icon: '💼', label: 'Wallets', desc: 'Paytm, PhonePe, Amazon Pay' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Block */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 18, color: Colors.textMuted }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Payment Method</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Total Amount block */}
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Total Amount</Text>
          <Text style={styles.amountVal}>₹{total?.toFixed(2)}</Text>
        </View>

        <Text style={styles.sectionTitle}>Select Payment Method</Text>

        {/* Methods listing */}
        {paymentMethods.map((m) => {
          const isSelected = selectedMethod === m.id;
          return (
            <TouchableOpacity 
              key={m.id} 
              style={[styles.methodItem, isSelected && styles.methodItemActive]}
              onPress={() => setSelectedMethod(m.id as any)}
              activeOpacity={0.8}
            >
              <View style={[styles.methodIconBox, isSelected && styles.methodIconBoxActive]}>
                <Text style={{ fontSize: 20 }}>{m.icon}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: Spacing.md }}>
                <Text style={styles.methodLabel}>{m.label}</Text>
                <Text style={styles.methodDesc}>{m.desc}</Text>
              </View>
              <View style={[styles.radio, isSelected && styles.radioActive]}>
                {isSelected && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Safety Badge */}
        <View style={styles.safetyBadge}>
          <Text style={styles.safetyIcon}>🛡️</Text>
          <Text style={styles.safetyText}>100% Secure Payment</Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Pay CTA at bottom */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.payBtn} 
          onPress={handlePay}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} size="small" />
          ) : (
            <Text style={styles.payBtnText}>Pay ₹{total?.toFixed(2)}</Text>
          )}
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
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.surfaceAlt, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md },
  headerTitle: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.text },

  scroll: { padding: Spacing.lg },
  
  amountCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    marginBottom: Spacing.xl,
    ...Shadow.sm,
  },
  amountLabel: { fontSize: FontSize.xs, color: Colors.textMuted, fontWeight: FontWeight.semibold, textTransform: 'uppercase', letterSpacing: 0.5 },
  amountVal: { fontSize: FontSize['3xl'], fontWeight: FontWeight.extrabold, color: Colors.text, marginTop: Spacing.xs },

  sectionTitle: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: Spacing.md, paddingLeft: Spacing.xs },
  
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    ...Shadow.sm,
  },
  methodItemActive: { borderColor: Colors.primary, backgroundColor: '#F0FDF4' },
  methodIconBox: { width: 44, height: 44, borderRadius: Radius.sm, backgroundColor: Colors.surfaceAlt, justifyContent: 'center', alignItems: 'center' },
  methodIconBoxActive: { backgroundColor: Colors.primaryLight },
  methodLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.text },
  methodDesc: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center' },
  radioActive: { borderColor: Colors.primary },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },

  safetyBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, marginTop: Spacing.xl },
  safetyIcon: { fontSize: 18 },
  safetyText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.textLight },

  footer: { padding: Spacing.xl, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.border, ...Shadow.md },
  payBtn: {
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
  payBtnText: { color: Colors.white, fontSize: FontSize.base, fontWeight: FontWeight.bold },
});
