import { useState, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import AppText from '@/components/ui/AppText';
import { useAppStore } from '@/store/useAppStore';
import { buildQuizQuestions } from '@/data/quizQuestions';
import { Colors, Spacing, Radii, Gradients, Shadows } from '@/constants/theme';
import { useTranslation } from '@/i18n';

export default function QuizScreen() {
  const { t, language, isRTL } = useTranslation();
  const { selectedChallengeIds, setQuizAnswers } = useAppStore();

  // Build the question list based on user's selected challenges
  const questions = useMemo(
    () => buildQuizQuestions(selectedChallengeIds),
    [selectedChallengeIds]
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const currentQuestion = questions[currentIndex];
  const selectedOption = answers[currentQuestion?.id ?? ''];
  const isLast = currentIndex === questions.length - 1;
  const progress = (currentIndex + 1) / questions.length;

  const handleSelectOption = (optionId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }));
  };

  const handleNext = () => {
    if (!selectedOption) return;

    if (isLast) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setQuizAnswers(answers);
      router.push('/onboarding/plan');
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setCurrentIndex((i) => i + 1);
    }
  };

  if (!currentQuestion) return null;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Fixed header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (currentIndex === 0) router.back();
            else setCurrentIndex((i) => i - 1);
          }}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.charcoal} />
        </TouchableOpacity>

        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <LinearGradient
            colors={Gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressFill, { width: `${progress * 100}%` }]}
          />
        </View>

        <AppText variant="caption" color="muted" style={styles.stepLabel}>
          {currentIndex + 1}/{questions.length}
        </AppText>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Step label */}
        <AppText variant="label" color="primaryBlue" style={isRTL ? styles.textRight : undefined}>
          {language === 'ar'
            ? `خطوة ٣ من ٤ · ${t.quizQuestion} ${currentIndex + 1}`
            : `Step 3 of 4 · Question ${currentIndex + 1}`}
        </AppText>

        {/* Question text */}
        <AppText
          variant="h1"
          style={[styles.question, isRTL && styles.textRight]}
        >
          {currentQuestion.text[language]}
        </AppText>

        {/* Options */}
        <View style={styles.options}>
          {currentQuestion.options.map((option) => {
            const selected = selectedOption === option.id;
            return (
              <TouchableOpacity
                key={option.id}
                onPress={() => handleSelectOption(option.id)}
                activeOpacity={0.8}
                style={[
                  styles.option,
                  selected && styles.optionSelected,
                ]}
              >
                {/* Radio circle */}
                <View style={[styles.radio, selected && styles.radioSelected]}>
                  {selected && <View style={styles.radioDot} />}
                </View>

                <AppText
                  variant="bodyMedium"
                  style={[
                    styles.optionLabel,
                    selected && styles.optionLabelSelected,
                    isRTL && styles.textRight,
                  ]}
                >
                  {option.label[language]}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Fixed CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleNext}
          activeOpacity={selectedOption ? 0.9 : 1}
          style={[styles.ctaWrapper, !selectedOption && styles.ctaDisabled]}
        >
          <LinearGradient
            colors={selectedOption ? Gradients.primary : ['#C7C7CC', '#C7C7CC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.cta}
          >
            <AppText variant="bodyMedium" style={styles.ctaText}>
              {isLast
                ? language === 'ar' ? 'بناء خطتي' : 'Build My Plan'
                : t.continue}
            </AppText>
            <Ionicons
              name={isLast ? 'sparkles' : isRTL ? 'arrow-back' : 'arrow-forward'}
              size={18}
              color={Colors.white}
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  backBtn: { width: 36, alignItems: 'center' },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: Radii.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: Radii.full,
  },
  stepLabel: { width: 32, textAlign: 'right' },

  scroll: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
  },
  question: {
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 38,
    color: Colors.charcoal,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  textRight: { textAlign: 'right', writingDirection: 'rtl' },

  options: { gap: Spacing.sm },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radii.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
    ...Shadows.sm,
  },
  optionSelected: {
    borderColor: Colors.primaryBlue,
    backgroundColor: Colors.blueLight,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: { borderColor: Colors.primaryBlue },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primaryBlue,
  },
  optionLabel: { flex: 1, color: Colors.charcoal, fontWeight: '500' },
  optionLabelSelected: { color: Colors.primaryBlue, fontWeight: '700' },

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
});
