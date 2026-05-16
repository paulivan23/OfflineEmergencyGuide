import AsyncStorage from '@react-native-async-storage/async-storage';

const OFFLINE_GUIDES_KEY = 'offline_guides';

export type OfflineGuide = {
  id: string;
  title: string;
  category: string;
  content: string;
};

export const saveGuidesOffline = async (guides: OfflineGuide[]) => {
  try {
    await AsyncStorage.setItem(OFFLINE_GUIDES_KEY, JSON.stringify(guides));
  } catch (error) {
    console.log('Error saving guides offline:', error);
  }
};

export const getOfflineGuides = async (): Promise<OfflineGuide[]> => {
  try {
    const data = await AsyncStorage.getItem(OFFLINE_GUIDES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.log('Error loading offline guides:', error);
    return [];
  }
};

export const clearOfflineGuides = async () => {
  try {
    await AsyncStorage.removeItem(OFFLINE_GUIDES_KEY);
  } catch (error) {
    console.log('Error clearing offline guides:', error);
  }
};

export const saveSingleGuideOffline = async (guide: OfflineGuide) => {
  try {
    const existingGuides = await getOfflineGuides();

    const updatedGuides = existingGuides.some((item) => item.id === guide.id)
      ? existingGuides.map((item) => (item.id === guide.id ? guide : item))
      : [...existingGuides, guide];

    await AsyncStorage.setItem(OFFLINE_GUIDES_KEY, JSON.stringify(updatedGuides));
  } catch (error) {
    console.log('Error saving single guide offline:', error);
  }
};

export const getOfflineGuideById = async (id: string): Promise<OfflineGuide | null> => {
  try {
    const guides = await getOfflineGuides();
    const guide = guides.find((item) => item.id === id);
    return guide || null;
  } catch (error) {
    console.log('Error getting offline guide by ID:', error);
    return null;
  }
};

export const removeOfflineGuideById = async (id: string) => {
  try {
    const guides = await getOfflineGuides();
    const updatedGuides = guides.filter((item) => item.id !== id);
    await AsyncStorage.setItem(OFFLINE_GUIDES_KEY, JSON.stringify(updatedGuides));
  } catch (error) {
    console.log('Error removing offline guide:', error);
  }
};