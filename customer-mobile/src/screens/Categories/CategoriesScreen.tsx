import { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, ActivityIndicator, List, Divider } from 'react-native-paper';
import { apiClient } from '../../api/client';

interface Category {
  _id: string;
  name: string;
  slug: string;
  parentId?: string;
}

export default function CategoriesScreen({ navigation }: any) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await apiClient.get('/categories');
        setCategories(data.data || []);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  // Filter root categories (no parentId or parentId is null/undefined)
  const rootCategories = categories.filter((c) => !c.parentId);

  const getSubcategories = (parentId: string) => {
    return categories.filter((c) => c.parentId === parentId);
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.headerTitle}>
        Categories
      </Text>
      <FlatList
        data={rootCategories}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          const subs = getSubcategories(item._id);
          if (subs.length === 0) {
            return (
              <List.Item
                title={item.name}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => navigation.navigate('Search', { categoryId: item._id })}
              />
            );
          }
          return (
            <List.Accordion
              title={item.name}
              left={(props) => <List.Icon {...props} icon="folder" color="#4F46E5" />}
            >
              {subs.map((sub) => (
                <List.Item
                  key={sub._id}
                  title={sub.name}
                  style={{ paddingLeft: 32 }}
                  onPress={() => navigation.navigate('Search', { categoryId: sub._id })}
                />
              ))}
            </List.Accordion>
          );
        }}
        ItemSeparatorComponent={() => <Divider />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', paddingHorizontal: 16, paddingTop: 40 },
  headerTitle: { fontWeight: '700', marginBottom: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
