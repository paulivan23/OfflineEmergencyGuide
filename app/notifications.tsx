import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    AppNotification,
    clearAllNotifications,
    deleteNotification,
    getNotifications,
    markAllNotificationsAsRead,
    markNotificationAsRead,
} from '../services/notificationService';

type ListItem =
  | { type: 'section'; title: string; id: string }
  | { type: 'notification'; data: AppNotification; id: string };

const getNotificationMeta = (type: AppNotification['type']) => {
  switch (type) {
    case 'guide_created':
      return {
        icon: 'add-circle-outline',
        bgColor: '#dcfce7',
        iconColor: '#16a34a',
        label: 'Guide Created',
      };
    case 'guide_updated':
      return {
        icon: 'create-outline',
        bgColor: '#dbeafe',
        iconColor: '#2563eb',
        label: 'Guide Updated',
      };
    case 'guide_deleted':
      return {
        icon: 'trash-outline',
        bgColor: '#fee2e2',
        iconColor: '#dc2626',
        label: 'Guide Deleted',
      };
    case 'favorite_added':
      return {
        icon: 'heart-outline',
        bgColor: '#fee2e2',
        iconColor: '#dc2626',
        label: 'Favorite Added',
      };
    case 'favorite_removed':
      return {
        icon: 'heart-dislike-outline',
        bgColor: '#f3f4f6',
        iconColor: '#6b7280',
        label: 'Favorite Removed',
      };
    default:
      return {
        icon: 'notifications-outline',
        bgColor: '#fee2e2',
        iconColor: '#dc2626',
        label: 'Notification',
      };
  }
};

export default function NotificationsScreen() {
  const [searchText, setSearchText] = useState('');
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const loadNotifications = async () => {
    const data = await getNotifications();
    setNotifications(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [])
  );

  const filteredNotifications = useMemo(() => {
    const keyword = searchText.toLowerCase();

    return notifications.filter((item) => {
      const meta = getNotificationMeta(item.type);

      return (
        item.title.toLowerCase().includes(keyword) ||
        item.message.toLowerCase().includes(keyword) ||
        meta.label.toLowerCase().includes(keyword)
      );
    });
  }, [notifications, searchText]);

  const unreadItems = filteredNotifications.filter((item) => item.unread);
  const earlierItems = filteredNotifications.filter((item) => !item.unread);
  const unreadAll = notifications.filter((item) => item.unread);

  const listData: ListItem[] = useMemo(
    () => [
      ...(unreadItems.length > 0
        ? [
            { type: 'section', title: 'Unread', id: 'section-unread' } as ListItem,
            ...unreadItems.map(
              (item) => ({ type: 'notification', data: item, id: item.id }) as ListItem
            ),
          ]
        : []),
      ...(earlierItems.length > 0
        ? [
            { type: 'section', title: 'Earlier', id: 'section-earlier' } as ListItem,
            ...earlierItems.map(
              (item) => ({ type: 'notification', data: item, id: item.id }) as ListItem
            ),
          ]
        : []),
    ],
    [unreadItems, earlierItems]
  );

  const handleMarkAllAsRead = async () => {
    await markAllNotificationsAsRead();
    await loadNotifications();
  };

  const handleNotificationPress = async (notificationId: string) => {
    await markNotificationAsRead(notificationId);
    await loadNotifications();
  };

  const handleDeleteNotification = (notificationId: string) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteNotification(notificationId);
            await loadNotifications();
          },
        },
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to remove all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            await clearAllNotifications();
            await loadNotifications();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.screen}>
      <FlatList
        data={listData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <View style={styles.heroCard}>
              <Text style={styles.badge}>Notifications</Text>
              <Text style={styles.heroTitle}>Stay updated and informed.</Text>
              <Text style={styles.heroSubtitle}>
                View real activity updates from your app actions.
              </Text>

              <View style={styles.topActions}>
                {unreadAll.length > 0 && (
                  <TouchableOpacity
                    style={styles.markAllButton}
                    onPress={handleMarkAllAsRead}
                  >
                    <Ionicons
                      name="checkmark-done-outline"
                      size={18}
                      color="#dc2626"
                    />
                    <Text style={styles.markAllButtonText}>Mark all as read</Text>
                  </TouchableOpacity>
                )}

                {notifications.length > 0 && (
                  <TouchableOpacity
                    style={styles.clearAllButton}
                    onPress={handleClearAll}
                  >
                    <Ionicons name="trash-outline" size={18} color="#6b7280" />
                    <Text style={styles.clearAllButtonText}>Clear all</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View style={styles.searchWrapper}>
              <Ionicons name="search-outline" size={20} color="#6b7280" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search notifications"
                placeholderTextColor="#9ca3af"
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>

            <Text style={styles.resultText}>
              {filteredNotifications.length} notification
              {filteredNotifications.length !== 1 ? 's' : ''} found
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          if (item.type === 'section') {
            return <Text style={styles.sectionTitle}>{item.title}</Text>;
          }

          const notification = item.data;
          const meta = getNotificationMeta(notification.type);

          return (
            <View style={styles.card}>
              <TouchableOpacity
                style={styles.cardPressable}
                onPress={() => handleNotificationPress(notification.id)}
              >
                <View style={styles.cardLeft}>
                  <View
                    style={[
                      styles.iconBox,
                      { backgroundColor: meta.bgColor },
                      notification.unread && styles.iconBoxUnread,
                    ]}
                  >
                    <Ionicons
                      name={meta.icon as any}
                      size={22}
                      color={meta.iconColor}
                    />
                  </View>

                  <View style={styles.cardTextWrapper}>
                    <View style={styles.titleRow}>
                      <Text style={styles.cardTitle}>{notification.title}</Text>
                      {notification.unread && <View style={styles.unreadDot} />}
                    </View>

                    <View style={styles.typeChip}>
                      <Text style={styles.typeChipText}>{meta.label}</Text>
                    </View>

                    <Text style={styles.cardMessage}>{notification.message}</Text>
                    <Text style={styles.cardTime}>{notification.time}</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteNotification(notification.id)}
              >
                <Ionicons name="trash-outline" size={16} color="#fff" />
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconBox}>
              <Ionicons
                name="notifications-outline"
                size={30}
                color="#dc2626"
              />
            </View>
            <Text style={styles.emptyTitle}>No Notifications Found</Text>
            <Text style={styles.emptyText}>
              Wala ka pang activity-based notifications sa app.
            </Text>
          </View>
        }
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
  topActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff5f5',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  markAllButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '700',
    color: '#dc2626',
  },
  clearAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  clearAllButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '700',
    color: '#6b7280',
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
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    marginTop: 4,
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
  cardPressable: {
    marginBottom: 12,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  iconBoxUnread: {
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  cardTextWrapper: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#dc2626',
    marginLeft: 8,
  },
  typeChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    marginBottom: 8,
  },
  typeChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
  cardMessage: {
    fontSize: 14,
    lineHeight: 22,
    color: '#6b7280',
    marginBottom: 8,
  },
  cardTime: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '600',
  },
  deleteButton: {
    alignSelf: 'flex-end',
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#6b7280',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 6,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
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
});