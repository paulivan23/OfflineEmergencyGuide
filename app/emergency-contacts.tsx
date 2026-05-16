import Ionicons from '@expo/vector-icons/Ionicons';
import { useMemo, useState } from 'react';
import {
  FlatList,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const emergencyContacts = [
  {
    id: '1',
    name: 'National Emergency Hotline',
    number: '911',
    description: 'For police, fire, and medical emergencies.',
  },
  {
    id: '2',
    name: 'Philippine Red Cross',
    number: '143',
    description: 'Emergency response and first aid assistance.',
  },
  {
    id: '3',
    name: 'Bureau of Fire Protection',
    number: '(02) 8426-0219',
    description: 'Fire emergency assistance and rescue support.',
  },
  {
    id: '4',
    name: 'Local Police Station',
    number: '0999-999-9999',
    description: 'Replace with your local police contact number.',
  },
  {
    id: '5',
    name: 'Nearest Hospital',
    number: '0999-888-8888',
    description: 'Replace with your nearest hospital emergency number.',
  },
];

export default function EmergencyContactsScreen() {
  const [searchText, setSearchText] = useState('');

  const filteredContacts = useMemo(() => {
    const keyword = searchText.toLowerCase();

    return emergencyContacts.filter((item) => {
      return (
        item.name.toLowerCase().includes(keyword) ||
        item.number.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword)
      );
    });
  }, [searchText]);

  const handleCall = async (number: string) => {
    const cleanedNumber = number.replace(/[^\d+]/g, '');
    const phoneUrl = `tel:${cleanedNumber}`;

    const supported = await Linking.canOpenURL(phoneUrl);

    if (supported) {
      await Linking.openURL(phoneUrl);
    }
  };

  return (
    <View style={styles.screen}>
      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <View style={styles.heroCard}>
              <Text style={styles.badge}>Emergency Contacts</Text>
              <Text style={styles.heroTitle}>
                Important hotline numbers in one place.
              </Text>
              <Text style={styles.heroSubtitle}>
                Quickly access emergency contact numbers for faster response during urgent situations.
              </Text>
            </View>

            <View style={styles.searchWrapper}>
              <Ionicons name="search-outline" size={20} color="#6b7280" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search emergency contacts"
                placeholderTextColor="#9ca3af"
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>

            <Text style={styles.resultText}>
              {filteredContacts.length} contact
              {filteredContacts.length !== 1 ? 's' : ''} found
            </Text>

            <Text style={styles.sectionTitle}>Contact List</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconBox}>
              <Ionicons name="call-outline" size={30} color="#dc2626" />
            </View>
            <Text style={styles.emptyTitle}>No Matching Contacts</Text>
            <Text style={styles.emptyText}>
              Try another keyword to find the contact you need.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardLeft}>
              <View style={styles.iconBox}>
                <Ionicons name="call-outline" size={22} color="#dc2626" />
              </View>

              <View style={styles.cardTextWrapper}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardNumber}>{item.number}</Text>
                <Text style={styles.cardDescription}>{item.description}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.callButton}
              onPress={() => handleCall(item.number)}
            >
              <Ionicons name="call" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
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
  cardNumber: {
    fontSize: 15,
    fontWeight: '700',
    color: '#dc2626',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 13,
    lineHeight: 20,
    color: '#6b7280',
  },
  callButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#dc2626',
    justifyContent: 'center',
    alignItems: 'center',
  },
});