import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppText from '@/components/ui/AppText';
import Card from '@/components/ui/Card';
import { DEMO_HABITS } from '@/data/mockHabits';
import { Colors, Spacing, Radii } from '@/constants/theme';

export default function HabitDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const habit = DEMO_HABITS.find((h) => h.id === id) ?? DEMO_HABITS[0];

  // Demo streak data
  const currentStreak = 7;
  const bestStreak = 12;
  const weekDots = [true, true, false, true, true, true, false];

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.charcoal} />
        </TouchableOpacity>
        <AppText variant="h3">Habit Detail</AppText>
        <TouchableOpacity onPress={() => {}} style={styles.editBtn}>
          <AppText variant="small" color="primaryBlue">Edit</AppText>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.titleBlock}>
          <AppText variant="h1">{habit.title}</AppText>
          <AppText variant="body" style={styles.goal}>
            {habit.goalId.replace(/-/g, ' ')} · {habit.frequency}
          </AppText>
        </View>

        {/* Streak stats */}
        <View style={styles.statRow}>
          <Card style={styles.statCard}>
            <AppText variant="caption" color="muted">Current streak</AppText>
            <AppText variant="h2" color="primaryBlue">{currentStreak}d</AppText>
          </Card>
          <Card style={styles.statCard}>
            <AppText variant="caption" color="muted">Best streak</AppText>
            <AppText variant="h2">{bestStreak}d</AppText>
          </Card>
        </View>

        {/* This week */}
        <Card style={styles.weekCard}>
          <AppText variant="bodyMedium" style={styles.weekTitle}>This week</AppText>
          <View style={styles.weekDots}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
              <View key={idx} style={styles.dayCol}>
                <View style={[styles.dot, weekDots[idx] && styles.dotDone]} />
                <AppText variant="caption" color="muted">{day}</AppText>
              </View>
            ))}
          </View>
        </Card>

        {/* Actions */}
        <Card style={styles.actionsCard}>
          <TouchableOpacity style={styles.actionRow} onPress={() => {}}>
            <Ionicons name="pencil-outline" size={20} color={Colors.primaryBlue} />
            <AppText variant="bodyMedium">Edit habit</AppText>
          </TouchableOpacity>
          <View style={styles.actionDivider} />
          <TouchableOpacity style={styles.actionRow} onPress={() => {}}>
            <Ionicons name="pause-circle-outline" size={20} color={Colors.muted} />
            <AppText variant="bodyMedium" color="charcoalSoft">Pause habit</AppText>
          </TouchableOpacity>
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: { padding: Spacing.xs },
  editBtn: { padding: Spacing.xs },
  content: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xl,
  },
  titleBlock: {
    marginBottom: Spacing.xl,
    gap: Spacing.xs,
  },
  goal: {
    textTransform: 'capitalize',
  },
  statRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.base,
  },
  statCard: {
    flex: 1,
    gap: Spacing.xs,
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  weekCard: {
    marginBottom: Spacing.base,
    gap: Spacing.md,
  },
  weekTitle: { marginBottom: Spacing.xs },
  weekDots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCol: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.border,
  },
  dotDone: {
    backgroundColor: Colors.primaryBlue,
  },
  actionsCard: {
    padding: 0,
    overflow: 'hidden',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
  },
  actionDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: Spacing.base + 20 + Spacing.md,
  },
});
