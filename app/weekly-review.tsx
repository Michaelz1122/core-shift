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
import MoodChip from '@/components/forms/MoodChip';
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

  const [selectedWins, setSelectedWins] = useState<Set<string>>(new Set());
  const [selectedFrictions, setSelectedFrictions] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState('');

  const WINS_EN = ['Consistent routine', 'High energy', 'Good focus', 'Overcame urges', 'Slept well'];
  const WINS_AR = ['روتين ثابت', 'طاقة عالية', 'تركيز ممتاز', 'قاومت المغريات', 'نوم مريح'];
  const FRICTIONS_EN = ['Distractions', 'Low energy', 'Stress', 'Lack of time', 'Bad mood'];
  const FRICTIONS_AR = ['مشتتات', 'طاقة ضعيفة', 'ضغط وتوتر', 'ضيق الوقت', 'مزاج سيء'];

  const wins = isRTL ? WINS_AR : WINS_EN;
  const frictions = isRTL ? FRICTIONS_AR : FRICTIONS_EN;

  const toggleSet = (set: Set<string>, val: string, setter: React.Dispatch<React.SetStateAction<Set<string>>>) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const next = new Set(set);
    if (next.has(val)) next.delete(val);
    else next.add(val);
    setter(next);
  };

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
    
    const winsStr = Array.from(selectedWins).join(', ');
    const fricStr = Array.from(selectedFrictions).join(', ');

    const reflectionText = isRTL
      ? `مراجعة أسبوعية:\n\n١. إنجازات: ${winsStr || 'مفيش'}\n٢. صعوبات: ${fricStr || 'مفيش'}\n٣. ملاحظات: ${notes.trim() || 'مفيش'}`
      : `Weekly Reflections:\n\n1. Wins: ${winsStr || 'None'}\n2. Frictions: ${fricStr || 'None'}\n3. Notes: ${notes.trim() || 'None'}`;

    addNote(reflectionText);
    useAppStore.getState().setLastWeeklyReviewDate(new Date().toISOString().split('T')[0]);
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
          <View style={styles.chipGroup}>
            {wins.map(w => (
              <TouchableOpacity
                key={w}
                onPress={() => toggleSet(selectedWins, w, setSelectedWins)}
                style={[styles.chip, selectedWins.has(w) && styles.chipActive]}
              >
                <AppText style={{ color: selectedWins.has(w) ? Colors.white : Colors.charcoal, fontSize: 13, fontWeight: '600' }}>
                  {w}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.reflectionBlock}>
          <AppText variant="bodyMedium" style={[styles.questionLabel, isRTL && styles.textRight]}>
            {isRTL ? 'إيه اللي كان صعب؟' : 'What was difficult?'}
          </AppText>
          <View style={styles.chipGroup}>
            {frictions.map(f => (
              <TouchableOpacity
                key={f}
                onPress={() => toggleSet(selectedFrictions, f, setSelectedFrictions)}
                style={[styles.chip, selectedFrictions.has(f) && styles.chipActiveFriction]}
              >
                <AppText style={{ color: selectedFrictions.has(f) ? Colors.white : Colors.charcoal, fontSize: 13, fontWeight: '600' }}>
                  {f}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.reflectionBlock}>
          <AppText variant="bodyMedium" style={[styles.questionLabel, isRTL && styles.textRight]}>
            {isRTL ? 'ملاحظات إضافية (اختياري)' : 'Additional Notes (Optional)'}
          </AppText>
          <TextInput
            style={[styles.textarea, isRTL && styles.textareaRTL]}
            placeholder={isRTL ? 'اكتب ملاحظاتك هنا...' : 'Any other thoughts?'}
            placeholderTextColor={Colors.muted}
            value={notes}
            onChangeText={setNotes}
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
            onPress={() => router.push('/edit-plan' as any)}
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
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  chipActive: {
    backgroundColor: Colors.primaryBlue,
    borderColor: Colors.primaryBlue,
  },
  chipActiveFriction: {
    backgroundColor: '#FF3B30',
    borderColor: '#FF3B30',
  },
  actions: {
    marginTop: Spacing.xl,
    gap: Spacing.sm,
    paddingBottom: Spacing.xxl,
  },
});
