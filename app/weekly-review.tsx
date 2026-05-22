import { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppText from '@/components/ui/AppText';
import Card from '@/components/ui/Card';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import { ProgressBar } from '@/components/progress/ProgressCard';
import { DEMO_PROGRESS } from '@/data/mockProgress';
import { Colors, Spacing, Radii } from '@/constants/theme';
import { Copy } from '@/constants/copy';

export default function WeeklyReviewScreen() {
  const [wentWell, setWentWell] = useState('');
  const [wasDifficult, setWasDifficult] = useState('');
  const [improveNext, setImproveNext] = useState('');

  const { weeklyCompletionRate, currentStreak } = DEMO_PROGRESS;
  const completedThisWeek = DEMO_PROGRESS.weeklyData.reduce((acc, d) => acc + d.completed, 0);
  const totalThisWeek = DEMO_PROGRESS.weeklyData.reduce((acc, d) => acc + d.total, 0);
  const missedThisWeek = totalThisWeek - completedThisWeek;

  const handleSave = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.charcoal} />
        </TouchableOpacity>
        <AppText variant="h3">Weekly Review</AppText>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.titleBlock}>
          <AppText variant="h1">Let's look at this week.</AppText>
          <AppText variant="body">A moment to reflect and reset.</AppText>
        </View>

        {/* Weekly summary */}
        <AppText variant="label" color="muted" style={styles.sectionLabel}>Summary</AppText>
        <View style={styles.statRow}>
          <Card style={styles.statCard}>
            <AppText variant="caption" color="muted">Completed</AppText>
            <AppText variant="h2" color="primaryBlue">{completedThisWeek}</AppText>
          </Card>
          <Card style={styles.statCard}>
            <AppText variant="caption" color="muted">Missed</AppText>
            <AppText variant="h2">{missedThisWeek}</AppText>
          </Card>
          <Card style={styles.statCard}>
            <AppText variant="caption" color="muted">Rate</AppText>
            <AppText variant="h2">{Math.round(weeklyCompletionRate * 100)}%</AppText>
          </Card>
        </View>

        <Card style={styles.rateCard}>
          <View style={styles.rateRow}>
            <AppText variant="bodyMedium">Completion rate</AppText>
            <AppText variant="bodyMedium" color="primaryBlue">
              {Math.round(weeklyCompletionRate * 100)}%
            </AppText>
          </View>
          <ProgressBar value={weeklyCompletionRate * 100} total={100} />
        </Card>

        {/* Reflection */}
        <AppText variant="label" color="muted" style={styles.sectionLabel}>Reflection</AppText>

        <View style={styles.reflectionBlock}>
          <AppText variant="bodyMedium" style={styles.questionLabel}>
            What went well this week?
          </AppText>
          <TextInput
            style={styles.textarea}
            placeholder="Write freely..."
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
            placeholder="Be honest with yourself..."
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
            placeholder="One small thing..."
            placeholderTextColor={Colors.muted}
            value={improveNext}
            onChangeText={setImproveNext}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.actions}>
          <PrimaryButton title="Save Review" onPress={handleSave} />
          <SecondaryButton
            title="Adjust Habits"
            onPress={() => router.push('/onboarding/habits')}
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
  content: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xxxl,
  },
  titleBlock: {
    paddingTop: Spacing.xl,
    marginBottom: Spacing.xl,
    gap: Spacing.xs,
  },
  sectionLabel: {
    marginBottom: Spacing.sm,
    marginTop: Spacing.xs,
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
  },
  rateCard: {
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  rateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reflectionBlock: {
    marginBottom: Spacing.base,
  },
  questionLabel: {
    marginBottom: Spacing.sm,
    color: Colors.charcoal,
  },
  textarea: {
    backgroundColor: Colors.card,
    borderWidth: 1,
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
  },
});
