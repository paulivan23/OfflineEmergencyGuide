import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function PreparednessDetailsScreen() {
  const { title, content } = useLocalSearchParams<{
    title?: string;
    content?: string;
  }>();

  const safeTitle = title || 'Preparedness Topic';
  const safeContent =
    content ||
    'No preparedness information is available for this topic right now.';

  const steps = safeContent
    .split('.')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.heroCard}>
        <View style={styles.heroTop}>
          <View style={styles.iconBox}>
            <Ionicons
              name="shield-checkmark-outline"
              size={28}
              color="#dc2626"
            />
          </View>

          <View style={styles.heroTextWrapper}>
            <Text style={styles.badge}>Preparedness Details</Text>
            <Text style={styles.title}>{safeTitle}</Text>
          </View>
        </View>

        <View style={styles.categoryChip}>
          <Text style={styles.categoryChipText}>Preparedness</Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <Text style={styles.contentText}>
          Preparedness means getting ready before an emergency happens. Planning
          ahead helps reduce panic, improves safety, and makes it easier to act
          quickly during critical situations.
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>What You Should Do</Text>

        {steps.length > 0 ? (
          steps.map((step, index) => (
            <View key={index} style={styles.stepRow}>
              <View style={styles.stepNumberBox}>
                <Text style={styles.stepNumber}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}.</Text>
            </View>
          ))
        ) : (
          <Text style={styles.contentText}>{safeContent}</Text>
        )}
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Why It Matters</Text>
        <Text style={styles.contentText}>
          Being prepared saves time, reduces confusion, and helps protect lives.
          It also allows families and communities to respond in a calmer and
          more organized way.
        </Text>
      </View>

      <View style={styles.reminderCard}>
        <View style={styles.reminderTop}>
          <Ionicons name="alert-circle-outline" size={20} color="#b45309" />
          <Text style={styles.reminderTitle}>Quick Reminder</Text>
        </View>
        <Text style={styles.reminderText}>
          Review emergency plans regularly, prepare important supplies in
          advance, and keep contact numbers easy to access.
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
    flexGrow: 1,
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
    width: 58,
    height: 58,
    borderRadius: 29,
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
  infoCard: {
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
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  stepNumberBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumber: {
    fontSize: 13,
    fontWeight: '700',
    color: '#dc2626',
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 25,
    color: '#4b5563',
  },
  reminderCard: {
    backgroundColor: '#fffbeb',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#fcd34d',
  },
  reminderTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  reminderTitle: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '700',
    color: '#92400e',
  },
  reminderText: {
    fontSize: 14,
    lineHeight: 24,
    color: '#78350f',
  },
});