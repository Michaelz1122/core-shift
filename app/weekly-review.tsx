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

export default function WeeklyReviewScreen() {
  const {
    selectedHabitIds,
    completedHabitIdsToday,
    streakHistory,
    addNote,
    isDarkMode,
  } = useAppStore();

  const [wentWell, setWentWell] = useState('');
  const [wasDifficult, setWasDifficult] = useState('');
  const [improveNext, setImproveNext] = useState('');

  const totalPerDay = selectedHabitIds.length;

  // Compute 100% real dynamic weekly completion rate from actual user state
  let completedThisWeek = completedHabitIdsToday.length;
  let totalThisWeek = totalPerDay;

  // Scan the previous 6 days
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

  // Active Save: compiles reflection and appends to Notes (triggering +15 XP!)
  const handleSave = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Construct reflection summary
    const reflectionText = `Weekly Reflections:\n\n1. What went well: ${wentWell.trim() || 'No feedback entered'}\n2. Difficulties faced: ${wasDifficult.trim() || 'No feedback entered'}\n3. Actionable improvements: ${improveNext.trim() || 'No feedback entered'}`;
    
    addNote(reflectionText); // Adds note, grants XP, and levels up if threshold crossed
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
        <AppText variant="h3" style={styles.headerTitle}>Weekly System Review</AppText>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        style={{ backgroundColor: themeBg }}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleBlock}>
          <AppText variant="h1" style={styles.heroText}>Review this week.</AppText>
          <AppText variant="body" color="muted">Commit to reflecting. Correct course for maximum agency.</AppText>
        </View>

        {/* Weekly summary */}
        <AppText variant="label" color="primaryBlue" style={styles.sectionLabel}>WEEKLY METRICS</AppText>
        <View style={styles.statRow}>
          <Card style={styles.statCard}>
            <AppText variant="caption" color="muted">Completions</AppText>
            <AppText variant="h2" color="primaryBlue">{completedThisWeek}</AppText>
          </Card>
          <Card style={styles.statCard}>
            <AppText variant="caption" color="muted">Missed Tasks</AppText>
            <AppText variant="h2">{missedThisWeek}</AppText>
          </Card>
          <Card style={styles.statCard}>
            <AppText variant="caption" color="muted">Success Rate</AppText>
            <AppText variant="h2">{Math.round(weeklyCompletionRate * 100)}%</AppText>
          </Card>
        </View>

        <Card style={styles.rateCard}>
          <View style={styles.rateRow}>
            <AppText variant="bodyMedium" style={styles.rateLabel}>Week Success Quotient</AppText>
            <AppText variant="bodyMedium" color="primaryBlue" style={styles.boldQuotient}>
              {Math.round(weeklyCompletionRate * 100)}%
            </AppText>
          </View>
          <View style={styles.barBox}>
            <ProgressBar value={Math.round(weeklyCompletionRate * 100)} total={100} />
          </View>
        </Card>

        {/* Reflection prompts */}
        <AppText variant="label" color="primaryBlue" style={styles.sectionLabel}>REFLECTIVE DISCIPLINE (+15 XP)</AppText>

        <View style={styles.reflectionBlock}>
          <AppText variant="bodyMedium" style={styles.questionLabel}>
            What went well this week?
          </AppText>
          <TextInput
            style={styles.textarea}
            placeholder="Document your small victories..."
            placeholderTextColor={Colors.muted}
            value={wentWell}
            onChangeText={setWentWell}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.reflectionBlock}>
          <AppText variant="bodyMedium" style={styles.questionLabel}>
            What was difficult?
          </AppText>
          <TextInput
            style={styles.textarea}
            placeholder="Be brutally honest with your friction points..."
            placeholderTextColor={Colors.muted}
            value={wasDifficult}
            onChangeText={setWasDifficult}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.reflectionBlock}>
          <AppText variant="bodyMedium" style={styles.questionLabel}>
            What do you want to improve next week?
          </AppText>
          <TextInput
            style={styles.textarea}
            placeholder="One specific high-agency change..."
            placeholderTextColor={Colors.muted}
            value={improveNext}
            onChangeText={setImproveNext}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.actions}>
          <PrimaryButton title="Commit Weekly Review" onPress={handleSave} />
          <SecondaryButton
            title="Calibrate Active Habits"
            onPress={() => router.push('/onboarding/goals')}
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
  rateLabel: {
    fontWeight: '600',
  },
  boldQuotient: {
    fontWeight: '700',
  },
  barBox: {
    marginTop: Spacing.xs,
  },
  reflectionBlock: {
    marginBottom: Spacing.base,
  },
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
  actions: {
    marginTop: Spacing.xl,
    gap: Spacing.sm,
    paddingBottom: Spacing.xxl,
  },
});
