import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Screen from '@/components/ui/Screen';
import AppText from '@/components/ui/AppText';
import PrimaryButton from '@/components/ui/PrimaryButton';
import Card from '@/components/ui/Card';
import { SUGGESTED_HABITS, DEMO_HABITS } from '@/data/mockHabits';
import { useAppStore } from '@/store/useAppStore';
import { Colors, Spacing } from '@/constants/theme';
import { Copy } from '@/constants/copy';
import { Habit } from '@/types';

export default function ConfirmHabits() {
  const { selectedHabitIds, selectedGoalIds, completeOnboarding, toggleHabit } = useAppStore();

  const allSuggested: Habit[] = selectedGoalIds.flatMap(
    (goalId) => SUGGESTED_HABITS[goalId] ?? []
  );
  const selectedHabits = allSuggested.filter((h) => selectedHabitIds.includes(h.id));

  const handleFinish = () => {
    completeOnboarding();
    router.replace('/(tabs)/today');
  };

  return (
    <Screen scroll>
      <View style={styles.header}>
        <View style={styles.doneIcon}>
          <AppText style={styles.doneEmoji}>✅</AppText>
        </View>
        <AppText variant="h1">{Copy.onboarding.confirmTitle}</AppText>
        <AppText variant="body">{Copy.onboarding.confirmSubtitle}</AppText>
      </View>

      <AppText variant="label" style={styles.sectionLabel}>
        Your habits
      </AppText>
      <Card style={styles.habitList}>
        {selectedHabits.length === 0 ? (
          <AppText variant="body" style={styles.emptyMsg}>
            No habits selected. Go back to pick some.
          </AppText>
        ) : (
          selectedHabits.map((habit, idx) => {
            const isLast = idx === selectedHabits.length - 1;
            return (
              <View
                key={habit.id}
                style={[styles.habitRow, !isLast && styles.habitBorder]}
              >
                <View style={styles.checkDot} />
                <AppText variant="bodyMedium" style={styles.habitTitle}>
                  {habit.title}
                </AppText>
                <TouchableOpacity
                  onPress={() => toggleHabit(habit.id)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="close-circle-outline" size={18} color={Colors.muted} />
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </Card>

      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.addLink}
      >
        <Ionicons name="add-circle-outline" size={18} color={Colors.primaryBlue} />
        <AppText variant="small" color="primaryBlue">
          Add or change habits
        </AppText>
      </TouchableOpacity>

      <View style={styles.footer}>
        <PrimaryButton title={Copy.onboarding.finishButton} onPress={handleFinish} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: Spacing.xl,
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  doneIcon: {
    marginBottom: Spacing.sm,
  },
  doneEmoji: {
    fontSize: 40,
  },
  sectionLabel: {
    marginBottom: Spacing.sm,
    color: Colors.muted,
  },
  habitList: {
    padding: 0,
    overflow: 'hidden',
  },
  emptyMsg: {
    padding: Spacing.base,
    color: Colors.muted,
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
  },
  habitBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  checkDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primaryBlue,
  },
  habitTitle: {
    flex: 1,
  },
  addLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  footer: {
    marginTop: Spacing.xxl,
    paddingBottom: Spacing.xxxl,
  },
});
