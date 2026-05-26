import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Screen from '@/components/ui/Screen';
import AppText from '@/components/ui/AppText';
import PrimaryButton from '@/components/ui/PrimaryButton';
import GoalCard from '@/components/cards/GoalCard';
import { ALL_GOALS } from '@/data/mockGoals';
import { useAppStore } from '@/store/useAppStore';
import { Spacing, Colors, Radii } from '@/constants/theme';

export default function GoalSelection() {
  const { selectedGoalIds, toggleGoal } = useAppStore();
  const canContinue = selectedGoalIds.length >= 1;
  const atMax = selectedGoalIds.length >= 3;

  return (
    <Screen scroll>
      <View style={styles.header}>
        <View style={styles.stepRow}>
          <AppText variant="label" color="primaryBlue" style={styles.stepLabel}>
            STATION 01 // SELF-MASTERY PATHWAY
          </AppText>
        </View>
        <AppText variant="h1" style={styles.title}>What path of self-mastery are we carving?</AppText>
        <AppText variant="body" style={styles.subtitle}>
          Select 1 to 3 foundational dimensions of your life to reconstruct and track. ({selectedGoalIds.length}/3 selected)
        </AppText>
        
        {/* Step progress tracker */}
        <View style={styles.pills}>
          <View style={[styles.pill, styles.pillActive]} />
          <View style={styles.pill} />
          <View style={styles.pill} />
        </View>
      </View>

      <View style={styles.list}>
        {ALL_GOALS.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            selected={selectedGoalIds.includes(goal.id)}
            onPress={() => toggleGoal(goal.id)}
            disabled={atMax && !selectedGoalIds.includes(goal.id)}
          />
        ))}
      </View>

      <View style={styles.footer}>
        {atMax && (
          <AppText variant="caption" align="center" color="muted" style={styles.maxText}>
            Maximum of 3 foundational pathways selected
          </AppText>
        )}
        <PrimaryButton
          title="Proceed to Station 02"
          onPress={() => router.push('/onboarding/struggles')}
          disabled={!canContinue}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: Spacing.xl, marginBottom: Spacing.base, gap: Spacing.xs },
  stepRow: { marginBottom: Spacing.xs },
  stepLabel: { fontSize: 11, letterSpacing: 1, fontWeight: '700' },
  title: { fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { marginTop: Spacing.xs, color: Colors.charcoalSoft, lineHeight: 20 },
  pills: { flexDirection: 'row', gap: Spacing.xs, marginTop: Spacing.md },
  pill: { width: 36, height: 5, borderRadius: Radii.sm, backgroundColor: Colors.border },
  pillActive: { backgroundColor: Colors.primaryBlue },
  list: { marginVertical: Spacing.sm },
  footer: { marginTop: Spacing.xl, gap: Spacing.sm, paddingBottom: Spacing.xl },
  maxText: { fontWeight: '600', color: Colors.primaryBlue },
});
