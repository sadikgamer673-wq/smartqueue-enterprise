import { View, StyleSheet, FlatList, Image, TouchableOpacity, Text, SafeAreaView, TextInput } from 'react-native';
import { ActivityIndicator, Divider } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { removeItem, updateQuantity } from '../../redux/slices/cartSlice';
import { Colors, FontSize, FontWeight, Spacing, Radius, Shadow } from '../../theme/tokens';
import { useState } from 'react';

export default function CartScreen({ navigation }: any) {
  const items = useAppSelector((s) => s.cart.items);
  const subtotal = useAppSelector((s) => s.cart.subtotal);
  const dispatch = useAppDispatch();
  
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  const handlingFee = items.length > 0 ? 10 : 0;
  const total = subtotal + handlingFee - discount;

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'WELCOME100') {
      setDiscount(Math.min(100, subtotal));
      setCouponApplied(true);
      setCouponCode('');
    } else {
      alert('Invalid coupon code! Try "WELCOME100"');
    }
  };

  const handleRemoveCoupon = () => {
    setDiscount(0);
    setCouponApplied(false);
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <View style={styles.emptyContent}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>Scan items as you shop to build your cart</Text>
          
          <TouchableOpacity 
            style={styles.startScanBtn} 
            onPress={() => navigation.navigate('Scanner')}
          >
            <Text style={styles.startScanBtnText}>Start Scanning</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Block */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Shopping Cart</Text>
        <View style={styles.itemCountBadge}>
          <Text style={styles.itemCountText}>{items.length} items</Text>
        </View>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.productId}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.cartItemRow}>
            {/* Product image */}
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.productImg} />
            ) : (
              <View style={styles.productImgPlaceholder}>
                <Text style={styles.placeholderText}>{item.name[0]}</Text>
              </View>
            )}

            {/* Info details */}
            <View style={styles.productDetails}>
              <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.productPrice}>₹{item.price} per unit</Text>
              
              {/* Quantity steppers */}
              <View style={styles.quantityContainer}>
                <TouchableOpacity 
                  style={styles.quantityBtn}
                  onPress={() => dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity - 1 }))}
                >
                  <Text style={styles.quantityBtnText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.quantityValue}>{item.quantity}</Text>
                <TouchableOpacity 
                  style={styles.quantityBtn}
                  onPress={() => dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity + 1 }))}
                >
                  <Text style={styles.quantityBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Price multiplier */}
            <View style={styles.priceContainer}>
              <TouchableOpacity 
                style={styles.deleteBtn}
                onPress={() => dispatch(removeItem(item.productId))}
              >
                <Text style={{ fontSize: 16, color: Colors.textMuted }}>🗑️</Text>
              </TouchableOpacity>
              <Text style={styles.itemTotal}>₹{(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <Divider style={styles.itemDivider} />}
      />

      {/* Footer / Summary block */}
      <View style={styles.footer}>
        
        {/* Coupon Card */}
        {!couponApplied ? (
          <View style={styles.couponContainer}>
            <TextInput
              style={styles.couponInput}
              placeholder="Enter Coupon (e.g. WELCOME100)"
              placeholderTextColor={Colors.textLight}
              value={couponCode}
              onChangeText={setCouponCode}
              autoCapitalize="characters"
            />
            <TouchableOpacity style={styles.couponBtn} onPress={handleApplyCoupon}>
              <Text style={styles.couponBtnText}>Apply</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.couponSuccessContainer}>
            <Text style={styles.couponSuccessText}>🎟️ WELCOME100 applied (-₹{discount})</Text>
            <TouchableOpacity onPress={handleRemoveCoupon}>
              <Text style={styles.couponRemoveText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Detailed Price Summary */}
        <View style={styles.priceSummaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>₹{subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Exit / Handling Fee</Text>
            <Text style={styles.summaryValue}>₹{handlingFee.toFixed(2)}</Text>
          </View>
          {discount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: Colors.primaryDark }]}>Coupon Discount</Text>
              <Text style={[styles.summaryValue, { color: Colors.primaryDark }]}>-₹{discount.toFixed(2)}</Text>
            </View>
          )}
          <Divider style={{ marginVertical: Spacing.sm }} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Grand Total</Text>
            <Text style={styles.totalValue}>₹{total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity 
          style={styles.payBtn}
          onPress={() => navigation.navigate('Checkout')}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.payBtnText}>Proceed to Checkout</Text>
            <Text style={styles.payBtnSubText}>Secure checkout with auto-verification</Text>
          </View>
          <Text style={styles.payBtnPrice}>₹{total.toFixed(2)}  →</Text>
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
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text },
  itemCountBadge: { backgroundColor: Colors.primaryLight, paddingHorizontal: Spacing.md, paddingVertical: 4, borderRadius: Radius.full },
  itemCountText: { fontSize: 11, color: Colors.primaryDark, fontWeight: FontWeight.extrabold },

  listContent: { padding: Spacing.lg, paddingBottom: 40 },
  cartItemRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, padding: Spacing.base, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, ...Shadow.sm },
  productImg: { width: 80, height: 80, borderRadius: Radius.md },
  productImgPlaceholder: { width: 80, height: 80, borderRadius: Radius.md, backgroundColor: Colors.primaryLight, justifyContent: 'center', alignItems: 'center' },
  placeholderText: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.primaryDark },
  productDetails: { flex: 1, paddingLeft: Spacing.base, justifyContent: 'space-between' },
  productName: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.text },
  productPrice: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2, marginBottom: Spacing.sm },
  
  quantityContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.sm, width: 90, height: 32, backgroundColor: Colors.surfaceAlt },
  quantityBtn: { flex: 1, justifyContent: 'center', alignItems: 'center', height: '100%' },
  quantityBtnText: { fontSize: 16, fontWeight: FontWeight.bold, color: Colors.text },
  quantityValue: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.text, width: 30, textAlign: 'center' },

  priceContainer: { alignItems: 'flex-end', justifyContent: 'space-between', height: 80 },
  deleteBtn: { padding: 4 },
  itemTotal: { fontSize: FontSize.base, fontWeight: FontWeight.extrabold, color: Colors.text },
  itemDivider: { backgroundColor: 'transparent', height: Spacing.md },

  footer: { padding: Spacing.xl, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.border, ...Shadow.md },
  
  couponContainer: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.base },
  couponInput: { flex: 1, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, paddingHorizontal: Spacing.base, height: 48, fontSize: FontSize.sm, color: Colors.text, backgroundColor: Colors.surfaceAlt },
  couponBtn: { width: 90, height: 48, backgroundColor: Colors.primary, borderRadius: Radius.md, justifyContent: 'center', alignItems: 'center' },
  couponBtnText: { color: Colors.white, fontWeight: FontWeight.bold, fontSize: FontSize.sm },
  
  couponSuccessContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.primaryLight, padding: Spacing.base, borderRadius: Radius.md, borderStyle: 'dashed', borderWidth: 1.5, borderColor: Colors.primary, marginBottom: Spacing.base },
  couponSuccessText: { color: Colors.primaryDark, fontWeight: FontWeight.bold, fontSize: FontSize.sm },
  couponRemoveText: { color: Colors.danger, fontWeight: FontWeight.semibold, fontSize: FontSize.sm },

  priceSummaryCard: { backgroundColor: Colors.surfaceAlt, borderRadius: Radius.md, padding: Spacing.base, marginBottom: Spacing.lg },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm },
  summaryLabel: { fontSize: FontSize.sm, color: Colors.textMuted },
  summaryValue: { fontSize: FontSize.sm, color: Colors.text, fontWeight: FontWeight.semibold },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.text },
  totalValue: { fontSize: FontSize.xl, fontWeight: FontWeight.extrabold, color: Colors.primaryDark },

  payBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    padding: Spacing.base,
    borderRadius: Radius.lg,
    height: 64,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  payBtnText: { color: Colors.white, fontSize: FontSize.base, fontWeight: FontWeight.bold },
  payBtnSubText: { color: '#DCFCE7', fontSize: 10, marginTop: 1 },
  payBtnPrice: { color: Colors.white, fontSize: FontSize.lg, fontWeight: FontWeight.extrabold },

  emptyContainer: { flex: 1, backgroundColor: Colors.background },
  emptyContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  emptyIcon: { fontSize: 80, marginBottom: Spacing.lg },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.text },
  emptySubtitle: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: Spacing.xs, marginBottom: Spacing['2xl'], textAlign: 'center' },
  startScanBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl * 1.5,
    height: 54,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  startScanBtnText: { color: Colors.white, fontSize: FontSize.base, fontWeight: FontWeight.bold },
});
