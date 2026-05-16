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

const preparednessTips = [
  {
    id: '1',
    title: 'Go-Bag Checklist',
    shortDescription: 'Important items to prepare before an emergency happens.',
    content:
      'Prepare a go-bag with drinking water, ready-to-eat food, flashlight, batteries, power bank, whistle, medicines, extra clothes, important documents, cash, and hygiene supplies. Keep the bag in a place that is easy to reach so you can bring it quickly during emergencies.',
  },
  {
    id: '2',
    title: 'Earthquake Preparation',
    shortDescription: 'Ways to prepare before an earthquake occurs.',
    content:
      'Secure heavy furniture and appliances to prevent them from falling. Identify safe spots inside the house such as under a strong table and away from windows. Practice drop, cover, and hold. Prepare emergency supplies and teach family members what to do during and after an earthquake.',
  },
  {
    id: '3',
    title: 'Flood Preparation',
    shortDescription: 'Safety preparations before floodwaters rise.',
    content:
      'Monitor weather updates and local warnings. Move valuable items and appliances to higher areas. Prepare clean water, food, medicine, flashlight, and important documents in waterproof containers. Know the nearest evacuation area and avoid low-lying places when heavy rain continues.',
  },
  {
    id: '4',
    title: 'Fire Safety Preparation',
    shortDescription: 'How to prepare your home and family for fire emergencies.',
    content:
      'Check electrical wiring and avoid overloading outlets. Keep matches and flammable materials away from children. Prepare a fire extinguisher if possible. Make an escape plan and identify safe exits. Teach family members how to leave the house quickly and safely during a fire.',
  },
  {
    id: '5',
    title: 'Family Emergency Plan',
    shortDescription: 'Create a clear plan for your family during emergencies.',
    content:
      'Discuss emergency roles with family members. Decide where to meet if you become separated. Keep a list of important contact numbers. Teach children basic emergency actions and remind everyone to stay calm. Review the plan regularly so every family member remembers it.',
  },
];

export default function PreparednessScreen() {
  const [searchText, setSearchText] = useState('');

  const filteredTips = useMemo(() => {
    const keyword = searchText.toLowerCase();

    return preparednessTips.filter((item) => {
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
        data={filteredTips}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <View style={styles.heroCard}>
              <Text style={styles.badge}>Preparedness Tips</Text>
              <Text style={styles.heroTitle}>
                Prepare before emergencies happen.
              </Text>
              <Text style={styles.heroSubtitle}>
                Learn practical safety tips and planning steps to help protect
                yourself and your family.
              </Text>
            </View>

            <View style={styles.searchWrapper}>
              <Ionicons name="search-outline" size={20} color="#6b7280" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search preparedness tips"
                placeholderTextColor="#9ca3af"
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>

            <Text style={styles.resultText}>
              {filteredTips.length} tip{filteredTips.length !== 1 ? 's' : ''} found
            </Text>

            <Text style={styles.sectionTitle}>Preparedness Topics</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconBox}>
              <Ionicons
                name="shield-checkmark-outline"
                size={30}
                color="#dc2626"
              />
            </View>
            <Text style={styles.emptyTitle}>No Matching Tips</Text>
            <Text style={styles.emptyText}>
              Try another keyword to find the preparedness tip you need.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: '/preparedness-details',
                params: {
                  title: item.title,
                  content: item.content,
                },
              })
            }
          >
            <View style={styles.cardTop}>
              <View style={styles.iconBox}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={22}
                  color="#dc2626"
                />
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