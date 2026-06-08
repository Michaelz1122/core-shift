import { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import AppText from '@/components/ui/AppText';
import Card from '@/components/ui/Card';
import { useAppStore } from '@/store/useAppStore';
import { ALL_CHALLENGES } from '@/data/challenges';
import { generateActionPlan } from '@/utils/actionPlanEngine';
import { Colors, Spacing, Radii, Gradients, Shadows } from '@/constants/theme';
import { useTranslation } from '@/i18n';
import type { Action } from '@/types';

const MIN_ACTIVE = 3;
const MAX_ACTIVE = 5;

export default function PlanScreen() {
  const { t, language, isRTL } = useTranslation();
  const {
    selectedChallengeIds,
    quizAnswers,
    setActions,
    activeActionIds,
    toggleAction,
    addXp,
    completeOnboarding,
  } = useAppStore();

  const [isGenerating, setIsGenerating] = useState(true);
  const [generatedActions, setGeneratedActions] = useState<Action[]>([]);
  const [localSelected, setLocalSelected] = useState<Set<string>>(new Set());

  // Loading animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const dotAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animated dots
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(dotAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
      ])
    ).start();

    // Generate plan after brief "thinking" animation
    const timer = setTimeout(() => {
      const actions = generateActionPlan(selectedChallengeIds, quizAnswers, language);
      setGeneratedActions(actions);

      // Pre-select top 5 (or all if fewer)
      const preSelected = new Set(actions.slice(0, MIN_ACTIVE).map((a) => a.id));
      setLocalSelected(preSelected);

      setIsGenerating(false);

      // Fade in results
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  const handleToggle = (id: string) => {
    const isSelected = localSelected.has(id);
    // Can't deselect if at minimum
    if (isSelected && localSelected.size <= MIN_ACTIVE) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }
    // Can't add more if at maximum
    if (!isSelected && localSelected.size >= MAX_ACTIVE) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLocalSelected((prev) => {
      const next = new Set(prev);
      if (isSelected) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCommit = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Persist selected actions to store
    setActions(generatedActions);

    // Override activeActionIds with user's selection
    // First clear by calling setActions (which resets to first 5)
    // Then adjust to match localSelected exactly
    const selectedActions = generatedActions.filter((a) => localSelected.has(a.id));
    const allActions = generatedActions;

    useAppStore.setState({
      actions: allActions,
      activeActionIds: Array.from(localSelected),
    });

    // Welcome bonus XP
    addXp(50);
    completeOnboarding();
    router.replace('/(tabs)/today');
  };

  const difficultyColor = {
    beginner: '#34C759',
    intermediate: '#FF9500',
    advanced: '#FF3B30',
  } as const;

  const difficultyLabel = {
    beginner: t.planBeginner,
    intermediate: t.planIntermediate,
    advanced: t.planAdvanced,
  } as const;

  // Group actions by challenge
  const groupedActions = selectedChallengeIds.reduce<Record<string, Action[]>>(
    (acc, challengeId) => {
      acc[challengeId] = generatedActions.filter((a) => a.challengeId === challengeId);
      return acc;
    },
    {}
  );

  // Also include any actions that don't match the selected challenges (cross-challenge)
  const unmatched = generatedActions.filter(
    (a) => !selectedChallengeIds.includes(a.challengeId)
  );
  if (unmatched.length > 0) {
    groupedActions['other'] = unmatched;
  }

  const selectedCount = localSelected.size;
  const canCommit = selectedCount >= MIN_ACTIVE && selectedCount <= MAX_ACTIVE;

  // ── Loading state ──────────────────────────────────────────────────────────

  if (isGenerating) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.loadingContainer}>
          <LinearGradient
            colors={Gradients.xp}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.loadingIcon}
          >
            <AppText style={styles.loadingEmoji}>🧠</AppText>
          </LinearGradient>
          <AppText variant="h2" style={styles.loadingTitle}>
            {t.planGenerating}
          </AppText>
          <AppText variant="body" color="muted" style={styles.loadingSubtitle}>
            {t.planGeneratingSubtitle}
          </AppText>
          <Animated.View style={[styles.dots, { opacity: dotAnim }]}>
            <View style={[styles.dot, { backgroundColor: Colors.primaryBlue }]} />
            <View style={[styles.dot, { backgroundColor: Colors.primaryBlue }]} />
            <View style={[styles.dot, { backgroundColor: Colors.primaryBlue }]} />
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  // ── Results state ──────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <Animated.View style={[{ flex: 1 }, { opacity: fadeAnim }]}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.titleBlock}>
            <AppText variant="label" color="primaryBlue" style={isRTL ? styles.textRight : undefined}>
              {language === 'ar' ? 'خطوة ٤ من ٤' : 'Step 4 of 4'}
            </AppText>
            <AppText variant="h1" style={[styles.title, isRTL && styles.textRight]}>
              {t.planTitle}
            </AppText>
            <AppText variant="body" color="muted" style={[styles.subtitle, isRTL && styles.textRight]}>
              {t.planSubtitle}
            </AppText>
          </View>

          {/* Welcome Bonus card */}
          <Card style={styles.bonusCard}>
            <LinearGradient
              colors={Gradients.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.bonusGradient}
            >
              <Ionicons name="gift-sharp" size={22} color={Colors.white} />
              <View style={styles.bonusText}>
                <AppText variant="bodyMedium" style={styles.bonusTitle}>
                  {t.planWelcomeBonusTitle}
                </AppText>
                <AppText variant="caption" style={styles.bonusDesc}>
                  {t.planWelcomeBonusDesc}
                </AppText>
              </View>
              <View style={styles.xpBadge}>
                <AppText variant="caption" style={styles.xpText}>+50 XP</AppText>
              </View>
            </LinearGradient>
          </Card>

          {/* Selection counter */}
          <View style={styles.counterRow}>
            <View style={[styles.counterDot, canCommit ? styles.counterDotActive : styles.counterDotWarn]} />
            <AppText variant="bodyMedium" color={canCommit ? 'primaryBlue' : 'muted'}>
              {selectedCount} {t.planHint} ({MIN_ACTIVE}–{MAX_ACTIVE})
            </AppText>
          </View>

          {/* Actions grouped by challenge */}
          {Object.entries(groupedActions).map(([challengeId, actions]) => {
            if (actions.length === 0) return null;
            const challenge = ALL_CHALLENGES.find((c) => c.id === challengeId);
            const groupLabel = challenge ? challenge.label[language] : (language === 'ar' ? 'إجراءات إضافية' : 'Additional Actions');

            return (
              <View key={challengeId} style={styles.group}>
                <View style={styles.groupHeader}>
                  {challenge && (
                    <AppText style={styles.groupEmoji}>{challenge.emoji}</AppText>
                  )}
                  <AppText variant="label" style={[styles.groupLabel, isRTL && styles.textRight]}>
                    {groupLabel.toUpperCase()}
                  </AppText>
                </View>

                <Card style={styles.actionList}>
                  {actions.map((action, idx) => {
                    const selected = localSelected.has(action.id);
                    const isLastInGroup = idx === actions.length - 1;

                    return (
                      <View key={action.id}>
                        <TouchableOpacity
                          onPress={() => handleToggle(action.id)}
                          activeOpacity={0.8}
                          style={[
                            styles.actionRow,
                            selected && styles.actionRowSelected,
                          ]}
                        >
                          {/* Custom checkbox */}
                          <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
                            {selected && (
                              <Ionicons name="checkmark" size={14} color={Colors.white} />
                            )}
                          </View>

                          {/* Emoji */}
                          <AppText style={styles.actionEmoji}>{action.emoji}</AppText>

                          {/* Title + badges */}
                          <View style={styles.actionText}>
                            <AppText
                              variant="bodyMedium"
                              style={[
                                styles.actionTitle,
                                selected && styles.actionTitleSelected,
                                isRTL && styles.textRight,
                              ]}
                            >
                              {action.title}
                            </AppText>
                            <View style={styles.badges}>
                              <View
                                style={[
                                  styles.badge,
                                  { backgroundColor: difficultyColor[action.difficulty] + '22' },
                                ]}
                              >
                                <AppText
                                  style={[
                                    styles.badgeText,
                                    { color: difficultyColor[action.difficulty] },
                                  ]}
                                >
                                  {difficultyLabel[action.difficulty]}
                                </AppText>
                              </View>
                              <View style={styles.badge}>
                                <AppText style={styles.badgeText}>
                                  {action.frequency === 'daily' ? t.planDaily : t.planWeekly}
                                </AppText>
                              </View>
                            </View>
                          </View>
                        </TouchableOpacity>
                        {!isLastInGroup && (
                          <View style={styles.divider} />
                        )}
                      </View>
                    );
                  })}
                </Card>
              </View>
            );
          })}

          <View style={{ height: 120 }} />
        </ScrollView>

        {/* Fixed CTA */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleCommit}
            activeOpacity={canCommit ? 0.9 : 1}
            style={[styles.ctaWrapper, !canCommit && styles.ctaDisabled]}
          >
            <LinearGradient
              colors={canCommit ? Gradients.primary : ['#C7C7CC', '#C7C7CC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.cta}
            >
              <Ionicons name="sparkles" size={18} color={Colors.white} />
              <AppText variant="bodyMedium" style={styles.ctaText}>
                {t.planCommit}
              </AppText>
              <AppText variant="caption" style={styles.ctaXp}>
                {t.planXpBonus}
              </AppText>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.base,
    paddingHorizontal: Spacing.xl,
  },
  loadingIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  loadingEmoji: { fontSize: 34 },
  loadingTitle: { fontWeight: '800', textAlign: 'center', color: Colors.charcoal },
  loadingSubtitle: { textAlign: 'center', lineHeight: 22 },
  dots: { flexDirection: 'row', gap: 8, marginTop: Spacing.md },
  dot: { width: 10, height: 10, borderRadius: 5 },

  // Results
  scroll: { paddingHorizontal: Spacing.base, paddingTop: Spacing.lg },
  titleBlock: { gap: Spacing.sm, marginBottom: Spacing.base },
  title: { fontWeight: '800', letterSpacing: -0.5, lineHeight: 38, color: Colors.charcoal },
  subtitle: { lineHeight: 22 },
  textRight: { textAlign: 'right', writingDirection: 'rtl' },

  bonusCard: { padding: 0, marginBottom: Spacing.base, overflow: 'hidden' },
  bonusGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
  },
  bonusText: { flex: 1, gap: 2 },
  bonusTitle: { color: Colors.white, fontWeight: '700' },
  bonusDesc: { color: 'rgba(255,255,255,0.8)', lineHeight: 14 },
  xpBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radii.full,
  },
  xpText: { color: Colors.white, fontWeight: '800', fontSize: 12 },

  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.base,
    paddingHorizontal: Spacing.xs,
  },
  counterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.muted,
  },
  counterDotActive: { backgroundColor: Colors.primaryBlue },
  counterDotWarn: { backgroundColor: '#FF9500' },

  group: { marginBottom: Spacing.lg },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  groupEmoji: { fontSize: 16 },
  groupLabel: {
    color: Colors.muted,
    fontWeight: '700',
    letterSpacing: 0.5,
    fontSize: 11,
  },

  actionList: { padding: 0, overflow: 'hidden' },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
  },
  actionRowSelected: {
    backgroundColor: Colors.blueLight,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: Colors.primaryBlue,
    borderColor: Colors.primaryBlue,
  },
  actionEmoji: { fontSize: 22 },
  actionText: { flex: 1, gap: 4 },
  actionTitle: { fontWeight: '600', color: Colors.charcoal },
  actionTitleSelected: { color: Colors.primaryBlue, fontWeight: '700' },
  badges: { flexDirection: 'row', gap: Spacing.xs, flexWrap: 'wrap' },
  badge: {
    backgroundColor: Colors.border + '55',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radii.full,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.muted,
    textTransform: 'uppercase',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: Spacing.base + 24 + 22 + Spacing.md * 2,
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.md,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  ctaWrapper: { borderRadius: Radii.xl, overflow: 'hidden', ...Shadows.md },
  ctaDisabled: { opacity: 0.5 },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
  },
  ctaText: { color: Colors.white, fontWeight: '700', fontSize: 17 },
  ctaXp: { color: 'rgba(255,255,255,0.75)', fontWeight: '700' },
});
