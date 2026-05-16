import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const quickActions = [
  {
    title: 'Emergency Guides',
    subtitle: 'Read emergency response guides',
    icon: 'book-outline',
    route: '/(tabs)/guides',
  },
  {
    title: 'First Aid',
    subtitle: 'Learn basic first aid instructions',
    icon: 'medkit-outline',
    route: '/(tabs)/first-aid',
  },
  {
    title: 'Preparedness',
    subtitle: 'Read disaster preparedness tips',
    icon: 'shield-checkmark-outline',
    route: '/(tabs)/preparedness',
  },
  {
    title: 'Emergency Contacts',
    subtitle: 'Open important hotline numbers',
    icon: 'call-outline',
    route: '/emergency-contacts',
  },
  {
    title: 'Favorite Guides',
    subtitle: 'View your saved guides',
    icon: 'heart-outline',
    route: '/favorites',
  },
];

export default function HomeScreen() {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.heroCard}>
        <Text style={styles.badge}>Offline Emergency Guide</Text>
        <Text style={styles.heroTitle}>Be prepared anytime and anywhere.</Text>
        <Text style={styles.heroSubtitle}>
          Access emergency guides, first aid information, preparedness tips,
          favorite guides, and contact numbers in one place.
        </Text>

        <View style={styles.heroReminder}>
          <Ionicons name="alert-circle-outline" size={18} color="#b45309" />
          <Text style={styles.heroReminderText}>
            Staying informed and prepared can help reduce panic during emergencies.
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Quick Access</Text>

      {quickActions.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.card}
          onPress={() => router.push(item.route as any)}
        >
          <View style={styles.iconBox}>
            <Ionicons name={item.icon as any} size={24} color="#dc2626" />
          </View>

          <View style={styles.cardTextWrapper}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
          </View>

          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>
      ))}

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Emergency Reminder</Text>
        <Text style={styles.infoText}>
          Keep calm, stay alert, and follow trusted safety information. Review
          emergency plans regularly so you can respond faster when needed.
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
  heroCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 22,
    marginBottom: 22,
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
    fontSize: 28,
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
  heroReminder: {
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fcd34d',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  heroReminderText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    lineHeight: 21,
    color: '#92400e',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 14,
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
    width: 48,
    height: 48,
    borderRadius: 24,
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
    marginTop: 6,
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
