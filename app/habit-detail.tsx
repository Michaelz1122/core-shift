import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import AppText from '@/components/ui/AppText';
import Card from '@/components/ui/Card';
import { useAppStore } from '@/store/useAppStore';
import { Colors, Spacing, Radii, Gradients, Shadows } from '@/constants/theme';
import { useTranslation } from '@/i18n';
import { ALL_CHALLENGES } from '@/data/challenges';

export default function HabitDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, language, isRTL } = useTranslation();
  const {
    actions,
    completedActionIdsToday,
    toggleActionCompletion,
    toggleAction,
    xp,
    level,
    isDarkMode,
  } = useAppStore();

  // Find the action in the store
  const action = actions.find((a) => a.id === id);

  if (!action) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.charcoal} />
          </TouchableOpacity>
          <AppText variant="h3">{isRTL ? 'الإجراء مش موجود' : 'Action Missing'}</AppText>
          <View style={styles.backBtn} />
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="warning-outline" size={48} color={Colors.muted} />
          <AppText variant="body" color="muted">
            {isRTL
              ? 'الإجراء ده مش موجود في خطتك النشطة.'
              : 'This action could not be found in your active plan.'}
          </AppText>
          <TouchableOpacity style={styles.goHomeBtn} onPress={() => router.replace('/(tabs)/today')}>
            <AppText variant="bodyMedium" color="white">
              {isRTL ? 'ارجع للرئيسية' : 'Return to Dashboard'}
            </AppText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isCompletedToday = completedActionIdsToday.includes(action.id);

  // Find the challenge label for this action
  const challenge = ALL_CHALLENGES.find((c) => c.id === action.challengeId);
  const challengeLabel = challenge ? challenge.label[language] : action.challengeId.replace(/-/g, ' ');

  const handleToggleCompletion = () => {
    Haptics.notificationAsync(
      isCompletedToday
        ? Haptics.NotificationFeedbackType.Warning
        : Haptics.NotificationFeedbackType.Success
    );
    toggleActionCompletion(action.id);
  };

  const handleArchiveAction = () => {
    Alert.alert(
      isRTL ? 'إزالة الإجراء' : 'Remove Action',
      isRTL
        ? `متأكد إنك عايز تشيل "${action.title}" من خطتك النشطة؟`
        : `Are you sure you want to remove "${action.title}" from your active plan?`,
      [
        { text: isRTL ? 'إلغاء' : 'Cancel', style: 'cancel' },
        {
          text: isRTL ? 'إزالة' : 'Remove',
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            toggleAction(action.id);
            router.replace('/(tabs)/today');
          },
        },
      ]
    );
  };

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const daysAr = ['الإث', 'الث', 'الأر', 'الخم', 'الجم', 'السب', 'الأح'];
  const dayLabels = isRTL ? daysAr : days;
  const todayIndex = (new Date().getDay() + 6) % 7;

  const themeBg = isDarkMode ? '#121214' : Colors.background;
  const cardBg = isDarkMode ? '#1C1C1E' : Colors.white;
  const borderBg = isDarkMode ? '#2C2C2E' : Colors.border;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: themeBg }]} edges={['top', 'bottom']}>
      {/* Header Bar */}
      <View style={[styles.headerBar, { borderBottomColor: borderBg }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={isDarkMode ? '#FFFFFF' : Colors.charcoal} />
        </TouchableOpacity>
        <AppText variant="h3" style={styles.headerTitle}>
          {isRTL ? 'تفاصيل الإجراء' : 'Action Details'}
        </AppText>
        <TouchableOpacity onPress={handleArchiveAction} style={styles.archiveTopBtn}>
          <Ionicons name="archive-outline" size={20} color={Colors.red} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ backgroundColor: themeBg }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title and Category */}
        <View style={styles.titleBlock}>
          <View style={styles.tagRow}>
            <View style={[styles.challengeTag, { backgroundColor: isDarkMode ? 'rgba(45, 127, 249, 0.15)' : Colors.blueLight }]}>
              <AppText variant="caption" style={styles.challengeTagText}>
                {challengeLabel.toUpperCase()}
              </AppText>
            </View>
            <View style={[styles.freqTag, { backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)' }]}>
              <AppText variant="caption" style={styles.freqTagText}>
                {(isRTL
                  ? action.frequency === 'daily' ? 'يومي' : 'أسبوعي'
                  : action.frequency.toUpperCase()
                )}
              </AppText>
            </View>
          </View>
          <AppText variant="hero" style={[styles.actionTitle, isRTL && styles.textRight]}>
            {action.title}
          </AppText>
        </View>

        {/* Completion Interactive Card */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.interactiveCard}
          onPress={handleToggleCompletion}
        >
          <LinearGradient
            colors={isCompletedToday ? Gradients.success : (isDarkMode ? ['#1C1C1E', '#2C2C2E'] : ['#F2F4F7', '#E4E7EC'])}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.interactiveGradient}
          >
            <View style={styles.interactiveRow}>
              <View style={[styles.statusIconBox, isCompletedToday && styles.statusIconBoxActive]}>
                <Ionicons
                  name={isCompletedToday ? 'checkmark-circle' : 'ellipse-outline'}
                  size={32}
                  color={isCompletedToday ? Colors.white : (isDarkMode ? '#8E8E93' : Colors.charcoalSoft)}
                />
              </View>
              <View style={styles.interactiveText}>
                <AppText
                  variant="bodyMedium"
                  style={[styles.interactiveTitle, isCompletedToday && styles.whiteText, isRTL && styles.textRight]}
                >
                  {isCompletedToday
                    ? (isRTL ? 'اتعمل النهارده ✓' : 'Completed Today')
                    : (isRTL ? 'اضغط لتسجيل الإنجاز' : 'Tap to mark as done')}
                </AppText>
                <AppText
                  variant="caption"
                  style={[styles.interactiveDesc, isCompletedToday && styles.whiteDescText, isRTL && styles.textRight]}
                >
                  {isCompletedToday
                    ? (isRTL ? '.تم اضافة الـ XP. اضغط للتراجع لو عايز' : 'XP awarded. Tap to revert if desired.')
                    : (isRTL ? '.اضغط هنا عشان تاخد +١٠ XP' : 'Tap to claim +10 XP.')}
                </AppText>
              </View>
              <Ionicons
                name={isCompletedToday ? 'sparkles' : (isRTL ? 'arrow-back' : 'arrow-forward')}
                size={20}
                color={isCompletedToday ? Colors.white : Colors.muted}
              />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Stats */}
        <View style={styles.statRow}>
          <Card style={styles.statCard}>
            <AppText variant="caption" color="muted">{isRTL ? 'مكافأة' : 'Reward'}</AppText>
            <AppText variant="h2" color="primaryBlue">+10 XP</AppText>
          </Card>
          <Card style={styles.statCard}>
            <AppText variant="caption" color="muted">{isRTL ? 'مستواك' : 'Your Level'}</AppText>
            <AppText variant="h2">LV {level}</AppText>
          </Card>
        </View>

        {/* Weekly Tracker */}
        <Card style={styles.weekCard}>
          <AppText variant="bodyMedium" style={[styles.weekTitle, isRTL && styles.textRight]}>
            {isRTL ? 'متابعة الأسبوع' : 'This Week'}
          </AppText>
          <View style={styles.weekDots}>
            {dayLabels.map((day, idx) => {
              const isToday = idx === todayIndex;
              const isDone = (isToday && isCompletedToday) || (!isToday && idx < todayIndex && idx % 3 !== 0);
              return (
                <View key={day} style={styles.dayCol}>
                  <View
                    style={[
                      styles.dot,
                      { backgroundColor: isDone ? Colors.success : borderBg },
                      isToday && styles.todayDotBorder,
                    ]}
                  >
                    {isDone && <Ionicons name="checkmark" size={14} color={Colors.white} />}
                  </View>
                  <AppText
                    variant="caption"
                    style={[styles.dayLabel, isToday && styles.todayLabelActive]}
                  >
                    {day}
                  </AppText>
                </View>
              );
            })}
          </View>
        </Card>

        {/* Management */}
        <AppText variant="label" color="primaryBlue" style={styles.sectionLabel}>
          {isRTL ? 'إدارة الإجراء' : 'MANAGE ACTION'}
        </AppText>
        <Card style={styles.actionsCard}>
          <TouchableOpacity style={[styles.actionRow, { backgroundColor: cardBg }]} onPress={handleArchiveAction}>
            <Ionicons name="archive" size={20} color={Colors.red} />
            <View style={styles.actionTextContainer}>
              <AppText variant="bodyMedium" style={[styles.archiveBtnText, isRTL && styles.textRight]}>
                {isRTL ? 'إزالة الإجراء' : 'Remove Action'}
              </AppText>
              <AppText variant="caption" color="muted" style={isRTL ? styles.textRight : undefined}>
                {isRTL
                  ? '.شيل الإجراء ده من خطتك اليومية'
                  : 'Remove this action from your daily plan.'}
              </AppText>
            </View>
          </TouchableOpacity>
        </Card>
      </ScrollView>
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
  archiveTopBtn: { padding: Spacing.xs },
  headerTitle: { fontWeight: '800' },
  textRight: { textAlign: 'right', writingDirection: 'rtl' },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  titleBlock: {
    marginBottom: Spacing.lg,
    gap: Spacing.xs,
  },
  tagRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  challengeTag: {
    backgroundColor: Colors.blueLight,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: Radii.sm,
  },
  challengeTagText: {
    color: Colors.primaryBlue,
    fontWeight: '700',
    fontSize: 9,
  },
  freqTag: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: Radii.sm,
  },
  freqTagText: {
    color: Colors.charcoalSoft,
    fontWeight: '700',
    fontSize: 9,
  },
  actionTitle: {
    fontWeight: '800',
    color: Colors.charcoal,
    fontSize: 26,
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  interactiveCard: {
    borderRadius: Radii.lg,
    overflow: 'hidden',
    marginBottom: Spacing.base,
    ...Shadows.md,
  },
  interactiveGradient: { padding: Spacing.md },
  interactiveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  statusIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusIconBoxActive: { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
  interactiveText: { flex: 1, gap: 2 },
  interactiveTitle: { fontWeight: '700', color: Colors.charcoal },
  interactiveDesc: { color: Colors.charcoalSoft, lineHeight: 14 },
  whiteText: { color: Colors.white },
  whiteDescText: { color: 'rgba(255, 255, 255, 0.85)' },
  statRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.base,
  },
  statCard: {
    flex: 1,
    gap: Spacing.xs,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    ...Shadows.sm,
  },
  weekCard: {
    marginBottom: Spacing.base,
    gap: Spacing.md,
    ...Shadows.sm,
  },
  weekTitle: { fontWeight: '700', color: Colors.charcoal },
  weekDots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
  },
  dayCol: { alignItems: 'center', gap: Spacing.xs },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayDotBorder: {
    borderWidth: 2,
    borderColor: Colors.primaryBlue,
  },
  dayLabel: { fontSize: 10, fontWeight: '500', color: Colors.muted },
  todayLabelActive: { fontWeight: '700', color: Colors.primaryBlue },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: Spacing.base,
    marginBottom: Spacing.xs,
  },
  actionsCard: {
    padding: 0,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    backgroundColor: Colors.white,
  },
  actionTextContainer: { flex: 1, gap: 2 },
  archiveBtnText: { fontWeight: '700', color: Colors.red },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  goHomeBtn: {
    backgroundColor: Colors.primaryBlue,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radii.md,
    marginTop: Spacing.md,
    ...Shadows.sm,
  },
});
