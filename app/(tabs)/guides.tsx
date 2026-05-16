import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { getGuides } from '../../services/guideService';

type Guide = {
  id: string;
  title: string;
  category: string;
  content: string;
  isPublic?: boolean;
  isArchived?: boolean;
  userId?: string | null;
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Earthquake':
      return 'earth-outline';
    case 'Fire':
      return 'flame-outline';
    case 'Flood':
      return 'water-outline';
    case 'Typhoon':
      return 'thunderstorm-outline';
    case 'Landslide':
      return 'trail-sign-outline';
    case 'First Aid':
      return 'medkit-outline';
    case 'Emergency Contacts':
      return 'call-outline';
    case 'Preparedness':
      return 'shield-checkmark-outline';
    default:
      return 'book-outline';
  }
};

export default function GuidesScreen() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');

  const loadGuides = async () => {
    try {
      const data = await getGuides();
      setGuides(data as Guide[]);
      console.log('Loaded guides:', data);
    } catch (error) {
      console.log('Error loading guides:', error);
      setGuides([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadGuides();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadGuides();
  };

  const filteredGuides = useMemo(() => {
    const keyword = searchText.toLowerCase();

    return guides.filter((guide) => {
      return (
        guide.title.toLowerCase().includes(keyword) ||
        guide.category.toLowerCase().includes(keyword) ||
        guide.content.toLowerCase().includes(keyword)
      );
    });
  }, [guides, searchText]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#dc2626" />
        <Text style={styles.loadingText}>Loading guides...</Text>
      </View>
    );
  }

  if (guides.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.emptyIconBox}>
          <Ionicons name="book-outline" size={30} color="#dc2626" />
        </View>

        <Text style={styles.emptyTitle}>No Guides Available Yet</Text>

        <Text style={styles.emptyText}>
          Start building your emergency guide collection by adding your first guide.
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('/create-guide')}
        >
          <Text style={styles.primaryButtonText}>Create Guide</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={filteredGuides}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <View style={styles.heroCard}>
              <Text style={styles.badge}>Emergency Guides</Text>
              <Text style={styles.heroTitle}>
                Emergency response information in one place.
              </Text>
              <Text style={styles.heroSubtitle}>
                Search emergency guides and quickly find the information you need.
              </Text>
            </View>

            <View style={styles.searchWrapper}>
              <Ionicons name="search-outline" size={20} color="#6b7280" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search guides"
                placeholderTextColor="#9ca3af"
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push('/create-guide')}
            >
              <Ionicons name="add-outline" size={18} color="#fff" />
              <Text style={styles.primaryButtonText}>Create Guide</Text>
            </TouchableOpacity>

            <Text style={styles.resultText}>
              {filteredGuides.length} guide{filteredGuides.length !== 1 ? 's' : ''} found
            </Text>

            <Text style={styles.sectionTitle}>Available Guides</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptySearchState}>
            <View style={styles.emptyIconBox}>
              <Ionicons name="search-outline" size={30} color="#dc2626" />
            </View>
            <Text style={styles.emptyTitle}>No Matching Guides</Text>
            <Text style={styles.emptyText}>
              Try another keyword to find the guide you are looking for.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: '/guide-details',
                params: { id: item.id },
              })
            }
          >
            <View style={styles.cardTop}>
              <View style={styles.iconBox}>
                <Ionicons
                  name={getCategoryIcon(item.category) as any}
                  size={22}
                  color="#dc2626"
                />
              </View>

              <View style={styles.cardTextWrapper}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardCategory}>{item.category}</Text>
              </View>

              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </View>

            <Text style={styles.cardText} numberOfLines={3}>
              {item.content}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  listContent: {
    padding: 20,
    paddingBottom: 30,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#6b7280',
  },
  emptyIconBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
    maxWidth: 300,
  },
  heroCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  badge: {
    fontSize: 13,
    fontWeight: '700',
    color: '#dc2626',
    textTransform: 'uppercase',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 15,
    lineHeight: 23,
    color: '#6b7280',
  },
  searchWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#111827',
  },
  primaryButton: {
    backgroundColor: '#dc2626',
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 18,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 8,
  },
  resultText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 14,
  },
  emptySearchState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardTextWrapper: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 3,
  },
  cardCategory: {
    fontSize: 14,
    fontWeight: '600',
    color: '#dc2626',
  },
  cardText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#6b7280',
  },
});