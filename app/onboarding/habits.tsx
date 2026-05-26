import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Screen from '@/components/ui/Screen';
import AppText from '@/components/ui/AppText';
import PrimaryButton from '@/components/ui/PrimaryButton';
import Card from '@/components/ui/Card';
import { useAppStore } from '@/store/useAppStore';
import { ALL_GOALS } from '@/data/mockGoals';
import { GoalId } from '@/types';
import { Colors, Spacing, Radii, Shadows } from '@/constants/theme';

export default function HabitSuggestions() {
  const {
    selectedGoalIds,
    selectedHabitIds,
    availableHabits,
    buildAvailableHabits,
    toggleHabit,
    addCustomHabit,
    isDarkMode,
  } = useAppStore();

  // Initialize empty state to start 100% custom
  useEffect(() => {
    buildAvailableHabits();
  }, []);

  const canContinue = selectedHabitIds.length > 0;

  // Track which pathway is currently expanding its "Add Habit" form
  const [activeInputGoalId, setActiveInputGoalId] = useState<GoalId | null>(null);
  const [tempTitle, setTempTitle] = useState('');
  const [tempFreq, setTempFreq] = useState<'daily' | 'weekly'>('daily');

  // Filter pathways chosen by the user in Station 1
  const activeGoals = ALL_GOALS.filter((g) => selectedGoalIds.includes(g.id));

  const handleToggle = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleHabit(id);
  };

  // Add inline custom habit to a specific pathway category
  const handleSaveInlineHabit = (goalId: GoalId) => {
    if (!tempTitle.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Save to store
    addCustomHabit(tempTitle.trim(), goalId, tempFreq);
    
    // Reset temporary states
    setTempTitle('');
    setTempFreq('daily');
    setActiveInputGoalId(null);
  };

  const rowBg = isDarkMode ? '#1C1C1E' : Colors.white;
  const rowActiveBg = isDarkMode ? 'rgba(45, 127, 249, 0.15)' : Colors.blueLight;
  const borderCol = isDarkMode ? '#2C2C2E' : Colors.border;
  const formBg = isDarkMode ? '#121214' : Colors.background;
  const inputBg = isDarkMode ? '#1C1C1E' : Colors.white;
  const inputTextColor = isDarkMode ? '#FFFFFF' : Colors.charcoal;
  const freqBtnBg = isDarkMode ? '#1C1C1E' : Colors.white;

  return (
    <Screen scroll>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={isDarkMode ? '#FFFFFF' : Colors.charcoal} />
        </TouchableOpacity>
        
        <View style={styles.stepRow}>
          <AppText variant="label" color="primaryBlue" style={styles.stepLabel}>
            STATION 03 // HABIT CALIBRATION
          </AppText>
        </View>
        <AppText variant="h1" style={styles.title}>Define your custom commitments.</AppText>
        <AppText variant="body" style={styles.subtitle}>
          Create tailored daily or weekly habits for each of your selected pathways. ({selectedHabitIds.length} active loops)
        </AppText>
        
        {/* Step progress tracker */}
        <View style={styles.pills}>
          <View style={[styles.pill, styles.pillActive]} />
          <View style={[styles.pill, styles.pillActive]} />
          <View style={[styles.pill, styles.pillActive]} />
        </View>
      </View>

      <View style={styles.list}>
        {activeGoals.map((goal) => {
          // Get habits created under this specific goal pathway
          const goalHabits = availableHabits.filter((h) => h.goalId === goal.id);
          const isFormOpen = activeInputGoalId === goal.id;

          return (
            <View key={goal.id} style={styles.section}>
              {/* Pathway Category Title */}
              <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionAccentLine} />
                <AppText variant="label" style={styles.sectionLabel}>
                  {goal.emoji} {goal.label.toUpperCase()} PATHWAY
                </AppText>
              </View>

              {/* Main Pathway Card */}
              <Card style={styles.habitCard}>
                {goalHabits.length === 0 ? (
                  <View style={styles.placeholderBox}>
                    <Ionicons name="sparkles-outline" size={22} color={Colors.muted} />
                    <AppText variant="caption" color="muted" align="center" style={styles.placeholderText}>
                      No habits defined yet. Define your commitment to begin.
                    </AppText>
                  </View>
                ) : (
                  goalHabits.map((habit, idx) => {
                    const selected = selectedHabitIds.includes(habit.id);
                    const isLast = idx === goalHabits.length - 1;
                    return (
                      <TouchableOpacity
                        key={habit.id}
                        style={[
                          styles.habitRow,
                          {
                            backgroundColor: selected ? rowActiveBg : rowBg,
                            borderBottomColor: borderCol,
                          },
                          !isLast && styles.habitBorder,
                        ]}
                        onPress={() => handleToggle(habit.id)}
                        activeOpacity={0.75}
                      >
                        <View style={[styles.check, { borderColor: borderCol }, selected && styles.checkOn]}>
                          {selected && <Ionicons name="checkmark" size={12} color={Colors.white} />}
                        </View>
                        <View style={styles.habitTextContainer}>
                          <AppText
                            variant="bodyMedium"
                            style={[
                              styles.habitTitle,
                              { color: isDarkMode ? '#FFFFFF' : Colors.charcoal },
                              selected && styles.habitTitleActive
                            ]}
                          >
                            {habit.title}
                          </AppText>
                          <AppText variant="caption" color="muted">
                            Cadence · {habit.frequency.toUpperCase()}
                          </AppText>
                        </View>
                        <Ionicons name="checkmark-circle" size={16} color={Colors.primaryBlue} />
                      </TouchableOpacity>
                    );
                  })
                )}

                {/* Inline habit input form inside this specific card */}
                {isFormOpen && (
                  <View style={[styles.inlineForm, { backgroundColor: formBg, borderTopColor: borderCol }]}>
                    <AppText variant="label" style={styles.inlineLabel}>HABIT DESCRIPTION</AppText>
                    <TextInput
                      style={[styles.inlineInput, { backgroundColor: inputBg, borderColor: borderCol, color: inputTextColor }]}
                      placeholder="e.g. Read 1 chapter, Exercise for 30 mins..."
                      placeholderTextColor={Colors.muted}
                      value={tempTitle}
                      onChangeText={setTempTitle}
                      autoFocus
                    />
                    
                    <AppText variant="label" style={styles.inlineLabel}>FREQUENCY CADENCE</AppText>
                    <View style={styles.inlineFormFooter}>
                      <View style={styles.freqRow}>
                        {(['daily', 'weekly'] as const).map((f) => {
                          const isChosen = tempFreq === f;
                          return (
                            <TouchableOpacity
                              key={f}
                              style={[
                                styles.freqBtn,
                                {
                                  backgroundColor: isChosen ? Colors.primaryBlue : freqBtnBg,
                                  borderColor: isChosen ? Colors.primaryBlue : borderCol,
                                }
                              ]}
                              onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                setTempFreq(f);
                              }}
                              activeOpacity={0.8}
                            >
                              <AppText
                                variant="caption"
                                style={[styles.freqText, isChosen && styles.freqTextActive]}
                              >
                                {f.toUpperCase()}
                              </AppText>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                      
                      <TouchableOpacity
                        style={[styles.inlineSubmitBtn, !tempTitle.trim() && styles.inlineSubmitDisabled]}
                        disabled={!tempTitle.trim()}
                        onPress={() => handleSaveInlineHabit(goal.id)}
                      >
                        <AppText variant="bodyMedium" style={styles.inlineSubmitText}>Add</AppText>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {/* Accent action line splitter */}
                <View style={[styles.cardDivider, { backgroundColor: borderCol }]} />

                {/* Add Custom Habit Button specific to this pathway */}
                <TouchableOpacity
                  style={styles.addHabitBtn}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    if (isFormOpen) {
                      setActiveInputGoalId(null);
                      setTempTitle('');
                    } else {
                      setActiveInputGoalId(goal.id);
                      setTempTitle('');
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons name={isFormOpen ? 'close-circle' : 'add-circle-sharp'} size={18} color={Colors.primaryBlue} />
                  <AppText variant="bodyMedium" color="primaryBlue" style={styles.addHabitBtnText}>
                    {isFormOpen ? 'Cancel' : `Add ${goal.label} Habit`}
                  </AppText>
                </TouchableOpacity>
              </Card>
            </View>
          );
        })}

        {activeGoals.length === 0 && (
          <AppText variant="body" color="muted" align="center" style={styles.noSuggestions}>
            No pathways selected. Go back and select your dimensions.
          </AppText>
        )}
      </View>

      <View style={styles.footer}>
        <AppText variant="caption" align="center" color="muted" style={styles.countLabel}>
          {selectedHabitIds.length} CUSTOM COMMITMENTS REGISTERED
        </AppText>
        <PrimaryButton
          title="Compile Blueprint"
          onPress={() => router.push('/onboarding/confirm')}
          disabled={!canContinue}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: Spacing.xl, marginBottom: Spacing.base, gap: Spacing.xs },
  backBtn: { alignSelf: 'flex-start', padding: Spacing.xs, marginLeft: -Spacing.xs, marginBottom: Spacing.xs },
  stepRow: { marginBottom: Spacing.xs },
  stepLabel: { fontSize: 11, letterSpacing: 1, fontWeight: '700' },
  title: { fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { marginTop: Spacing.xs, color: Colors.charcoalSoft, lineHeight: 20 },
  pills: { flexDirection: 'row', gap: Spacing.xs, marginTop: Spacing.md },
  pill: { width: 36, height: 5, borderRadius: Radii.sm, backgroundColor: Colors.border },
  pillActive: { backgroundColor: Colors.primaryBlue },

  list: { marginVertical: Spacing.sm },
  section: { marginBottom: Spacing.lg },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  sectionAccentLine: {
    width: 3,
    height: 12,
    backgroundColor: Colors.primaryBlue,
    borderRadius: Radii.sm,
  },
  sectionLabel: {
    color: Colors.primaryBlue,
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  habitCard: { padding: 0, overflow: 'hidden', ...Shadows.sm },
  placeholderBox: {
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.base,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  placeholderText: {
    color: Colors.muted,
    lineHeight: 18,
    marginTop: Spacing.xs,
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    backgroundColor: Colors.white,
  },
  habitRowActive: {
    backgroundColor: Colors.blueLight,
  },
  habitBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  check: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOn: { backgroundColor: Colors.primaryBlue, borderColor: Colors.primaryBlue },
  habitTextContainer: {
    flex: 1,
    gap: 2,
  },
  habitTitle: { color: Colors.charcoal, fontWeight: '500' },
  habitTitleActive: { color: Colors.primaryBlue, fontWeight: '700' },

  cardDivider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  addHabitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    backgroundColor: 'rgba(45, 127, 249, 0.04)',
  },
  addHabitBtnText: {
    fontWeight: '700',
  },

  // Inline Form styling
  inlineForm: {
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.xs,
  },
  inlineLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.charcoalSoft,
    letterSpacing: 0.5,
    marginTop: Spacing.xs,
  },
  inlineInput: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    fontSize: 14,
    color: Colors.charcoal,
    marginBottom: Spacing.xs,
  },
  inlineFormFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  freqRow: {
    flex: 1,
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  freqBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: Radii.md,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  freqBtnActive: {
    backgroundColor: Colors.primaryBlue,
    borderColor: Colors.primaryBlue,
  },
  freqText: {
    color: Colors.charcoalSoft,
    fontWeight: '600',
  },
  freqTextActive: {
    color: Colors.white,
    fontWeight: '700',
  },
  inlineSubmitBtn: {
    backgroundColor: Colors.primaryBlue,
    paddingVertical: 9,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  inlineSubmitDisabled: {
    backgroundColor: Colors.border,
  },
  inlineSubmitText: {
    color: Colors.white,
    fontWeight: '800',
  },

  noSuggestions: { marginTop: Spacing.xl },
  footer: { marginTop: Spacing.xl, paddingBottom: Spacing.xxxl, gap: Spacing.sm },
  countLabel: { fontWeight: '700', color: Colors.primaryBlue },
});
