import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import {
  getGuideById,
  softDeleteGuide,
  updateGuide,
} from '../services/guideService';
import { addNotification } from '../services/notificationService';

const categoryOptions = [
  { label: 'Earthquake', icon: 'earth-outline' },
  { label: 'Fire', icon: 'flame-outline' },
  { label: 'Flood', icon: 'water-outline' },
  { label: 'Typhoon', icon: 'thunderstorm-outline' },
  { label: 'Landslide', icon: 'trail-sign-outline' },
  { label: 'First Aid', icon: 'medkit-outline' },
  { label: 'Emergency Contacts', icon: 'call-outline' },
  { label: 'Preparedness', icon: 'shield-checkmark-outline' },
  { label: 'Other', icon: 'ellipsis-horizontal-circle-outline' },
];

type Guide = {
  id: string;
  title: string;
  category: string;
  content: string;
  userId?: string | null;
};

export default function EditGuideScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { user } = useAuth();

  const [guide, setGuide] = useState<Guide | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  const selectedCategoryData =
    categoryOptions.find((item) => item.label === category) || null;

  useEffect(() => {
    const loadGuide = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const data = await getGuideById(id);
        const typedGuide = data as Guide | null;

        if (typedGuide) {
          setGuide(typedGuide);
          setTitle(typedGuide.title);
          setCategory(typedGuide.category);
          setContent(typedGuide.content);
        }
      } catch (error) {
        console.log('Error loading guide:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGuide();
  }, [id]);

  const handleUpdate = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login first.');
      router.push('/login');
      return;
    }

    if (!id) {
      Alert.alert('Error', 'Guide ID is missing.');
      return;
    }

    if (!title.trim() || !category.trim() || !content.trim()) {
      Alert.alert('Missing Information', 'Please complete all fields.');
      return;
    }

    try {
      setSaving(true);

      await updateGuide(id, {
        title: title.trim(),
        category: category.trim(),
        content: content.trim(),
      });

      await addNotification({
        title: 'Guide Updated',
        message: `"${title.trim()}" has been updated successfully.`,
        type: 'guide_updated',
      });

      Alert.alert('Guide Updated', 'Your guide has been updated successfully.');
      router.replace('/(tabs)/guides');
    } catch (error: any) {
      console.log('Update guide error:', error);
      Alert.alert('Update Failed', error.message || 'Unable to update guide.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login first.');
      router.push('/login');
      return;
    }

    if (!id) {
      Alert.alert('Error', 'Guide ID is missing.');
      return;
    }

    Alert.alert(
      'Delete Guide',
      'Are you sure you want to remove this guide?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await softDeleteGuide(id);

              await addNotification({
                title: 'Guide Deleted',
                message: 'A guide has been removed from your list.',
                type: 'guide_deleted',
              });

              Alert.alert('Guide Deleted', 'The guide has been removed successfully.');
              router.replace('/(tabs)/guides');
            } catch (error: any) {
              console.log('Delete guide error:', error);
              Alert.alert('Delete Failed', error.message || 'Unable to delete guide.');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#dc2626" />
        <Text style={styles.loadingText}>Loading guide...</Text>
      </View>
    );
  }

  if (!guide) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Guide not found.</Text>
      </View>
    );
  }

  return (
    <>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topSection}>
            <Text style={styles.badge}>Edit Emergency Guide</Text>
            <Text style={styles.title}>Update Guide</Text>
            <Text style={styles.subtitle}>
              Edit the emergency information and keep your guide accurate and useful.
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Guide Title</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter guide title"
                placeholderTextColor="#9ca3af"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Select Category</Text>
              <TouchableOpacity
                style={styles.categorySelector}
                onPress={() => setCategoryModalVisible(true)}
              >
                <View style={styles.categorySelectorLeft}>
                  {selectedCategoryData ? (
                    <Ionicons
                      name={selectedCategoryData.icon as any}
                      size={20}
                      color="#dc2626"
                    />
                  ) : (
                    <Ionicons name="grid-outline" size={20} color="#9ca3af" />
                  )}

                  <Text
                    style={[
                      styles.categorySelectorText,
                      !selectedCategoryData && styles.placeholderText,
                    ]}
                  >
                    {selectedCategoryData
                      ? selectedCategoryData.label
                      : 'Choose a category'}
                  </Text>
                </View>

                <Ionicons
                  name="chevron-down-outline"
                  size={20}
                  color="#6b7280"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Guide Content</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Write the emergency instructions here"
                placeholderTextColor="#9ca3af"
                value={content}
                onChangeText={setContent}
                multiline
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, saving && styles.buttonDisabled]}
              onPress={handleUpdate}
              disabled={saving}
            >
              <Ionicons name="create-outline" size={18} color="#fff" />
              <Text style={styles.primaryButtonText}>
                {saving ? 'Updating Guide...' : 'Update Guide'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <Ionicons name="trash-outline" size={18} color="#fff" />
              <Text style={styles.deleteButtonText}>Delete Guide</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={categoryModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity onPress={() => setCategoryModalVisible(false)}>
                <Ionicons name="close-outline" size={24} color="#111827" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={categoryOptions}
              keyExtractor={(item) => item.label}
              renderItem={({ item }) => {
                const isSelected = category === item.label;

                return (
                  <TouchableOpacity
                    style={styles.categoryOption}
                    onPress={() => {
                      setCategory(item.label);
                      setCategoryModalVisible(false);
                    }}
                  >
                    <View style={styles.categoryOptionLeft}>
                      <View style={styles.categoryIconBox}>
                        <Ionicons
                          name={item.icon as any}
                          size={20}
                          color="#dc2626"
                        />
                      </View>
                      <Text style={styles.categoryOptionText}>{item.label}</Text>
                    </View>

                    {isSelected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={22}
                        color="#dc2626"
                      />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 30,
  },
  topSection: {
    marginBottom: 24,
  },
  badge: {
    fontSize: 13,
    fontWeight: '700',
    color: '#dc2626',
    textTransform: 'uppercase',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 23,
    color: '#6b7280',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 22,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#fff',
  },
  textArea: {
    minHeight: 150,
  },
  categorySelector: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categorySelectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categorySelectorText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#111827',
  },
  placeholderText: {
    color: '#9ca3af',
  },
  primaryButton: {
    backgroundColor: '#dc2626',
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 6,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: '#6b7280',
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 12,
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.45)',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    maxHeight: '75%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  categoryOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryOptionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
});