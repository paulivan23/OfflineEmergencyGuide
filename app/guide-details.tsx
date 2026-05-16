import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import {
  addFavorite,
  getFavoriteByGuideAndUser,
  removeFavorite,
} from '../services/favoriteService';
import { getGuideById } from '../services/guideService';
import { addNotification } from '../services/notificationService';

type Guide = {
  id: string;
  title: string;
  category: string;
  content: string;
  userId?: string | null;
};

type Favorite = {
  id: string;
  userId: string;
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
      return 'book-outline';
  }
};

export default function GuideDetailsScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { user } = useAuth();

  const [guide, setGuide] = useState<Guide | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorite, setFavorite] = useState<Favorite | null>(null);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    const loadGuide = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const data = await getGuideById(id);
        setGuide(data as Guide | null);
      } catch (error) {
        console.log('Error loading guide:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGuide();
  }, [id]);

  useEffect(() => {
    const loadFavorite = async () => {
      if (!user || !id) return;

      try {
        const data = await getFavoriteByGuideAndUser(user.uid, id);
        setFavorite(data as Favorite | null);
      } catch (error) {
        console.log('Error loading favorite:', error);
      }
    };

    loadFavorite();
  }, [user, id]);

  const handleFavoriteToggle = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login first to save guides.');
      router.push('/login');
      return;
    }

    if (!guide) return;

    try {
      setFavoriteLoading(true);

      if (favorite) {
        await removeFavorite(favorite.id);

        await addNotification({
          title: 'Removed from Favorites',
          message: `"${guide.title}" was removed from favorites.`,
          type: 'favorite_removed',
        });

        setFavorite(null);
        Alert.alert('Removed', 'Guide removed from favorites.');
      } else {
        const favoriteId = await addFavorite({
          userId: user.uid,
          guideId: guide.id,
          title: guide.title,
          category: guide.category,
          content: guide.content,
        });

        await addNotification({
          title: 'Added to Favorites',
          message: `"${guide.title}" was saved to favorites.`,
          type: 'favorite_added',
        });

        setFavorite({
          id: favoriteId,
          userId: user.uid,
          guideId: guide.id,
          title: guide.title,
          category: guide.category,
          content: guide.content,
        });

        Alert.alert('Saved', 'Guide added to favorites.');
      }
    } catch (error: any) {
      console.log('Favorite error:', error);
      Alert.alert('Action Failed', error.message || 'Something went wrong.');
    } finally {
      setFavoriteLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#dc2626" />
        <Text style={styles.loadingText}>Loading details...</Text>
      </View>
    );
  }

  if (!guide) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.emptyIconBox}>
          <Ionicons name="document-text-outline" size={30} color="#dc2626" />
        </View>
        <Text style={styles.emptyTitle}>Guide Not Found</Text>
        <Text style={styles.emptyText}>
          The guide you are trying to open is not available.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.heroCard}>
        <View style={styles.heroTop}>
          <View style={styles.iconBox}>
            <Ionicons
              name={getCategoryIcon(guide.category) as any}
              size={26}
              color="#dc2626"
            />
          </View>

          <View style={styles.heroTextWrapper}>
            <Text style={styles.badge}>Guide Details</Text>
            <Text style={styles.title}>{guide.title}</Text>
          </View>
        </View>

        <View style={styles.categoryChip}>
          <Text style={styles.categoryChipText}>{guide.category}</Text>
        </View>
      </View>

      <View style={styles.contentCard}>
        <Text style={styles.sectionTitle}>Emergency Information</Text>
        <Text style={styles.contentText}>{guide.content}</Text>
      </View>

      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={handleFavoriteToggle}
        disabled={favoriteLoading}
      >
        <Ionicons
          name={favorite ? 'heart' : 'heart-outline'}
          size={18}
          color="#fff"
        />
        <Text style={styles.favoriteButtonText}>
          {favoriteLoading
            ? 'Please wait...'
            : favorite
            ? 'Saved to Favorites'
            : 'Save Guide'}
        </Text>
      </TouchableOpacity>

      {user && (
        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            router.push({
              pathname: '/edit-guide',
              params: { id: guide.id },
            })
          }
        >
          <Ionicons name="create-outline" size={18} color="#fff" />
          <Text style={styles.editButtonText}>Edit Guide</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 30,
    backgroundColor: '#f8fafc',
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
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  heroTextWrapper: {
    flex: 1,
  },
  badge: {
    fontSize: 13,
    fontWeight: '700',
    color: '#dc2626',
    textTransform: 'uppercase',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 34,
  },
  categoryChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#fee2e2',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  categoryChipText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '700',
  },
  contentCard: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  contentText: {
    fontSize: 15,
    lineHeight: 26,
    color: '#4b5563',
  },
  favoriteButton: {
    backgroundColor: '#111827',
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 12,
  },
  favoriteButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: '#dc2626',
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 8,
  },
});