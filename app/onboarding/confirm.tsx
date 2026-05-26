import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Screen from '@/components/ui/Screen';
import AppText from '@/components/ui/AppText';
import PrimaryButton from '@/components/ui/PrimaryButton';
import Card from '@/components/ui/Card';
import { useAppStore } from '@/store/useAppStore';
import { ALL_GOALS } from '@/data/mockGoals';
import { ALL_STRUGGLES } from '@/data/mockStruggles';
import { Colors, Spacing, Radii, Gradients, Shadows } from '@/constants/theme';

export default function ConfirmHabits() {
  const {
    selectedHabitIds,
    selectedGoalIds,
    selectedStruggleIds,
    availableHabits,
    completeOnboarding,
    toggleHabit,
    addXp,
    isDarkMode,
  } = useAppStore();

  const selectedHabits = availableHabits.filter((h) => selectedHabitIds.includes(h.id));

  const goalLabels = selectedGoalIds
    .map((id) => ALL_GOALS.find((g) => g.id === id))
    .filter(Boolean);

  const struggleLabels = selectedStruggleIds
    .map((id) => ALL_STRUGGLES.find((s) => s.id === id))
    .filter(Boolean);

  const handleFinish = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // Award dopamine +50 XP Welcome Bonus!
    addXp(50);
    completeOnboarding();
    router.replace('/(tabs)/today');
  };

  const handleRemoveHabit = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleHabit(id);
  };

  const borderCol = isDarkMode ? '#2C2C2E' : Colors.border;
  const textColor = isDarkMode ? '#FFFFFF' : Colors.charcoal;
  const rowBg = isDarkMode ? '#1C1C1E' : Colors.white;

  return (
    <Screen scroll>
      <View style={styles.header}>
        <View style={styles.doneIcon}>
          <LinearGradient
            colors={Gradients.success}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.emojiBadge}
          >
            <AppText style={styles.doneEmoji}>✨</AppText>
          </LinearGradient>
        </View>
        <AppText variant="h1" style={styles.title}>Your Mind Shift Blueprint is Ready.</AppText>
        <AppText variant="body" style={styles.subtitle}>
          Your initial self-mastery configuration is compiled. You can modify these settings at any station.
        </AppText>
      </View>

      {/* Gamified Welcome Bonus Card */}
      <Card style={styles.bonusCard}>
        <LinearGradient
          colors={Gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.bonusGradient}
        >
          <View style={styles.bonusRow}>
            <View style={styles.bonusIconBox}>
              <Ionicons name="gift-sharp" size={24} color={Colors.white} />
            </View>
            <View style={styles.bonusText}>
              <AppText variant="bodyMedium" style={styles.bonusTitle}>
                Welcome Reward Unlocked!
              </AppText>
              <AppText variant="caption" style={styles.bonusDesc}>
                Completing setup awards you +50 XP to kickstart Level 1.
              </AppText>
            </View>
            <View style={styles.bonusBadge}>
              <AppText variant="caption" style={styles.bonusXpText}>+50 XP</AppText>
            </View>
          </View>
        </LinearGradient>
      </Card>

      {/* Goals summary */}
      <AppText variant="label" color="primaryBlue" style={styles.sectionLabel}>YOUR SELECTED PATHWAYS</AppText>
      <Card style={styles.summaryCard}>
        {goalLabels.map((goal, idx) => {
          const isLast = idx === goalLabels.length - 1;
          return (
            <View
              key={goal!.id}
              style={[
                styles.summaryRow,
                { backgroundColor: rowBg },
                !isLast && [styles.rowBorder, { borderBottomColor: borderCol }]
              ]}
            >
              <AppText style={styles.rowEmoji}>{goal!.emoji}</AppText>
              <AppText variant="bodyMedium" style={[styles.summaryText, { color: textColor }]}>{goal!.label}</AppText>
            </View>
          );
        })}
      </Card>

      {/* Struggles summary */}
      {struggleLabels.length > 0 && (
        <>
          <AppText variant="label" color="primaryBlue" style={styles.sectionLabel}>OVERCOMING FRICTION</AppText>
          <Card style={styles.summaryCard}>
            {struggleLabels.map((struggle, idx) => {
              const isLast = idx === struggleLabels.length - 1;
              return (
                <View
                  key={struggle!.id}
                  style={[
                    styles.summaryRow,
                    { backgroundColor: rowBg },
                    !isLast && [styles.rowBorder, { borderBottomColor: borderCol }]
                  ]}
                >
                  <AppText style={styles.rowEmoji}>{struggle!.emoji}</AppText>
                  <AppText variant="bodyMedium" style={[styles.summaryText, { color: textColor }]}>{struggle!.label}</AppText>
                </View>
              );
            })}
          </Card>
        </>
      )}

      {/* Habits summary */}
      <AppText variant="label" color="primaryBlue" style={styles.sectionLabel}>INITIALIZED LOOPS</AppText>
      <Card style={styles.habitList}>
        {selectedHabits.length === 0 ? (
          <AppText variant="body" style={styles.emptyMsg}>
            No habits selected. Go back to pick some.
          </AppText>
        ) : (
          selectedHabits.map((habit, idx) => {
            const isLast = idx === selectedHabits.length - 1;
            return (
              <View
                key={habit.id}
                style={[
                  styles.habitRow,
                  { backgroundColor: rowBg },
                  !isLast && [styles.rowBorder, { borderBottomColor: borderCol }]
                ]}
              >
                <View style={styles.checkDot} />
                <AppText
                  variant="bodyMedium"
                  style={[styles.habitTitle, { color: textColor }]}
                >
                  {habit.title}
                </AppText>
                <TouchableOpacity
                  onPress={() => handleRemoveHabit(habit.id)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="close-circle-sharp" size={20} color={Colors.muted} />
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </Card>

      <TouchableOpacity onPress={() => router.back()} style={styles.addLink}>
        <Ionicons name="add-circle-sharp" size={20} color={Colors.primaryBlue} />
        <AppText variant="bodyMedium" color="primaryBlue" style={styles.addText}>Add or alter action loops</AppText>
      </TouchableOpacity>

      <View style={styles.footer}>
        <PrimaryButton title="Commit to Blueprint (+50 XP)" onPress={handleFinish} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: Spacing.xl, marginBottom: Spacing.md, gap: Spacing.xs },
  title: { fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { marginTop: Spacing.xs, color: Colors.charcoalSoft, lineHeight: 20 },
  doneIcon: { marginBottom: Spacing.sm, alignSelf: 'flex-start' },
  emojiBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  doneEmoji: { fontSize: 30 },

  bonusCard: {
    padding: 0,
    borderRadius: Radii.lg,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  bonusGradient: {
    padding: Spacing.md,
  },
  bonusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  bonusIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bonusText: {
    flex: 1,
    gap: 2,
  },
  bonusTitle: {
    fontWeight: '700',
    color: Colors.white,
  },
  bonusDesc: {
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 14,
  },
  bonusBadge: {
    backgroundColor: Colors.white,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  bonusXpText: {
    color: Colors.primaryBlue,
    fontWeight: '700',
  },

  sectionLabel: { marginBottom: Spacing.xs, marginTop: Spacing.md, fontWeight: '700', fontSize: 10, letterSpacing: 0.5 },
  summaryCard: { padding: 0, overflow: 'hidden', marginBottom: Spacing.sm, ...Shadows.sm },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
  },
  summaryText: { color: Colors.charcoal },
  rowEmoji: { fontSize: 18 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },

  habitList: { padding: 0, overflow: 'hidden', ...Shadows.sm },
  emptyMsg: { padding: Spacing.base, color: Colors.muted },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
  },
  checkDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primaryBlue },
  habitTitle: { flex: 1, color: Colors.charcoal },

  addLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  addText: { fontWeight: '600' },
  footer: { marginTop: Spacing.xxl, paddingBottom: Spacing.xxxl },
});
