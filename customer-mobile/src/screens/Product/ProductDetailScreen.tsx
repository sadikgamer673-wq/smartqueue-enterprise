import { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Button, Divider, ActivityIndicator, IconButton } from 'react-native-paper';
import { apiClient } from '../../api/client';
import { useAppDispatch } from '../../redux/store';
import { addItem } from '../../redux/slices/cartSlice';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  mrp: number;
  brand: string;
  unit: string;
  barcode: string;
  images: string[];
}

export default function ProductDetailScreen({ route, navigation }: any) {
  const { productId } = route.params;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await apiClient.get(`/products/${productId}`);
        setProduct(data.data);
      } catch (err) {
        console.error('Failed to fetch product details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(addItem({
      productId: product._id,
      name: product.name,
      image: product.images?.[0] || '',
      price: product.price,
      quantity,
      barcode: product.barcode,
    }));
    navigation.goBack();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centered}>
        <Text>Product not found</Text>
        <Button mode="contained" onPress={() => navigation.goBack()} style={{ marginTop: 12 }}>
          Go Back
        </Button>
      </View>
    );
  }

  const discount = product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Image
          source={product.images?.[0] ? { uri: product.images[0] } : require('../../assets/adaptive-icon.png')}
          style={styles.image}
          resizeMode="contain"
        />

        <View style={styles.content}>
          <Text style={styles.brand}>{product.brand.toUpperCase()}</Text>
          <Text variant="headlineSmall" style={styles.name}>
            {product.name}
          </Text>
          <Text style={styles.unit}>Unit: {product.unit}</Text>

          <View style={styles.priceRow}>
            <Text variant="headlineMedium" style={styles.price}>
              ₹{product.price}
            </Text>
            {product.mrp > product.price && (
              <>
                <Text style={styles.mrp}>₹{product.mrp}</Text>
                <Text style={styles.discount}>{discount}% OFF</Text>
              </>
            )}
          </View>

          <Divider style={styles.divider} />

          <Text variant="titleMedium" style={styles.descTitle}>
            Description
          </Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.quantityContainer}>
          <IconButton
            icon="minus"
            size={20}
            onPress={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
          />
          <Text variant="titleMedium" style={styles.quantityText}>
            {quantity}
          </Text>
          <IconButton
            icon="plus"
            size={20}
            onPress={() => setQuantity((q) => q + 1)}
          />
        </View>
        <Button mode="contained" style={styles.addBtn} onPress={handleAddToCart}>
          Add to Cart
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { paddingBottom: 80 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: 300, backgroundColor: '#F9FAFB' },
  content: { padding: 20 },
  brand: { color: '#4F46E5', fontWeight: '700', fontSize: 12, letterSpacing: 1 },
  name: { fontWeight: '700', color: '#111827', marginTop: 4 },
  unit: { color: '#6B7280', fontSize: 13, marginTop: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 10 },
  price: { fontWeight: '700', color: '#4F46E5' },
  mrp: { textDecorationLine: 'line-through', color: '#9CA3AF', fontSize: 16 },
  discount: { color: '#10B981', fontWeight: '700', fontSize: 14 },
  divider: { marginVertical: 16 },
  descTitle: { fontWeight: '600', color: '#111827', marginBottom: 8 },
  description: { color: '#4B5563', lineHeight: 20 },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', padding: 16, backgroundColor: 'white',
    borderTopWidth: 1, borderTopColor: '#E5E7EB', alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1,
    borderColor: '#E5E7EB', borderRadius: 8, marginRight: 16,
  },
  quantityText: { minWidth: 24, textAlign: 'center' },
  addBtn: { flex: 1, paddingVertical: 6, borderRadius: 8 },
});
