import { useState } from 'react';
import { View, StyleSheet, FlatList, Image, TouchableOpacity, Text, SafeAreaView, TextInput, Platform } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { apiClient } from '../../api/client';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { addItem } from '../../redux/slices/cartSlice';
import { Colors, FontSize, FontWeight, Spacing, Radius, Shadow } from '../../theme/tokens';

interface Product {
  _id: string;
  name: string;
  price: number;
  mrp: number;
  images: string[];
  barcode: string;
}

export default function SearchScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const selectedStoreId = useAppSelector((s) => s.auth.selectedStoreId);
  const dispatch = useAppDispatch();

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setProducts([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await apiClient.get('/products', {
        params: { search: query, storeId: selectedStoreId },
      });
      setProducts(data.data.docs || data.data || []);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    dispatch(addItem({
      productId: product._id,
      name: product.name,
      image: product.images?.[0] || '',
      price: product.price,
      quantity: 1,
      barcode: product.barcode,
    }));
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <TouchableOpacity
        style={styles.cardLayout}
        onPress={() => navigation.navigate('ProductDetail', { productId: item._id })}
      >
        {item.images?.[0] ? (
          <Image source={{ uri: item.images[0] }} style={styles.productImage} />
        ) : (
          <View style={styles.productImagePlaceholder}>
            <Text style={styles.placeholderText}>{item.name[0]}</Text>
          </View>
        )}
        
        <View style={styles.infoCol}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>
              ₹{item.price}
            </Text>
            {item.mrp > item.price && (
              <Text style={styles.mrp}>₹{item.mrp}</Text>
            )}
          </View>
          
          <TouchableOpacity 
            style={styles.addBtn}
            onPress={() => handleAddToCart(item)}
          >
            <Text style={styles.addBtnText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Search bar block */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            placeholder="Search products..."
            placeholderTextColor={Colors.textLight}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={handleSearch}
            autoCorrect={false}
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator color={Colors.primary} size="large" />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          renderItem={renderProductItem}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            searchQuery.trim() ? (
              <Text style={styles.emptyText}>No products found matching "{searchQuery}"</Text>
            ) : (
              <View style={styles.emptySearch}>
                <Text style={{ fontSize: 50, marginBottom: Spacing.sm }}>🔍</Text>
                <Text style={styles.emptyText}>Type above to search for products</Text>
              </View>
            )
          }
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  searchContainer: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingTop: Platform.OS === 'ios' ? 44 : 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.base,
    height: 48,
  },
  searchIcon: { fontSize: 16, marginRight: Spacing.sm },
  searchInput: { flex: 1, fontSize: FontSize.sm, color: Colors.text, height: '100%' },

  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: Spacing.lg, paddingBottom: 40 },
  productCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  cardLayout: { flexDirection: 'row', padding: Spacing.base },
  productImage: { width: 90, height: 90, borderRadius: Radius.sm },
  productImagePlaceholder: {
    width: 90,
    height: 90,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.primaryDark },
  infoCol: { flex: 1, marginLeft: Spacing.base, justifyContent: 'space-between' },
  productName: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.text },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginVertical: Spacing.xs },
  price: { color: Colors.primaryDark, fontWeight: FontWeight.extrabold, fontSize: FontSize.base },
  mrp: { textDecorationLine: 'line-through', color: Colors.textLight, fontSize: FontSize.xs },
  addBtn: {
    height: 32,
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
  },
  addBtnText: { color: Colors.primaryDark, fontWeight: FontWeight.bold, fontSize: 12 },
  emptyText: { textAlign: 'center', color: Colors.textMuted, fontSize: FontSize.sm, marginTop: Spacing.md },
  emptySearch: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
});
