import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { getFavoritesByUser } from '../services/favoriteService';

type Favorite = {
  id: string;
  guideId: string;
  title: string;
  category: string;
  content: string;
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
      return 'heart-outline';
  }
};

export default function FavoritesScreen() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  const loadFavorites = async () => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    try {
      const data = await getFavoritesByUser(user.uid);
      setFavorites(data as Favorite[]);
    } catch (error) {
      console.log('Error loading favorites:', error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadFavorites();
    }, [user])
  );

  const filteredFavorites = useMemo(() => {
    return favorites.filter((item) => {
      const keyword = searchText.toLowerCase();

      return (
        item.title.toLowerCase().includes(keyword) ||
        item.category.toLowerCase().includes(keyword) ||
        item.content.toLowerCase().includes(keyword)
      );
    });
  }, [favorites, searchText]);

  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.emptyIconBox}>
          <Ionicons name="lock-closed-outline" size={30} color="#dc2626" />
        </View>
        <Text style={styles.emptyTitle}>Login Required</Text>
        <Text style={styles.emptyText}>
          Please login first to view your favorite guides.
        </Text>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.primaryButtonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#dc2626" />
        <Text style={styles.loadingText}>Loading favorites...</Text>
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.emptyIconBox}>
          <Ionicons name="heart-outline" size={30} color="#dc2626" />
        </View>
        <Text style={styles.emptyTitle}>No Favorite Guides Yet</Text>
        <Text style={styles.emptyText}>
          Save important emergency guides so you can find them faster later.
        </Text>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('/(tabs)/guides')}
        >
          <Text style={styles.primaryButtonText}>Browse Guides</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={filteredFavorites}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <View style={styles.heroCard}>
              <Text style={styles.badge}>Favorite Guides</Text>
              <Text style={styles.heroTitle}>Your saved emergency guides.</Text>
              <Text style={styles.heroSubtitle}>
                Quickly access the guides you marked as important.
              </Text>

              <View style={styles.countBox}>
                <Text style={styles.countNumber}>{favorites.length}</Text>
                <Text style={styles.countLabel}>Saved Guides</Text>
              </View>
            </View>

            <View style={styles.searchWrapper}>
              <Ionicons name="search-outline" size={20} color="#6b7280" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search favorite guides"
                placeholderTextColor="#9ca3af"
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>

            <Text style={styles.resultText}>
              {filteredFavorites.length} result
              {filteredFavorites.length !== 1 ? 's' : ''} found
            </Text>

            <Text style={styles.sectionTitle}>Saved List</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptySearchState}>
            <View style={styles.emptyIconBox}>
              <Ionicons name="search-outline" size={30} color="#dc2626" />
            </View>
            <Text style={styles.emptyTitle}>No Matching Favorites</Text>
            <Text style={styles.emptyText}>
              Try another keyword to find a saved guide.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: '/guide-details',
                params: { id: item.guideId },
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
  primaryButton: {
    backgroundColor: '#dc2626',
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 22,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
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
    marginBottom: 16,
  },
  countBox: {
    backgroundColor: '#fee2e2',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },
  countNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: '#dc2626',
  },
  countLabel: {
    fontSize: 13,
    color: '#7f1d1d',
    fontWeight: '600',
  },
  searchWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#111827',
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