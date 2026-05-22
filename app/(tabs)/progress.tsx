import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppText from '@/components/ui/AppText';
import Card from '@/components/ui/Card';
import ProgressCard, { ProgressBar } from '@/components/progress/ProgressCard';
import { DEMO_PROGRESS } from '@/data/mockProgress';
import { Colors, Spacing, Radii } from '@/constants/theme';
import { Copy } from '@/constants/copy';
import { daysSince } from '@/utils/dates';

export default function ProgressScreen() {
  const { weeklyData, byGoal, currentStreak, bestStreak, totalCompleted, weeklyCompletionRate, journeyStartDate } =
    DEMO_PROGRESS;

  const dayCount = daysSince(journeyStartDate);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <AppText variant="h1">{Copy.progress.header}</AppText>
          <AppText variant="body">{Copy.progress.subline}</AppText>
        </View>

        {/* Stat row */}
        <View style={styles.statRow}>
          <ProgressCard label={`${Copy.progress.journeyDays} ${dayCount}`} value="🗓️" subtitle="days in" accent />
          <ProgressCard label={Copy.progress.currentStreak} value={`${currentStreak}d`} />
          <ProgressCard label={Copy.progress.bestStreak} value={`${bestStreak}d`} />
        </View>

        {/* Weekly rate */}
        <Card style={styles.rateCard}>
          <View style={styles.rateRow}>
            <AppText variant="bodyMedium">{Copy.progress.weeklyRate}</AppText>
            <AppText variant="h3" color="primaryBlue">
              {Math.round(weeklyCompletionRate * 100)}%
            </AppText>
          </View>
          <ProgressBar value={weeklyCompletionRate * 100} total={100} />
        </Card>

        {/* Weekly chart */}
        <View style={styles.section}>
          <AppText variant="h3" style={styles.sectionTitle}>This week</AppText>
          <Card style={styles.chartCard}>
            <View style={styles.barRow}>
              {weeklyData.map((d) => {
                const pct = d.total > 0 ? d.completed / d.total : 0;
                return (
                  <View key={d.day} style={styles.barCol}>
                    <View style={styles.barTrack}>
                      <View
                        style={[
                          styles.barFill,
                          { height: `${pct * 100}%` },
                          pct === 0 && styles.barEmpty,
                        ]}
                      />
                    </View>
                    <AppText variant="caption" align="center" style={styles.barLabel}>
                      {d.day}
                    </AppText>
                    <AppText variant="caption" align="center" color="primaryBlue">
                      {d.completed}/{d.total}
                    </AppText>
                  </View>
                );
              })}
            </View>
          </Card>
        </View>

        {/* Total completed */}
        <Card style={styles.totalCard}>
          <AppText variant="body">{Copy.progress.completedTotal}</AppText>
          <AppText variant="hero" color="charcoal">
            {totalCompleted}
          </AppText>
          <AppText variant="small">habits completed since you started</AppText>
        </Card>

        {/* By goal */}
        <View style={styles.section}>
          <AppText variant="h3" style={styles.sectionTitle}>By goal</AppText>
          {byGoal.map((g) => (
            <Card key={g.goalLabel} style={styles.goalCard}>
              <View style={styles.goalRow}>
                <AppText variant="bodyMedium">{g.goalLabel}</AppText>
                <AppText variant="small" color="primaryBlue">
                  {Math.round(g.rate * 100)}%
                </AppText>
              </View>
              <ProgressBar value={g.completed} total={g.total} />
              <AppText variant="caption" color="muted">
                {g.completed}/{g.total} completed
              </AppText>
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xxxl,
  },
  header: {
    paddingTop: Spacing.xl,
    marginBottom: Spacing.lg,
    gap: Spacing.xs,
  },
  statRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.base,
  },
  rateCard: {
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  rateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.sm,
  },
  chartCard: {
    paddingVertical: Spacing.base,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
    gap: Spacing.xs,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
    gap: 2,
  },
  barTrack: {
    width: '60%',
    flex: 1,
    backgroundColor: Colors.border,
    borderRadius: Radii.sm,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barFill: {
    backgroundColor: Colors.primaryBlue,
    borderRadius: Radii.sm,
    width: '100%',
  },
  barEmpty: {
    backgroundColor: Colors.border,
  },
  barLabel: {
    color: Colors.muted,
  },
  totalCard: {
    marginBottom: Spacing.xl,
    gap: Spacing.xs,
  },
  goalCard: {
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  goalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
