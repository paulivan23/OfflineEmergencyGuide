import AsyncStorage from '@react-native-async-storage/async-storage';

export type AppNotificationType =
  | 'guide_created'
  | 'guide_updated'
  | 'guide_deleted'
  | 'favorite_added'
  | 'favorite_removed';

export type AppNotification = {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type: AppNotificationType;
  createdAt: number;
};

const NOTIFICATIONS_KEY = 'app_notifications';

const formatRelativeTime = () => {
  return 'Just now';
};

export const getNotifications = async (): Promise<AppNotification[]> => {
  try {
    const data = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.log('Error loading notifications:', error);
    return [];
  }
};

export const saveNotifications = async (
  notifications: AppNotification[]
): Promise<void> => {
  try {
    await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  } catch (error) {
    console.log('Error saving notifications:', error);
  }
};

export const addNotification = async ({
  title,
  message,
  type,
}: {
  title: string;
  message: string;
  type: AppNotificationType;
}): Promise<void> => {
  try {
    const existing = await getNotifications();

    const newNotification: AppNotification = {
      id: Date.now().toString(),
      title,
      message,
      time: formatRelativeTime(),
      unread: true,
      type,
      createdAt: Date.now(),
    };

    const updated = [newNotification, ...existing];
    await saveNotifications(updated);
  } catch (error) {
    console.log('Error adding notification:', error);
  }
};

export const markNotificationAsRead = async (id: string): Promise<void> => {
  try {
    const existing = await getNotifications();
    const updated = existing.map((item) =>
      item.id === id ? { ...item, unread: false } : item
    );
    await saveNotifications(updated);
  } catch (error) {
    console.log('Error marking notification as read:', error);
  }
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  try {
    const existing = await getNotifications();
    const updated = existing.map((item) => ({ ...item, unread: false }));
    await saveNotifications(updated);
  } catch (error) {
    console.log('Error marking all notifications as read:', error);
  }
};

export const deleteNotification = async (id: string): Promise<void> => {
  try {
    const existing = await getNotifications();
    const updated = existing.filter((item) => item.id !== id);
    await saveNotifications(updated);
  } catch (error) {
    console.log('Error deleting notification:', error);
  }
};

export const clearAllNotifications = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(NOTIFICATIONS_KEY);
  } catch (error) {
    console.log('Error clearing notifications:', error);
  }
};