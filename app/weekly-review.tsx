import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AppText from '@/components/ui/AppText';
import Card from '@/components/ui/Card';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import { ProgressBar } from '@/components/progress/ProgressCard';
import { useAppStore } from '@/store/useAppStore';
import { Colors, Spacing, Radii, Shadows } from '@/constants/theme';
import { useTranslation } from '@/i18n';

export default function WeeklyReviewScreen() {
  const { t, isRTL } = useTranslation();
  const {
    activeActionIds,
    completedActionIdsToday,
    streakHistory,
    addNote,
    isDarkMode,
  } = useAppStore();

  const [wentWell, setWentWell] = useState('');
  const [wasDifficult, setWasDifficult] = useState('');
  const [improveNext, setImproveNext] = useState('');

  const totalPerDay = activeActionIds.length;

  // Compute weekly completion rate from real user state
  let completedThisWeek = completedActionIdsToday.length;
  let totalThisWeek = totalPerDay;

  for (let i = 1; i <= 6; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const perfectDay = streakHistory[dateStr] === true;

    totalThisWeek += totalPerDay;
    completedThisWeek += perfectDay ? totalPerDay : 0;
  }

  const missedThisWeek = Math.max(0, totalThisWeek - completedThisWeek);
  const weeklyCompletionRate = totalThisWeek > 0 ? completedThisWeek / totalThisWeek : 0;

  const handleSave = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const reflectionText = isRTL
      ? `مراجعة أسبوعية:\n\n١. إيه اللي اتعمل كويس: ${wentWell.trim() || 'مفيش تعليق'}\n٢. الصعوبات: ${wasDifficult.trim() || 'مفيش تعليق'}\n٣. تحسينات الأسبوع الجاي: ${improveNext.trim() || 'مفيش تعليق'}`
      : `Weekly Reflections:\n\n1. What went well: ${wentWell.trim() || 'No feedback entered'}\n2. Difficulties faced: ${wasDifficult.trim() || 'No feedback entered'}\n3. Actionable improvements: ${improveNext.trim() || 'No feedback entered'}`;

    addNote(reflectionText);
    router.back();
  };

  const themeBg = isDarkMode ? '#121214' : Colors.background;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: themeBg }]} edges={['top', 'bottom']}>
      {/* Header bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={isDarkMode ? '#FFFFFF' : Colors.charcoal} />
        </TouchableOpacity>
        <AppText variant="h3" style={styles.headerTitle}>
          {isRTL ? 'المراجعة الأسبوعية' : 'Weekly Review'}
        </AppText>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        style={{ backgroundColor: themeBg }}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleBlock}>
          <AppText variant="h1" style={[styles.heroText, isRTL && styles.textRight]}>
            {isRTL ? 'راجع الأسبوع.' : 'Review this week.'}
          </AppText>
          <AppText variant="body" color="muted" style={isRTL ? styles.textRight : undefined}>
            {isRTL
              ? 'خلي المراجعة عادة. صحح المسار عشان تكمل.'
              : 'Commit to reflecting. Correct course for maximum progress.'}
          </AppText>
        </View>

        {/* Weekly summary */}
        <AppText variant="label" color="primaryBlue" style={styles.sectionLabel}>
          {isRTL ? 'إحصائيات الأسبوع' : 'WEEKLY METRICS'}
        </AppText>
        <View style={styles.statRow}>
          <Card style={styles.statCard}>
            <AppText variant="caption" color="muted">{isRTL ? 'مكتمل' : 'Completions'}</AppText>
            <AppText variant="h2" color="primaryBlue">{completedThisWeek}</AppText>
          </Card>
          <Card style={styles.statCard}>
            <AppText variant="caption" color="muted">{isRTL ? 'فاتك' : 'Missed'}</AppText>
            <AppText variant="h2">{missedThisWeek}</AppText>
          </Card>
          <Card style={styles.statCard}>
            <AppText variant="caption" color="muted">{isRTL ? 'النسبة' : 'Success Rate'}</AppText>
            <AppText variant="h2">{Math.round(weeklyCompletionRate * 100)}%</AppText>
          </Card>
        </View>

        <Card style={styles.rateCard}>
          <View style={styles.rateRow}>
            <AppText variant="bodyMedium" style={styles.rateLabel}>
              {isRTL ? 'معدل النجاح الأسبوعي' : 'Week Success Rate'}
            </AppText>
            <AppText variant="bodyMedium" color="primaryBlue" style={styles.boldQuotient}>
              {Math.round(weeklyCompletionRate * 100)}%
            </AppText>
          </View>
          <View style={styles.barBox}>
            <ProgressBar value={Math.round(weeklyCompletionRate * 100)} total={100} />
          </View>
        </Card>

        {/* Reflection prompts */}
        <AppText variant="label" color="primaryBlue" style={styles.sectionLabel}>
          {isRTL ? 'تأمل (+١٥ XP)' : 'REFLECT (+15 XP)'}
        </AppText>

        <View style={styles.reflectionBlock}>
          <AppText variant="bodyMedium" style={[styles.questionLabel, isRTL && styles.textRight]}>
            {isRTL ? 'إيه اللي اتعمل كويس الأسبوع ده؟' : 'What went well this week?'}
          </AppText>
          <TextInput
            style={[styles.textarea, isRTL && styles.textareaRTL]}
            placeholder={isRTL ? 'سجل انتصاراتك الصغيرة...' : 'Document your small victories...'}
            placeholderTextColor={Colors.muted}
            value={wentWell}
            onChangeText={setWentWell}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            textAlign={isRTL ? 'right' : 'left'}
          />
        </View>

        <View style={styles.reflectionBlock}>
          <AppText variant="bodyMedium" style={[styles.questionLabel, isRTL && styles.textRight]}>
            {isRTL ? 'إيه اللي كان صعب؟' : 'What was difficult?'}
          </AppText>
          <TextInput
            style={[styles.textarea, isRTL && styles.textareaRTL]}
            placeholder={isRTL ? 'كن صريح مع نفسك...' : 'Be brutally honest with your friction points...'}
            placeholderTextColor={Colors.muted}
            value={wasDifficult}
            onChangeText={setWasDifficult}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            textAlign={isRTL ? 'right' : 'left'}
          />
        </View>

        <View style={styles.reflectionBlock}>
          <AppText variant="bodyMedium" style={[styles.questionLabel, isRTL && styles.textRight]}>
            {isRTL ? 'إيه اللي هتحسنه الأسبوع الجاي؟' : 'What do you want to improve next week?'}
          </AppText>
          <TextInput
            style={[styles.textarea, isRTL && styles.textareaRTL]}
            placeholder={isRTL ? 'تغيير واحد محدد...' : 'One specific actionable change...'}
            placeholderTextColor={Colors.muted}
            value={improveNext}
            onChangeText={setImproveNext}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            textAlign={isRTL ? 'right' : 'left'}
          />
        </View>

        <View style={styles.actions}>
          <PrimaryButton
            title={isRTL ? 'حفظ المراجعة' : 'Commit Weekly Review'}
            onPress={handleSave}
          />
          <SecondaryButton
            title={isRTL ? 'تعديل الإجراءات النشطة' : 'Edit Active Actions'}
            onPress={() => router.push('/onboarding/plan')}
            variant="outline"
          />
        </View>
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
  backBtn: { width: 36, padding: Spacing.xs },
  headerTitle: { fontWeight: '800' },
  textRight: { textAlign: 'right', writingDirection: 'rtl' },
  content: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xxxl,
  },
  titleBlock: {
    paddingTop: Spacing.xl,
    marginBottom: Spacing.lg,
    gap: Spacing.xs,
  },
  heroText: {
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  statRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.lg,
    ...Shadows.sm,
  },
  rateCard: {
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  rateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rateLabel: { fontWeight: '600' },
  boldQuotient: { fontWeight: '700' },
  barBox: { marginTop: Spacing.xs },
  reflectionBlock: { marginBottom: Spacing.base },
  questionLabel: {
    marginBottom: Spacing.sm,
    color: Colors.charcoal,
    fontWeight: '700',
  },
  textarea: {
    backgroundColor: Colors.card,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radii.md,
    padding: Spacing.base,
    fontSize: 15,
    color: Colors.charcoal,
    minHeight: 90,
    lineHeight: 22,
  },
  textareaRTL: {
    writingDirection: 'rtl',
  },
  actions: {
    marginTop: Spacing.xl,
    gap: Spacing.sm,
    paddingBottom: Spacing.xxl,
  },
});
