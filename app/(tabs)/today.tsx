import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import AppText from '@/components/ui/AppText';
import Card from '@/components/ui/Card';
import HabitToggle from '@/components/habits/HabitToggle';
import { ProgressBar } from '@/components/progress/ProgressCard';
import { useAppStore } from '@/store/useAppStore';
import { Colors, Spacing, Radii, Gradients, Shadows } from '@/constants/theme';
import { Copy } from '@/constants/copy';

function getPersonalisedGreeting(name: string): string {
  const hour = new Date().getHours();
  const base = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  return name ? `${base}, ${name}.` : `${base}.`;
}

export default function TodayScreen() {
  const {
    toggleHabitCompletion,
    isHabitCompleted,
    todayCheckIn,
    selectedHabitIds,
    availableHabits,
    userName,
    xp,
    level,
    isDarkMode,
  } = useAppStore();

  const xpInCurrentLevel = xp % 100;
  const xpPercent = xpInCurrentLevel / 100;
  const xpToNextLevel = 100 - xpInCurrentLevel;

  // Only show habits the user selected during onboarding
  const habits = availableHabits.filter((h) => selectedHabitIds.includes(h.id));
  const completedCount = habits.filter((h) => isHabitCompleted(h.id)).length;
  const total = habits.length;
  const hasCheckIn = todayCheckIn !== null;

  const themeBg = isDarkMode ? '#121214' : Colors.background;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: themeBg }]} edges={['top']}>
      <ScrollView
        style={[styles.scroll, { backgroundColor: themeBg }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Gamified Level & Greeting Header */}
        <View style={styles.gamifiedHeader}>
          <View style={styles.headerTopRow}>
            <View style={styles.greetingCol}>
              <AppText variant="h2" style={styles.greetText}>
                {getPersonalisedGreeting(userName)}
              </AppText>
              <View style={styles.badgeRow}>
                <AppText variant="small" style={styles.levelBadgeText}>
                  Level {level} · Mind Shifter
                </AppText>
              </View>
            </View>

            {/* Level Badge Circle */}
            <LinearGradient
              colors={Gradients.xp}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.levelCircleGradient}
            >
              <View style={styles.levelCircleInner}>
                <AppText variant="h3" style={styles.levelCircleNumber}>
                  {level}
                </AppText>
                <AppText variant="caption" style={styles.levelCircleLabel}>
                  LVL
                </AppText>
              </View>
            </LinearGradient>
          </View>

          {/* XP Progress Bar */}
          <View style={styles.xpBarContainer}>
            <View style={styles.xpBarLabels}>
              <AppText variant="caption" style={styles.xpLabel}>
                Self-Mastery XP
              </AppText>
              <AppText variant="caption" style={styles.xpLabel}>
                {xpInCurrentLevel}/100 XP ({xpToNextLevel} to LVL {level + 1})
              </AppText>
            </View>
            <View style={styles.xpTrack}>
              <LinearGradient
                colors={Gradients.xp}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.xpFill, { width: `${xpPercent * 100}%` }]}
              />
            </View>
          </View>
        </View>

        {/* Daily Check-in Card */}
        <TouchableOpacity
          style={styles.checkinCard}
          onPress={() => !hasCheckIn && router.push('/checkin')}
          activeOpacity={hasCheckIn ? 1 : 0.85}
        >
          {hasCheckIn ? (
            <View style={styles.checkinDone}>
              <Ionicons name="checkmark-circle" size={22} color={Colors.primaryBlue} />
              <View style={styles.checkinDoneText}>
                <AppText variant="h3" style={styles.checkinDoneTitle}>
                  {Copy.today.checkInDone}
                </AppText>
                <AppText variant="small">
                  Mood · {todayCheckIn!.mood} · Energy {todayCheckIn!.energy}/5
                </AppText>
              </View>
            </View>
          ) : (
            <>
              <View style={styles.checkinTop}>
                <AppText variant="h3" style={styles.checkinTitle}>
                  {Copy.today.checkInTitle}
                </AppText>
                <AppText variant="small" style={styles.checkinSub}>
                  {Copy.today.checkInSub}
                </AppText>
              </View>
              <View style={styles.checkinBtn}>
                <AppText variant="small" style={styles.checkinBtnText}>
                  {Copy.today.checkInButton}
                </AppText>
                <Ionicons name="arrow-forward" size={14} color={Colors.primaryBlue} />
              </View>
            </>
          )}
        </TouchableOpacity>

        {/* Progress Card */}
        <Card style={styles.progressCard}>
          <View style={styles.progressTop}>
            <AppText variant="bodyMedium">{Copy.today.progressTitle}</AppText>
            <AppText variant="bodyMedium" color="primaryBlue">
              {completedCount}/{total}
            </AppText>
          </View>
          <View style={styles.progressBar}>
            <ProgressBar value={completedCount} total={total} />
          </View>
          <AppText variant="small">
            {total === 0
              ? 'Your habits will appear here after onboarding.'
              : completedCount === total
              ? 'All done for today! 🎉'
              : completedCount === 0
              ? 'Start your first habit for today.'
              : `${total - completedCount} habit${total - completedCount !== 1 ? 's' : ''} remaining.`}
          </AppText>
        </Card>

        {/* Habits List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AppText variant="h3">{Copy.today.habitsTitle}</AppText>
          </View>

          {habits.length === 0 ? (
            <Card style={styles.emptyCard}>
              <AppText variant="body" align="center" color="muted">
                No habits yet. Complete onboarding to add your first habits.
              </AppText>
            </Card>
          ) : (
            <Card style={styles.habitCard}>
              {habits.map((habit, idx) => (
                <View
                  key={habit.id}
                  style={[idx < habits.length - 1 && styles.habitDivider]}
                >
                  <HabitToggle
                    title={habit.title}
                    completed={isHabitCompleted(habit.id)}
                    onToggle={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      toggleHabitCompletion(habit.id);
                    }}
                    onPressDetails={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      router.push({
                        pathname: '/habit-detail',
                        params: { id: habit.id },
                      });
                    }}
                  />
                </View>
              ))}
            </Card>
          )}
        </View>

        {/* Rescue Mode Card */}
        <TouchableOpacity
          style={[
            styles.rescueCard,
            {
              backgroundColor: isDarkMode ? 'rgba(45, 127, 249, 0.15)' : Colors.blueLight,
              borderColor: isDarkMode ? '#2C2C2E' : Colors.primaryBlue + '33',
            }
          ]}
          onPress={() => router.push('/(tabs)/rescue')}
          activeOpacity={0.85}
        >
          <View style={styles.rescueContent}>
            <AppText variant="bodyMedium" style={styles.rescueTitle}>
              {Copy.today.rescueTitle}
            </AppText>
            <AppText variant="small" style={styles.rescueSub}>
              {Copy.today.rescueSub}
            </AppText>
          </View>
          <View style={styles.rescueArrow}>
            <Ionicons name="shield-checkmark-outline" size={20} color={Colors.primaryBlue} />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { paddingHorizontal: Spacing.base, paddingBottom: Spacing.xxxl },

  gamifiedHeader: {
    paddingTop: Spacing.xl,
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingCol: {
    flex: 1,
    paddingRight: Spacing.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  levelBadgeText: {
    color: Colors.charcoalSoft,
    fontWeight: '500',
  },
  levelCircleGradient: {
    width: 54,
    height: 54,
    borderRadius: 27,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  levelCircleInner: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelCircleNumber: {
    color: Colors.primaryBlue,
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 20,
  },
  levelCircleLabel: {
    color: Colors.muted,
    fontSize: 8,
    fontWeight: '700',
    marginTop: -2,
  },
  xpBarContainer: {
    gap: Spacing.xs,
  },
  xpBarLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  xpLabel: {
    color: Colors.muted,
    fontWeight: '500',
  },
  xpTrack: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: Radii.full,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    borderRadius: Radii.full,
  },
  greetText: { letterSpacing: -0.3 },

  checkinCard: {
    backgroundColor: Colors.primaryBlue,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.base,
  },
  checkinTop: { gap: Spacing.xs, marginBottom: Spacing.base },
  checkinTitle: { color: Colors.white },
  checkinSub: { color: 'rgba(255,255,255,0.75)' },
  checkinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.white,
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.full,
  },
  checkinBtnText: { color: Colors.primaryBlue, fontWeight: '600' },
  checkinDone: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  checkinDoneText: { gap: 2 },
  checkinDoneTitle: { color: Colors.white },

  progressCard: { marginBottom: Spacing.xl, gap: Spacing.sm },
  progressTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressBar: { marginVertical: Spacing.xs },

  section: { marginBottom: Spacing.xl },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  habitCard: { paddingVertical: Spacing.xs, paddingHorizontal: Spacing.base },
  habitDivider: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  emptyCard: { paddingVertical: Spacing.xxl },

  rescueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.blueLight,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.primaryBlue + '33',
    padding: Spacing.base,
    gap: Spacing.md,
  },
  rescueContent: { flex: 1, gap: Spacing.xs },
  rescueTitle: { color: Colors.charcoal },
  rescueSub: { color: Colors.charcoalSoft },
  rescueArrow: {},
});
