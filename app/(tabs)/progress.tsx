import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppText from '@/components/ui/AppText';
import Card from '@/components/ui/Card';
import ProgressCard, { ProgressBar } from '@/components/progress/ProgressCard';
import { useAppStore } from '@/store/useAppStore';
import { Colors, Spacing } from '@/constants/theme';
import { Copy } from '@/constants/copy';
import { daysSince } from '@/utils/dates';

export default function ProgressScreen() {
  const {
    onboardingCompletedAt,
    totalHabitsCompleted,
    selectedHabitIds,
    availableHabits,
    completedHabitIdsToday,
  } = useAppStore();

  const dayCount = onboardingCompletedAt ? daysSince(onboardingCompletedAt) : 0;
  const totalHabits = selectedHabitIds.length;
  const completedToday = completedHabitIdsToday.length;
  const hasData = totalHabitsCompleted > 0 || completedToday > 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <AppText variant="h1">{Copy.progress.header}</AppText>
          <AppText variant="body">{Copy.progress.subline}</AppText>
        </View>

        {/* Stat row */}
        <View style={styles.statRow}>
          <ProgressCard
            label={`${Copy.progress.journeyDays} ${dayCount}`}
            value="🗓️"
            subtitle="days in"
            accent
          />
          <ProgressCard
            label={Copy.progress.completedTotal}
            value={String(totalHabitsCompleted)}
          />
          <ProgressCard
            label="Today"
            value={`${completedToday}/${totalHabits}`}
          />
        </View>

        {/* Today's progress */}
        {totalHabits > 0 && (
          <Card style={styles.rateCard}>
            <View style={styles.rateRow}>
              <AppText variant="bodyMedium">Today's completion</AppText>
              <AppText variant="h3" color="primaryBlue">
                {totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0}%
              </AppText>
            </View>
            <ProgressBar value={completedToday} total={totalHabits} />
          </Card>
        )}

        {/* Your habits list */}
        {availableHabits.filter((h) => selectedHabitIds.includes(h.id)).length > 0 && (
          <View style={styles.section}>
            <AppText variant="h3" style={styles.sectionTitle}>Your habits</AppText>
            <Card style={styles.habitList}>
              {availableHabits
                .filter((h) => selectedHabitIds.includes(h.id))
                .map((habit, idx, arr) => (
                  <View
                    key={habit.id}
                    style={[
                      styles.habitRow,
                      idx < arr.length - 1 && styles.habitBorder,
                    ]}
                  >
                    <View
                      style={[
                        styles.habitDot,
                        completedHabitIdsToday.includes(habit.id) && styles.habitDotDone,
                      ]}
                    />
                    <AppText variant="bodyMedium" style={styles.habitTitle}>
                      {habit.title}
                    </AppText>
                    {completedHabitIdsToday.includes(habit.id) && (
                      <AppText variant="caption" color="primaryBlue">✓</AppText>
                    )}
                  </View>
                ))}
            </Card>
          </View>
        )}

        {/* Empty / early state */}
        {!hasData && (
          <Card style={styles.emptyCard}>
            <AppText variant="bodyMedium" align="center">Your progress starts here.</AppText>
            <AppText variant="small" align="center" color="muted" style={styles.emptySubtitle}>
              {Copy.empty.noProgress}
            </AppText>
          </Card>
        )}

        {/* Total completed */}
        {totalHabitsCompleted > 0 && (
          <Card style={styles.totalCard}>
            <AppText variant="body">{Copy.progress.completedTotal}</AppText>
            <AppText variant="hero" color="charcoal">
              {totalHabitsCompleted}
            </AppText>
            <AppText variant="small">habits completed since you started</AppText>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: Spacing.base, paddingBottom: Spacing.xxxl },
  header: { paddingTop: Spacing.xl, marginBottom: Spacing.lg, gap: Spacing.xs },
  statRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.base },
  rateCard: { marginBottom: Spacing.xl, gap: Spacing.sm },
  rateRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

  section: { marginBottom: Spacing.xl },
  sectionTitle: { marginBottom: Spacing.sm },
  habitList: { padding: 0, overflow: 'hidden' },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
  },
  habitBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  habitDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  habitDotDone: { backgroundColor: Colors.primaryBlue },
  habitTitle: { flex: 1 },

  emptyCard: { paddingVertical: Spacing.xxl, gap: Spacing.sm },
  emptySubtitle: { marginTop: Spacing.xs },
  totalCard: { marginBottom: Spacing.xl, gap: Spacing.xs },
});
