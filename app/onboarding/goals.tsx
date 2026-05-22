import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Screen from '@/components/ui/Screen';
import AppText from '@/components/ui/AppText';
import PrimaryButton from '@/components/ui/PrimaryButton';
import GoalCard from '@/components/cards/GoalCard';
import { ALL_GOALS } from '@/data/mockGoals';
import { useAppStore } from '@/store/useAppStore';
import { Spacing, Colors } from '@/constants/theme';
import { Copy } from '@/constants/copy';

export default function GoalSelection() {
  const { selectedGoalIds, toggleGoal } = useAppStore();
  const canContinue = selectedGoalIds.length >= 1;
  const atMax = selectedGoalIds.length >= 3;

  return (
    <Screen scroll>
      <View style={styles.header}>
        <View style={styles.stepRow}>
          <AppText variant="caption" color="primaryBlue">Step 1 of 3</AppText>
        </View>
        <AppText variant="h1">{Copy.onboarding.goalTitle}</AppText>
        <AppText variant="body" style={styles.subtitle}>{Copy.onboarding.goalSubtitle}</AppText>
        <View style={styles.pills}>
          {[1, 2, 3].map((n) => (
            <View
              key={n}
              style={[styles.pill, selectedGoalIds.length >= n ? styles.pillActive : null]}
            />
          ))}
        </View>
      </View>

      {ALL_GOALS.map((goal) => (
        <GoalCard
          key={goal.id}
          goal={goal}
          selected={selectedGoalIds.includes(goal.id)}
          onPress={() => toggleGoal(goal.id)}
          disabled={atMax && !selectedGoalIds.includes(goal.id)}
        />
      ))}

      <View style={styles.footer}>
        {atMax && (
          <AppText variant="small" align="center" color="muted">Maximum 3 goals selected</AppText>
        )}
        <PrimaryButton
          title="Continue"
          onPress={() => router.push('/onboarding/struggles')}
          disabled={!canContinue}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: Spacing.xl, marginBottom: Spacing.lg, gap: Spacing.sm },
  stepRow: { marginBottom: Spacing.xs },
  subtitle: { marginTop: Spacing.xs },
  pills: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  pill: { width: 24, height: 4, borderRadius: 2, backgroundColor: Colors.border },
  pillActive: { backgroundColor: Colors.primaryBlue },
  footer: { marginTop: Spacing.xl, gap: Spacing.sm, paddingBottom: Spacing.xl },
});
