import { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Screen from '@/components/ui/Screen';
import AppText from '@/components/ui/AppText';
import PrimaryButton from '@/components/ui/PrimaryButton';
import Card from '@/components/ui/Card';
import { SUGGESTED_HABITS } from '@/data/mockHabits';
import { ALL_GOALS } from '@/data/mockGoals';
import { useAppStore } from '@/store/useAppStore';
import { Habit } from '@/types';
import { Colors, Spacing } from '@/constants/theme';

export default function HabitSuggestions() {
  const { selectedGoalIds, selectedHabitIds, toggleHabit } = useAppStore();

  const suggestedHabits: Habit[] = selectedGoalIds.flatMap(
    (goalId) => SUGGESTED_HABITS[goalId] ?? []
  );

  const goalLabel = (goalId: string) =>
    ALL_GOALS.find((g) => g.id === goalId)?.label ?? goalId;

  const canContinue = selectedHabitIds.length > 0;

  return (
    <Screen scroll>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.charcoal} />
        </TouchableOpacity>
        <AppText variant="h1" style={styles.title}>
          Build your first habits.
        </AppText>
        <AppText variant="body">
          Select the habits you want to track. You can change these anytime.
        </AppText>
      </View>

      {selectedGoalIds.map((goalId) => {
        const habits = SUGGESTED_HABITS[goalId] ?? [];
        if (!habits.length) return null;
        return (
          <View key={goalId} style={styles.section}>
            <AppText variant="label" style={styles.sectionLabel}>
              {goalLabel(goalId)}
            </AppText>
            <Card>
              {habits.map((habit, idx) => {
                const selected = selectedHabitIds.includes(habit.id);
                const isLast = idx === habits.length - 1;
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
        );
      })}

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
  header: {
    paddingTop: Spacing.lg,
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  backBtn: {
    alignSelf: 'flex-start',
    padding: Spacing.xs,
    marginLeft: -Spacing.xs,
  },
  title: {
    marginTop: Spacing.sm,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    marginBottom: Spacing.sm,
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
  check: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOn: {
    backgroundColor: Colors.primaryBlue,
    borderColor: Colors.primaryBlue,
  },
  habitTitle: {
    flex: 1,
  },
  footer: {
    marginTop: Spacing.xl,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.sm,
  },
});
