import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AppText from '@/components/ui/AppText';
import Card from '@/components/ui/Card';
import ProgressCard, { ProgressBar } from '@/components/progress/ProgressCard';
import { useAppStore } from '@/store/useAppStore';
import { Colors, Spacing, Radii, Gradients, Shadows } from '@/constants/theme';
import { useTranslation } from '@/i18n';
import { daysSince } from '@/utils/dates';

interface Badge {
  id: string;
  title: string;
  desc: string;
  icon: string;
  unlocked: boolean;
  colors: readonly [string, string];
}

const getHeatmapData = (streakHistory: Record<string, boolean>) => {
  const today = new Date();
  const data = [];
  for (let i = 69; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const completed = streakHistory[dateStr] === true;
    data.push({ date: d, dateStr, completed });
  }
  return data;
};

export default function ProgressScreen() {
  const { t, language, isRTL } = useTranslation();
  const {
    onboardingCompletedAt,
    totalActionsCompleted,
    activeActionIds,
    actions,
    completedActionIdsToday,
    xp,
    level,
    streakHistory,
    isDarkMode,
  } = useAppStore();

  const dayCount = onboardingCompletedAt ? daysSince(onboardingCompletedAt) : 0;
  const totalActions = activeActionIds.length;
  const completedToday = completedActionIdsToday.length;
  const hasData = totalActionsCompleted > 0 || completedToday > 0;

  const heatmapData = getHeatmapData(streakHistory);
  const weeks = [];
  for (let i = 0; i < 10; i++) {
    weeks.push(heatmapData.slice(i * 7, (i + 1) * 7));
  }

  const badges: Badge[] = [
    {
      id: 'first_action',
      title: language === 'ar' ? 'الخطوة الأولى' : 'First Steps',
      desc: language === 'ar' ? 'أكملت أول إجراء لك!' : 'Completed your very first action!',
      icon: 'footsteps-sharp',
      unlocked: totalActionsCompleted > 0,
      colors: Gradients.primary,
    },
    {
      id: 'level_3',
      title: language === 'ar' ? 'صانع التحول' : 'Mind Shifter',
      desc: language === 'ar' ? 'وصلت للمستوى الثالث.' : 'Achieved Level 3.',
      icon: 'trophy-sharp',
      unlocked: level >= 3,
      colors: Gradients.gold,
    },
    {
      id: 'high_xp',
      title: language === 'ar' ? 'استاذ الزن' : 'Zen Master',
      desc: language === 'ar' ? 'جمعت ٢٠٠+ XP.' : 'Accumulated 200+ XP.',
      icon: 'leaf-sharp',
      unlocked: xp >= 200,
      colors: Gradients.purple,
    },
    {
      id: 'streak_3',
      title: language === 'ar' ? 'راكب اللهب' : 'Flame Rider',
      desc: language === 'ar' ? 'ابتدأت رحلة ٣ أيام.' : 'Started a solid 3-day journey.',
      icon: 'flame-sharp',
      unlocked: dayCount >= 3,
      colors: Gradients.danger,
    },
  ];

  const themeBg = isDarkMode ? '#121214' : Colors.background;
  const activeList = actions.filter((a) => activeActionIds.includes(a.id));

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: themeBg }]} edges={['top']}>
      <ScrollView
        style={{ backgroundColor: themeBg }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <AppText variant="h1" style={isRTL ? styles.textRight : undefined}>
            {language === 'ar' ? 'رحلتك حتى الآن' : 'Your journey so far'}
          </AppText>
          <AppText variant="body" style={isRTL ? styles.textRight : undefined}>
            {language === 'ar' ? 'التقدم أهم من الكمال.' : 'Progress over perfection.'}
          </AppText>
        </View>

        {/* Stat Grid */}
        <View style={styles.statRow}>
          <ProgressCard
            label={language === 'ar' ? 'يوم' : 'Day'}
            value={dayCount > 0 ? `${dayCount}d` : '1d'}
            subtitle={language === 'ar' ? 'في CoreShift' : 'in CoreShift'}
            accent
          />
          <ProgressCard
            label="Total XP"
            value={String(xp)}
            subtitle={`Level ${level}`}
          />
          <ProgressCard
            label={language === 'ar' ? 'مكتمل' : 'Completed'}
            value={String(totalActionsCompleted)}
            subtitle={language === 'ar' ? 'إجراءات' : 'actions total'}
          />
        </View>

        {/* Today's progress */}
        {totalActions > 0 && (
          <Card style={styles.rateCard}>
            <View style={styles.rateRow}>
              <AppText variant="bodyMedium" style={isRTL ? styles.textRight : undefined}>
                {language === 'ar' ? 'إنجاز اليوم' : "Today's completion"}
              </AppText>
              <AppText variant="h3" color="primaryBlue">
                {totalActions > 0 ? Math.round((completedToday / totalActions) * 100) : 0}%
              </AppText>
            </View>
            <ProgressBar value={completedToday} total={totalActions} />
          </Card>
        )}

        {/* Consistency Heatmap */}
        <View style={styles.section}>
          <AppText variant="h3" style={[styles.sectionTitle, isRTL && styles.textRight]}>
            {language === 'ar' ? 'خريطة الثبات' : 'Consistency Heatmap'}
          </AppText>
          <Card style={styles.heatmapCard}>
            <View style={styles.heatmapGrid}>
              {weeks.map((week, weekIdx) => (
                <View key={weekIdx} style={styles.heatmapColumn}>
                  {week.map((day, dayIdx) => (
                    <View
                      key={dayIdx}
                      style={[
                        styles.heatmapSquare,
                        day.completed ? styles.squareDone : styles.squareEmpty,
                      ]}
                    />
                  ))}
                </View>
              ))}
            </View>
            <View style={styles.heatmapLegend}>
              <AppText variant="caption" color="muted">
                {language === 'ar' ? 'أقل' : 'Less'}
              </AppText>
              <View style={[styles.heatmapSquare, styles.squareEmpty, { width: 10, height: 10 }]} />
              <View style={[styles.heatmapSquare, styles.squareDone, { width: 10, height: 10 }]} />
              <AppText variant="caption" color="muted">
                {language === 'ar' ? 'أكثر' : 'More'}
              </AppText>
            </View>
          </Card>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <AppText variant="h3" style={[styles.sectionTitle, isRTL && styles.textRight]}>
            {language === 'ar' ? 'الإنجازات' : 'Achievements'}
          </AppText>
          <View style={styles.badgesGrid}>
            {badges.map((badge) => (
              <Card
                key={badge.id}
                style={[styles.badgeCard, !badge.unlocked && styles.badgeCardLocked]}
              >
                {badge.unlocked ? (
                  <LinearGradient
                    colors={badge.colors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.badgeIconBg}
                  >
                    <Ionicons name={badge.icon as any} size={22} color={Colors.white} />
                  </LinearGradient>
                ) : (
                  <View style={[styles.badgeIconBg, styles.badgeIconBgLocked]}>
                    <Ionicons name="lock-closed" size={20} color={Colors.muted} />
                  </View>
                )}
                <View style={styles.badgeTextWrapper}>
                  <AppText
                    variant="bodyMedium"
                    style={[styles.badgeTitle, !badge.unlocked && styles.badgeTitleLocked]}
                  >
                    {badge.title}
                  </AppText>
                  <AppText variant="caption" style={styles.badgeDesc} align="center">
                    {badge.desc}
                  </AppText>
                </View>
              </Card>
            ))}
          </View>
        </View>

        {/* Active actions list */}
        {activeList.length > 0 && (
          <View style={styles.section}>
            <AppText variant="h3" style={[styles.sectionTitle, isRTL && styles.textRight]}>
              {language === 'ar' ? 'إجراءاتك النشطة' : 'Your active actions'}
            </AppText>
            <Card style={styles.actionList}>
              {activeList.map((action, idx, arr) => (
                <View
                  key={action.id}
                  style={[
                    styles.actionRow,
                    idx < arr.length - 1 && styles.actionBorder,
                  ]}
                >
                  <View
                    style={[
                      styles.actionDot,
                      completedActionIdsToday.includes(action.id) && styles.actionDotDone,
                    ]}
                  />
                  <AppText variant="bodyMedium" style={styles.actionTitle}>
                    {action.emoji} {action.title}
                  </AppText>
                  {completedActionIdsToday.includes(action.id) && (
                    <Ionicons name="checkmark-circle" size={18} color={Colors.primaryBlue} />
                  )}
                </View>
              ))}
            </Card>
          </View>
        )}

        {/* Empty state */}
        {!hasData && (
          <Card style={styles.emptyCard}>
            <AppText variant="bodyMedium" align="center">
              {language === 'ar' ? 'تقدمك يبدأ هنا.' : 'Your progress starts here.'}
            </AppText>
            <AppText variant="small" align="center" color="muted" style={styles.emptySubtitle}>
              {language === 'ar'
                ? 'أكمل إجراءاتك اليومية عشان تشوف تقدمك.'
                : 'Complete your daily actions to see your progress.'}
            </AppText>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: Spacing.base, paddingBottom: Spacing.xxxl },
  header: { paddingTop: Spacing.xl, marginBottom: Spacing.lg, gap: Spacing.xs },
  textRight: { textAlign: 'right', writingDirection: 'rtl' },
  statRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.base },
  rateCard: { marginBottom: Spacing.xl, gap: Spacing.sm },
  rateRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  section: { marginBottom: Spacing.xl },
  sectionTitle: { marginBottom: Spacing.sm, fontWeight: '700' },

  heatmapCard: { padding: Spacing.md, alignItems: 'center', gap: Spacing.md, ...Shadows.sm },
  heatmapGrid: { flexDirection: 'row', gap: 5 },
  heatmapColumn: { flexDirection: 'column', gap: 5 },
  heatmapSquare: { width: 14, height: 14, borderRadius: 3 },
  squareEmpty: { backgroundColor: '#E5E5EA' },
  squareDone: { backgroundColor: Colors.primaryBlue },
  heatmapLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-end',
  },

  badgesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  badgeCard: { flex: 1, minWidth: '46%', padding: Spacing.md, alignItems: 'center', gap: Spacing.xs, ...Shadows.sm },
  badgeCardLocked: {
    opacity: 0.5,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  badgeIconBg: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    ...Shadows.sm,
  },
  badgeIconBgLocked: { backgroundColor: '#E5E5EA' },
  badgeTextWrapper: { alignItems: 'center', gap: 2 },
  badgeTitle: { fontWeight: '700', color: Colors.charcoal },
  badgeTitleLocked: { color: Colors.muted },
  badgeDesc: { color: Colors.muted, fontSize: 10, lineHeight: 13 },

  actionList: { padding: 0, overflow: 'hidden' },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
  },
  actionBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  actionDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.border },
  actionDotDone: { backgroundColor: Colors.primaryBlue },
  actionTitle: { flex: 1 },

  emptyCard: { paddingVertical: Spacing.xxl, gap: Spacing.sm },
  emptySubtitle: { marginTop: Spacing.xs },
});
