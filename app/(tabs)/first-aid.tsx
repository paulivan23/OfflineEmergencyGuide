import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const firstAidTopics = [
  {
    id: '1',
    title: 'Cuts and Bleeding',
    shortDescription: 'Basic steps to control bleeding and protect the wound.',
    content:
      'Stay calm and make sure the area is safe. Wash your hands if possible. Apply gentle but firm pressure to the wound using a clean cloth or bandage. If possible, raise the injured part above heart level. Keep pressure until the bleeding slows down or stops. Clean the wound gently with clean water and cover it with a sterile dressing. Seek medical help if the bleeding is heavy, does not stop, or the wound is deep.',
  },
  {
    id: '2',
    title: 'Burns',
    shortDescription: 'How to respond to minor burns safely.',
    content:
      'Move the person away from the source of the burn. Cool the burned area with clean running water for several minutes. Do not apply ice directly. Remove tight items near the burned area if there is no swelling yet. Cover the burn with a clean non-stick cloth or bandage. Do not apply toothpaste, butter, or oil. Seek medical help if the burn is large, deep, or located on the face, hands, feet, or other sensitive areas.',
  },
  {
    id: '3',
    title: 'Choking',
    shortDescription: 'What to do when a person cannot breathe properly.',
    content:
      'Ask the person if they can speak or cough. If they cannot breathe, speak, or cough, call for emergency help immediately. Give firm back blows between the shoulder blades. If needed, perform abdominal thrusts carefully if you are trained. For infants, use proper infant first aid methods. Continue until the object is removed or professional help arrives.',
  },
  {
    id: '4',
    title: 'Fainting',
    shortDescription: 'How to help someone who suddenly loses consciousness briefly.',
    content:
      'Lay the person flat on their back in a safe area. Raise their legs slightly if there is no injury. Loosen tight clothing and make sure they are getting fresh air. If they recover, help them sit up slowly. If they do not wake up quickly, have difficulty breathing, or are injured, call emergency services immediately.',
  },
  {
    id: '5',
    title: 'Sprain',
    shortDescription: 'Basic care for a sprained joint.',
    content:
      'Let the injured person rest the affected area. Apply a cold compress wrapped in cloth for short periods to reduce swelling. Use a bandage for gentle support if needed. Keep the area elevated when possible. Avoid forcing movement. Seek medical advice if pain is severe, swelling is heavy, or walking is difficult.',
  },
];

export default function FirstAidScreen() {
  const [searchText, setSearchText] = useState('');

  const filteredTopics = useMemo(() => {
    const keyword = searchText.toLowerCase();

    return firstAidTopics.filter((item) => {
      return (
        item.title.toLowerCase().includes(keyword) ||
        item.shortDescription.toLowerCase().includes(keyword) ||
        item.content.toLowerCase().includes(keyword)
      );
    });
  }, [searchText]);

  return (
    <View style={styles.screen}>
      <FlatList
        data={filteredTopics}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <View style={styles.heroCard}>
              <Text style={styles.badge}>First Aid</Text>
              <Text style={styles.heroTitle}>
                Quick help for common emergency situations.
              </Text>
              <Text style={styles.heroSubtitle}>
                Learn simple first aid guidance that can help you respond more calmly and safely.
              </Text>
            </View>

            <View style={styles.searchWrapper}>
              <Ionicons name="search-outline" size={20} color="#6b7280" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search first aid topics"
                placeholderTextColor="#9ca3af"
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>

            <Text style={styles.resultText}>
              {filteredTopics.length} topic{filteredTopics.length !== 1 ? 's' : ''} found
            </Text>

            <Text style={styles.sectionTitle}>First Aid Topics</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconBox}>
              <Ionicons name="medkit-outline" size={30} color="#dc2626" />
            </View>
            <Text style={styles.emptyTitle}>No Matching Topics</Text>
            <Text style={styles.emptyText}>
              Try another keyword to find the first aid topic you need.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: '/first-aid-details',
                params: {
                  title: item.title,
                  content: item.content,
                },
              })
            }
          >
            <View style={styles.cardTop}>
              <View style={styles.iconBox}>
                <Ionicons name="medkit-outline" size={22} color="#dc2626" />
              </View>

              <View style={styles.cardTextWrapper}>
                <Text style={styles.cardTitle}>{item.title}</Text>
              </View>

              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </View>

            <Text style={styles.cardText}>{item.shortDescription}</Text>
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
  },
  cardText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#6b7280',
  },
});