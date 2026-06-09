import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useStore } from '@/store/useStore';
import { strings } from '@/constants/strings';
import { Colors, Spacing, Radii, Font } from '@/constants/theme';
import type { Struggle, Goal, Language } from '@/types';

type Step = 'language' | 'struggle' | 'goal';
const STEPS: Step[] = ['language', 'struggle', 'goal'];

const STRUGGLES: Struggle[] = ['procrastination', 'phone_addiction', 'focus', 'discipline', 'consistency'];
const GOALS: Goal[] = ['work', 'study', 'health', 'life_balance'];

const STRUGGLE_EMOJI: Record<Struggle, string> = {
  procrastination: '⏳',
  phone_addiction: '📱',
  focus: '🎯',
  discipline: '⚡',
  consistency: '🔄',
};

const GOAL_EMOJI: Record<Goal, string> = {
  work: '💼',
  study: '📚',
  health: '💪',
  life_balance: '⚖️',
};

export default function Onboarding() {
  const { language, setLanguage, setStruggle, setGoal, struggle, goal, completeOnboarding, darkMode } = useStore();
  const [step, setStep] = useState<Step>('language');
  const t = strings[language];
  const isRTL = language === 'ar';
  const stepIndex = STEPS.indexOf(step);

  const bg = darkMode ? Colors.bgDark : Colors.bg;
  const cardBg = darkMode ? Colors.cardDark : Colors.card;
  const borderColor = darkMode ? Colors.borderDark : Colors.border;
  const textColor = darkMode ? Colors.textDark : Colors.text;

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (stepIndex > 0) {
      setStep(STEPS[stepIndex - 1]);
    }
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (step === 'language') {
      setStep('struggle');
    } else if (step === 'struggle' && struggle) {
      setStep('goal');
    } else if (step === 'goal' && goal) {
      completeOnboarding();
      router.replace('/today');
    }
  };

  const canContinue =
    step === 'language' ||
    (step === 'struggle' && struggle !== null) ||
    (step === 'goal' && goal !== null);

  // Step-specific title
  const stepTitle =
    step === 'language' ? (isRTL ? 'اختر لغتك' : 'Choose your language') :
    step === 'struggle' ? t.struggleTitle :
    t.goalTitle;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <View style={styles.container}>
        {/* Top bar: back + step dots */}
        <View style={styles.topBar}>
          {stepIndex > 0 ? (
            <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
              <Text style={[styles.backArrow, { color: textColor }]}>←</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.backBtn} />
          )}

          {/* Step indicator */}
          <View style={styles.dots}>
            {STEPS.map((s, i) => (
              <View
                key={s}
                style={[
                  styles.dot,
                  i <= stepIndex ? styles.dotActive : styles.dotInactive,
                  { backgroundColor: i <= stepIndex ? Colors.primary : borderColor },
                ]}
              />
            ))}
          </View>

          <View style={styles.backBtn} />
        </View>

        {/* Question */}
        <View style={styles.questionArea}>
          <Text style={[styles.questionTitle, { color: textColor, textAlign: isRTL ? 'right' : 'left' }]}>
            {stepTitle}
          </Text>
        </View>

        {/* Options */}
        <View style={styles.optionsList}>
          {step === 'language' && (
            <>
              {(['en', 'ar'] as Language[]).map((lang) => {
                const selected = language === lang;
                return (
                  <TouchableOpacity
                    key={lang}
                    style={[
                      styles.optionCard,
                      { backgroundColor: cardBg, borderColor: selected ? Colors.primary : borderColor },
                    ]}
                    onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setLanguage(lang); }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.optionEmoji}>{lang === 'ar' ? '🇪🇬' : '🌍'}</Text>
                    <Text style={[styles.optionLabel, { color: selected ? Colors.primary : textColor }]}>
                      {lang === 'ar' ? 'العربية' : 'English'}
                    </Text>
                    {selected && <Text style={styles.check}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </>
          )}

          {step === 'struggle' && STRUGGLES.map((s) => {
            const selected = struggle === s;
            return (
              <TouchableOpacity
                key={s}
                style={[
                  styles.optionCard,
                  { backgroundColor: cardBg, borderColor: selected ? Colors.primary : borderColor },
                ]}
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setStruggle(s); }}
                activeOpacity={0.7}
              >
                <Text style={styles.optionEmoji}>{STRUGGLE_EMOJI[s]}</Text>
                <Text style={[styles.optionLabel, { color: selected ? Colors.primary : textColor }]}>
                  {t.struggles[s]}
                </Text>
                {selected && <Text style={styles.check}>✓</Text>}
              </TouchableOpacity>
            );
          })}

          {step === 'goal' && GOALS.map((g) => {
            const selected = goal === g;
            return (
              <TouchableOpacity
                key={g}
                style={[
                  styles.optionCard,
                  { backgroundColor: cardBg, borderColor: selected ? Colors.primary : borderColor },
                ]}
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setGoal(g); }}
                activeOpacity={0.7}
              >
                <Text style={styles.optionEmoji}>{GOAL_EMOJI[g]}</Text>
                <Text style={[styles.optionLabel, { color: selected ? Colors.primary : textColor }]}>
                  {t.goals[g]}
                </Text>
                {selected && <Text style={styles.check}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={[styles.cta, !canContinue && styles.ctaDisabled]}
          onPress={handleNext}
          disabled={!canContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.ctaText}>
            {step === 'goal' ? t.start : t.next}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  backArrow: { fontFamily: Font.bold, fontSize: 22 },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { height: 6, borderRadius: 3 },
  dotActive: { width: 20 },
  dotInactive: { width: 12 },

  questionArea: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  questionTitle: {
    fontFamily: Font.bold,
    fontSize: 24,
    letterSpacing: -0.3,
    lineHeight: 32,
  },
  optionsList: { flex: 1, gap: Spacing.sm },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    borderRadius: Radii.lg,
    borderWidth: 2,
    gap: Spacing.md,
  },
  optionEmoji: { fontSize: 24 },
  optionLabel: {
    flex: 1,
    fontFamily: Font.semibold,
    fontSize: 16,
  },
  check: {
    fontFamily: Font.bold,
    fontSize: 16,
    color: Colors.primary,
  },
  cta: {
    backgroundColor: Colors.primary,
    borderRadius: Radii.lg,
    paddingVertical: Spacing.base,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    marginTop: Spacing.base,
  },
  ctaDisabled: { opacity: 0.4 },
  ctaText: {
    fontFamily: Font.bold,
    fontSize: 17,
    color: Colors.white,
  },
});
