import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { logoutUser } from '../../services/authService';
import { getFavoritesByUser } from '../../services/favoriteService';

type Favorite = {
  id: string;
  guideId: string;
  title: string;
  category: string;
  content: string;
};

export default function ProfileScreen() {
  const { user, loading } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [favoritesLoading, setFavoritesLoading] = useState(true);

  const loadFavorites = async () => {
    if (!user) {
      setFavorites([]);
      setFavoritesLoading(false);
      return;
    }

    try {
      const data = await getFavoritesByUser(user.uid);
      setFavorites(data as Favorite[]);
    } catch (error) {
      console.log('Error loading favorites:', error);
      setFavorites([]);
    } finally {
      setFavoritesLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setFavoritesLoading(true);
      loadFavorites();
    }, [user])
  );

  const handleLogout = async () => {
    try {
      await logoutUser();
      Alert.alert('Logged Out', 'You have been logged out successfully.');
      router.replace('/login');
    } catch (error: any) {
      Alert.alert('Logout Failed', error.message || 'Something went wrong.');
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#dc2626" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  const isGuest = !user;
  const recentFavorites = favorites.slice(0, 2);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerCard}>
        <View style={styles.avatar}>
          <Ionicons name="person-outline" size={34} color="#dc2626" />
        </View>

        <Text style={styles.name}>
          {isGuest ? 'Guest User' : user.displayName || 'User'}
        </Text>

        <Text style={styles.email}>
          {isGuest ? 'You are browsing as a guest.' : user.email}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>

        {isGuest ? (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.primaryButtonText}>Login to Your Account</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push('/edit-profile')}
            >
              <View style={styles.iconBox}>
                <Ionicons name="create-outline" size={22} color="#dc2626" />
              </View>

              <View style={styles.cardTextWrapper}>
                <Text style={styles.cardTitle}>Edit Profile</Text>
                <Text style={styles.cardSubtitle}>
                  Update your email and password
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleLogout}
            >
              <Text style={styles.primaryButtonText}>Logout</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Favorite Guides</Text>

        <TouchableOpacity
          style={styles.favoriteCard}
          onPress={() => router.push('/favorites')}
        >
          <View style={styles.favoriteTop}>
            <View style={styles.favoriteIconBox}>
              <Ionicons name="heart-outline" size={24} color="#dc2626" />
            </View>

            <View style={styles.favoriteTextWrapper}>
              <Text style={styles.favoriteTitle}>Favorite Guides</Text>
              <Text style={styles.favoriteSubtitle}>
                Quickly open your saved emergency guides
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </View>

          {favoritesLoading ? (
            <View style={styles.favoriteLoadingBox}>
              <ActivityIndicator size="small" color="#dc2626" />
              <Text style={styles.favoriteLoadingText}>
                Loading favorites...
              </Text>
            </View>
          ) : isGuest ? (
            <View style={styles.favoriteEmptyBox}>
              <Text style={styles.favoriteEmptyText}>
                Login to save and view favorite guides.
              </Text>
            </View>
          ) : favorites.length === 0 ? (
            <View style={styles.favoriteEmptyBox}>
              <Text style={styles.favoriteEmptyText}>
                No favorite guides yet.
              </Text>
            </View>
          ) : (
            <View style={styles.favoriteStatsRow}>
              <View style={styles.favoriteStatBox}>
                <Text style={styles.favoriteStatNumber}>{favorites.length}</Text>
                <Text style={styles.favoriteStatLabel}>Saved</Text>
              </View>

              <View style={styles.favoriteDivider} />

              <View style={styles.favoritePreviewBox}>
                <Text style={styles.favoritePreviewTitle}>Recent</Text>
                {recentFavorites.map((item) => (
                  <Text
                    key={item.id}
                    style={styles.favoritePreviewText}
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                ))}
              </View>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Access</Text>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/emergency-contacts')}
        >
          <View style={styles.iconBox}>
            <Ionicons name="call-outline" size={22} color="#dc2626" />
          </View>

          <View style={styles.cardTextWrapper}>
            <Text style={styles.cardTitle}>Emergency Contacts</Text>
            <Text style={styles.cardSubtitle}>
              Open important hotline numbers
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/(tabs)/guides')}
        >
          <View style={styles.iconBox}>
            <Ionicons name="book-outline" size={22} color="#dc2626" />
          </View>

          <View style={styles.cardTextWrapper}>
            <Text style={styles.cardTitle}>Emergency Guides</Text>
            <Text style={styles.cardSubtitle}>
              Browse available emergency response guides
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/notifications')}
        >
          <View style={styles.iconBox}>
            <Ionicons
              name="notifications-outline"
              size={22}
              color="#dc2626"
            />
          </View>

          <View style={styles.cardTextWrapper}>
            <Text style={styles.cardTitle}>Notifications</Text>
            <Text style={styles.cardSubtitle}>
              View your recent activity updates
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>About This Account</Text>
        <Text style={styles.infoText}>
          Logged-in users can save favorite guides, update their account,
          and access personalized features. Guests can still browse public
          emergency information and preparedness content.
        </Text>
      </View>
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
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  headerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 22,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  avatar: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
    textAlign: 'center',
  },
  email: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 21,
  },
  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 14,
  },
  primaryButton: {
    backgroundColor: '#dc2626',
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  favoriteCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  favoriteTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  favoriteIconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  favoriteTextWrapper: {
    flex: 1,
  },
  favoriteTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 3,
  },
  favoriteSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  favoriteStatsRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  favoriteStatBox: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 16,
  },
  favoriteStatNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#dc2626',
  },
  favoriteStatLabel: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  favoriteDivider: {
    width: 1,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 4,
  },
  favoritePreviewBox: {
    flex: 1,
    paddingLeft: 16,
  },
  favoritePreviewTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  favoritePreviewText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 21,
  },
  favoriteLoadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteLoadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6b7280',
  },
  favoriteEmptyBox: {
    paddingTop: 4,
  },
  favoriteEmptyText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 21,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
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
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 3,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  infoTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#6b7280',
  },
});