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
import { useTranslation } from '@/i18n';

function getGreeting(name: string, isAR: boolean): string {
  const hour = new Date().getHours();
  let base: string;
  if (isAR) {
    base = hour < 12 ? 'صباح الخير' : hour < 17 ? 'مساء الخير' : 'مساء النور';
    return name ? `${base}، ${name}` : base;
  }
  base = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  return name ? `${base}, ${name}.` : `${base}.`;
}

export default function TodayScreen() {
  const { t, language, isRTL } = useTranslation();
  const {
    toggleActionCompletion,
    isActionCompleted,
    todayCheckIn,
    activeActionIds,
    actions,
    userName,
    xp,
    level,
    isDarkMode,
  } = useAppStore();

  const xpInCurrentLevel = xp % 100;
  const xpPercent = xpInCurrentLevel / 100;
  const xpToNextLevel = 100 - xpInCurrentLevel;

  const activeActions = actions.filter((a) => activeActionIds.includes(a.id));
  const completedCount = activeActions.filter((a) => isActionCompleted(a.id)).length;
  const total = activeActions.length;
  const hasCheckIn = todayCheckIn !== null;

  const themeBg = isDarkMode ? '#121214' : Colors.background;
  const cardTextColor = isDarkMode ? '#FFFFFF' : Colors.charcoal;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: themeBg }]} edges={['top']}>
      <ScrollView
        style={[styles.scroll, { backgroundColor: themeBg }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Gamified Header ─────────────────────────────────────────── */}
        <View style={styles.gamifiedHeader}>
          <View style={styles.headerTopRow}>
            <View style={styles.greetingCol}>
              <AppText
                variant="h2"
                style={[styles.greetText, isRTL && styles.textRight, { color: cardTextColor }]}
              >
                {getGreeting(userName, isRTL)}
              </AppText>
              <AppText
                variant="small"
                style={[styles.levelBadgeText, isRTL && styles.textRight]}
              >
                {language === 'ar' ? `المستوى ${level} · CoreShift` : `Level ${level} · CoreShift`}
              </AppText>
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
                {language === 'ar' ? 'نقاط الخبرة' : 'Self-Mastery XP'}
              </AppText>
              <AppText variant="caption" style={styles.xpLabel}>
                {xpInCurrentLevel}/100 XP
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

        {/* ── Daily Check-in ──────────────────────────────────────────── */}
        <TouchableOpacity
          style={styles.checkinCard}
          onPress={() => !hasCheckIn && router.push('/checkin')}
          activeOpacity={hasCheckIn ? 1 : 0.85}
        >
          {hasCheckIn ? (
            <View style={styles.checkinDone}>
              <Ionicons name="checkmark-circle" size={22} color={Colors.white} />
              <View style={styles.checkinDoneText}>
                <AppText variant="h3" style={styles.checkinDoneTitle}>
                  {t.todayCheckInDone}
                </AppText>
                <AppText variant="small" style={styles.checkinDoneSub}>
                  Mood · {todayCheckIn!.mood} · Energy {todayCheckIn!.energy}/5
                </AppText>
              </View>
            </View>
          ) : (
            <>
              <View style={styles.checkinTop}>
                <AppText variant="h3" style={styles.checkinTitle}>
                  {t.todayCheckInTitle}
                </AppText>
                <AppText variant="small" style={styles.checkinSub}>
                  {t.todayCheckInSub}
                </AppText>
              </View>
              <View style={styles.checkinBtn}>
                <AppText variant="small" style={styles.checkinBtnText}>
                  {t.todayCheckInButton}
                </AppText>
                <Ionicons name="arrow-forward" size={14} color={Colors.primaryBlue} />
              </View>
            </>
          )}
        </TouchableOpacity>

        {/* ── Progress Card ───────────────────────────────────────────── */}
        <Card style={styles.progressCard}>
          <View style={styles.progressTop}>
            <AppText variant="bodyMedium" style={isRTL ? styles.textRight : undefined}>
              {t.todayProgressTitle}
            </AppText>
            <AppText variant="bodyMedium" color="primaryBlue">
              {completedCount}/{total}
            </AppText>
          </View>
          <View style={styles.progressBar}>
            <ProgressBar value={completedCount} total={total} />
          </View>
          <AppText variant="small" style={isRTL ? styles.textRight : undefined}>
            {total === 0
              ? t.todayNoActions
              : completedCount === total
              ? t.todayAllDone
              : `${total - completedCount} ${t.todayActionsRemaining}`}
          </AppText>
        </Card>

        {/* ── Actions List ────────────────────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AppText variant="h3" style={isRTL ? styles.textRight : undefined}>
              {t.todayActionsTitle}
            </AppText>
          </View>

          {activeActions.length === 0 ? (
            <Card style={styles.emptyCard}>
              <AppText variant="body" align="center" color="muted">
                {t.todayNoActions}
              </AppText>
            </Card>
          ) : (
            <Card style={styles.actionCard}>
              {activeActions.map((action, idx) => (
                <View
                  key={action.id}
                  style={[idx < activeActions.length - 1 && styles.actionDivider]}
                >
                  <HabitToggle
                    title={action.title}
                    completed={isActionCompleted(action.id)}
                    onToggle={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      toggleActionCompletion(action.id);
                    }}
                    onPressDetails={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      router.push({
                        pathname: '/habit-detail',
                        params: { id: action.id },
                      });
                    }}
                  />
                </View>
              ))}
            </Card>
          )}
        </View>

        {/* ── Shift Now CTA ───────────────────────────────────────────── */}
        <TouchableOpacity
          style={[
            styles.shiftNowCard,
            {
              backgroundColor: isDarkMode ? 'rgba(45, 127, 249, 0.15)' : Colors.blueLight,
              borderColor: isDarkMode ? '#2C2C2E' : Colors.primaryBlue + '33',
            },
          ]}
          onPress={() => router.push('/(tabs)/rescue')}
          activeOpacity={0.85}
        >
          <View style={styles.shiftNowContent}>
            <AppText variant="bodyMedium" style={[styles.shiftNowTitle, isRTL && styles.textRight]}>
              {t.todayShiftNowTitle}
            </AppText>
            <AppText variant="small" style={[styles.shiftNowSub, isRTL && styles.textRight]}>
              {t.todayShiftNowSub}
            </AppText>
          </View>
          <Ionicons name="shield-checkmark-outline" size={22} color={Colors.primaryBlue} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: Spacing.base, paddingBottom: Spacing.xxxl },
  textRight: { textAlign: 'right', writingDirection: 'rtl' },

  gamifiedHeader: { paddingTop: Spacing.xl, marginBottom: Spacing.lg, gap: Spacing.md },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greetingCol: { flex: 1, paddingRight: Spacing.sm, gap: Spacing.xs },
  greetText: { letterSpacing: -0.3 },
  levelBadgeText: { color: Colors.charcoalSoft, fontWeight: '500' },

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
  levelCircleNumber: { color: Colors.primaryBlue, fontWeight: '700', fontSize: 18, lineHeight: 20 },
  levelCircleLabel: { color: Colors.muted, fontSize: 8, fontWeight: '700', marginTop: -2 },

  xpBarContainer: { gap: Spacing.xs },
  xpBarLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  xpLabel: { color: Colors.muted, fontWeight: '500' },
  xpTrack: { height: 8, backgroundColor: Colors.border, borderRadius: Radii.full, overflow: 'hidden' },
  xpFill: { height: '100%', borderRadius: Radii.full },

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
  checkinDoneSub: { color: 'rgba(255,255,255,0.75)' },

  progressCard: { marginBottom: Spacing.xl, gap: Spacing.sm },
  progressTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressBar: { marginVertical: Spacing.xs },

  section: { marginBottom: Spacing.xl },
  sectionHeader: { marginBottom: Spacing.sm },
  actionCard: { paddingVertical: Spacing.xs, paddingHorizontal: Spacing.base },
  actionDivider: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  emptyCard: { paddingVertical: Spacing.xxl },

  shiftNowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radii.lg,
    borderWidth: 1,
    padding: Spacing.base,
    gap: Spacing.md,
  },
  shiftNowContent: { flex: 1, gap: Spacing.xs },
  shiftNowTitle: { color: Colors.charcoal, fontWeight: '700' },
  shiftNowSub: { color: Colors.charcoalSoft },
});
