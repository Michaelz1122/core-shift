import { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Screen from '@/components/ui/Screen';
import AppText from '@/components/ui/AppText';
import PrimaryButton from '@/components/ui/PrimaryButton';
import Card from '@/components/ui/Card';
import { useAppStore } from '@/store/useAppStore';
import { getSuggestionSections } from '@/utils/habitSuggestions';
import { Colors, Spacing } from '@/constants/theme';

export default function HabitSuggestions() {
  const {
    selectedGoalIds,
    selectedStruggleIds,
    selectedHabitIds,
    buildAvailableHabits,
    toggleHabit,
  } = useAppStore();

  // Build personalised habit list from goals + struggles on mount
  useEffect(() => {
    buildAvailableHabits();
  }, []);

  const sections = getSuggestionSections(selectedGoalIds, selectedStruggleIds);
  const canContinue = selectedHabitIds.length > 0;

  return (
    <Screen scroll>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.charcoal} />
        </TouchableOpacity>
        <View style={styles.stepRow}>
          <AppText variant="caption" color="primaryBlue">Step 3 of 3</AppText>
        </View>
        <AppText variant="h1" style={styles.title}>Build your first habits.</AppText>
        <AppText variant="body">
          Based on your goals and struggles, here's what CoreShift suggests. You can change these anytime.
        </AppText>
        <View style={styles.pills}>
          {[1, 2, 3].map((n) => (
            <View key={n} style={[styles.pill, styles.pillActive]} />
          ))}
        </View>
      </View>

      {sections.map((section) => (
        <View key={section.label} style={styles.section}>
          <AppText variant="label" style={styles.sectionLabel}>{section.label}</AppText>
          <Card style={styles.habitCard}>
            {section.habits.map((habit, idx) => {
              const selected = selectedHabitIds.includes(habit.id);
              const isLast = idx === section.habits.length - 1;
              return (
                <TouchableOpacity
                  key={habit.id}
                  style={[styles.habitRow, !isLast && styles.habitBorder]}
                  onPress={() => toggleHabit(habit.id)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.check, selected && styles.checkOn]}>
                    {selected && <Ionicons name="checkmark" size={12} color={Colors.white} />}
                  </View>
                  <AppText variant="bodyMedium" style={styles.habitTitle}>
                    {habit.title}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </Card>
        </View>
      ))}

      {sections.length === 0 && (
        <AppText variant="body" color="muted" align="center" style={styles.noSuggestions}>
          No suggestions yet — go back and select your goals.
        </AppText>
      )}

      <View style={styles.footer}>
        <AppText variant="small" align="center" color="muted">
          {selectedHabitIds.length} habit{selectedHabitIds.length !== 1 ? 's' : ''} selected
        </AppText>
        <PrimaryButton
          title="Continue"
          onPress={() => router.push('/onboarding/confirm')}
          disabled={!canContinue}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: Spacing.xl, marginBottom: Spacing.xl, gap: Spacing.sm },
  backBtn: { alignSelf: 'flex-start', padding: Spacing.xs, marginLeft: -Spacing.xs },
  stepRow: { marginBottom: Spacing.xs },
  title: { marginTop: Spacing.sm },
  pills: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  pill: { width: 24, height: 4, borderRadius: 2, backgroundColor: Colors.border },
  pillActive: { backgroundColor: Colors.primaryBlue },

  section: { marginBottom: Spacing.lg },
  sectionLabel: { marginBottom: Spacing.sm, color: Colors.muted },
  habitCard: { padding: 0, overflow: 'hidden' },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
  },
  habitBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  check: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOn: { backgroundColor: Colors.primaryBlue, borderColor: Colors.primaryBlue },
  habitTitle: { flex: 1 },

  noSuggestions: { marginTop: Spacing.xl },
  footer: { marginTop: Spacing.xl, paddingBottom: Spacing.xxxl, gap: Spacing.sm },
});
