import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useStore, getLocalDateStr } from '@/store/useStore';
import { strings } from '@/constants/strings';
import { Colors, Spacing, Font } from '@/constants/theme';
import type { Goal, Action } from '@/types';

type Step = 'welcome' | 'goal' | 'action';
const STEPS: Step[] = ['welcome', 'goal', 'action'];

const { width } = Dimensions.get('window');

export default function Onboarding() {
  const {
    language, setLanguage,
    completeOnboarding, darkMode
  } = useStore();
  
  const [step, setStep] = useState<Step>('welcome');
  const t = strings[language];
  const isRTL = language === 'ar';
  const stepIndex = STEPS.indexOf(step);

  const [goalTitle, setGoalTitle] = useState('');
  const [actionTitle, setActionTitle] = useState('');

  const bg = darkMode ? '#000000' : '#FFFFFF';
  const cardBg = darkMode ? '#111111' : '#F9F9F9';
  const borderColor = darkMode ? '#222222' : '#EAEAEA';
  const textColor = darkMode ? '#FFFFFF' : '#000000';
  const textMuted = darkMode ? '#888888' : '#666666';

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (stepIndex > 0) {
      setStep(STEPS[stepIndex - 1]);
    }
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (step === 'welcome') {
      setStep('goal');
    } else if (step === 'goal' && goalTitle.trim().length > 0) {
      setStep('action');
    } else if (step === 'action' && actionTitle.trim().length > 0) {
      const initialGoal: Goal = {
        id: `goal_${Date.now()}`,
        title: goalTitle.trim(),
        icon: 'flag',
        createdAt: new Date().toISOString(),
        order: 0,
        archived: false,
      };

      const initialAction: Action = {
        id: `action_${Date.now()}`,
        goalId: initialGoal.id,
        title: actionTitle.trim(),
        isCompleted: false,
        date: getLocalDateStr(),
        order: 0,
      };

      completeOnboarding(initialGoal, initialAction);
      router.replace('/today');
    }
  };

  const toggleLanguage = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const canContinue =
    step === 'welcome' ||
    (step === 'goal' && goalTitle.trim().length > 0) ||
    (step === 'action' && actionTitle.trim().length > 0);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Header */}
        <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          {stepIndex > 0 ? (
            <TouchableOpacity onPress={handleBack} style={styles.headerBtn}>
              <Text style={[styles.backText, { color: textColor }]}>{isRTL ? '→' : '←'}</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.headerBtn} />
          )}

          <Text style={[styles.headerTitle, { color: Colors.primary }]}>CoreShift</Text>

          <TouchableOpacity onPress={toggleLanguage} style={styles.langBtn}>
            <Text style={[styles.langText, { color: textColor }]}>
              {language === 'en' ? 'عر' : 'EN'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {/* Progress Bar */}
          {stepIndex > 0 && (
            <View style={styles.progressSection}>
              <View style={[styles.progressTrack, { backgroundColor: borderColor }]}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${(stepIndex / (STEPS.length - 1)) * 100}%`,
                      left: isRTL ? undefined : 0,
                      right: isRTL ? 0 : undefined,
                    },
                  ]}
                />
              </View>
            </View>
          )}

          {/* Step 0: Welcome Screen */}
          {step === 'welcome' && (
            <View style={styles.stepContainer}>
              <View style={styles.heroWrapper}>
                <View style={[styles.heroCard, { backgroundColor: cardBg, borderColor }]}>
                  <Ionicons name="leaf" size={60} color={Colors.primary} />
                </View>
              </View>

              <View style={styles.welcomeTextSection}>
                <Text style={[styles.welcomeTitle, { color: textColor, textAlign: isRTL ? 'right' : 'left' }]}>
                  {isRTL ? 'مرحباً بك في نظام نموك الشخصي.' : 'Welcome to your growth system.'}
                </Text>
                <Text style={[styles.welcomeSub, { color: textMuted, textAlign: isRTL ? 'right' : 'left' }]}>
                  {isRTL ? 'كورشيفت هيساعدك تتابع أهدافك، تحافظ على استمراريتك، وترجع للمسار لو اتعطلت.' : 'CoreShift helps you track goals, build consistency, and recover when you fall off track.'}
                </Text>
              </View>
            </View>
          )}

          {/* Step 1: Create Goal */}
          {step === 'goal' && (
            <View style={styles.stepContainer}>
              <View style={styles.stepHeaderSection}>
                <Text style={[styles.stepTitle, { color: textColor, textAlign: isRTL ? 'right' : 'left' }]}>
                  {isRTL ? 'إيه هو أهم هدف عندك دلوقتي؟' : 'What is your most important goal right now?'}
                </Text>
                <Text style={[styles.stepSub, { color: textMuted, textAlign: isRTL ? 'right' : 'left' }]}>
                  {isRTL ? 'مثال: أتعلم لغة جديدة، أخسر وزن، أقرأ أكتر.' : 'Example: Learn a new language, get fit, read more.'}
                </Text>
              </View>

              <View style={[styles.inputWrapper, { backgroundColor: cardBg, borderColor }]}>
                <TextInput
                  style={[styles.input, { color: textColor, textAlign: isRTL ? 'right' : 'left' }]}
                  placeholder={isRTL ? 'أكتب هدفك هنا...' : 'Enter your goal...'}
                  placeholderTextColor={textMuted}
                  value={goalTitle}
                  onChangeText={setGoalTitle}
                  autoFocus
                />
              </View>
            </View>
          )}

          {/* Step 2: Create Action */}
          {step === 'action' && (
            <View style={styles.stepContainer}>
              <View style={styles.stepHeaderSection}>
                <Text style={[styles.stepTitle, { color: textColor, textAlign: isRTL ? 'right' : 'left' }]}>
                  {isRTL ? 'إيه المهمة الصغيرة اللي ممكن تعملها النهاردة؟' : 'What is one small action you can take today?'}
                </Text>
                <Text style={[styles.stepSub, { color: textMuted, textAlign: isRTL ? 'right' : 'left' }]}>
                  {isRTL ? 'خطوة واحدة بس تقربك للهدف ده.' : 'Just one simple step toward your goal.'}
                </Text>
              </View>

              <View style={[styles.inputWrapper, { backgroundColor: cardBg, borderColor }]}>
                <TextInput
                  style={[styles.input, { color: textColor, textAlign: isRTL ? 'right' : 'left' }]}
                  placeholder={isRTL ? 'مثال: أقرأ ١٠ صفحات' : 'Example: Read 10 pages'}
                  placeholderTextColor={textMuted}
                  value={actionTitle}
                  onChangeText={setActionTitle}
                  autoFocus
                />
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.ctaBtn,
              !canContinue && styles.ctaBtnDisabled,
            ]}
            onPress={handleNext}
            disabled={!canContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.ctaBtnText}>
              {step === 'welcome'
                ? t.getStarted
                : isRTL
                ? 'استمرار ←'
                : 'Continue →'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
  },
  headerBtn: { width: 40, justifyContent: 'center' },
  backText: { fontFamily: Font.bold, fontSize: 22 },
  headerTitle: { fontFamily: Font.bold, fontSize: 20 },
  langBtn: { width: 40, alignItems: 'flex-end', justifyContent: 'center' },
  langText: { fontFamily: Font.semibold, fontSize: 15 },
  scroll: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    paddingBottom: 160,
  },
  progressSection: { marginBottom: Spacing.lg },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: Spacing.xs,
  },
  progressFill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  stepContainer: { flex: 1, marginTop: Spacing.sm },
  heroWrapper: { alignItems: 'center', marginVertical: Spacing.xl },
  heroCard: {
    width: width * 0.5,
    aspectRatio: 1,
    borderRadius: 32,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeTextSection: { marginVertical: Spacing.md, gap: Spacing.md },
  welcomeTitle: {
    fontFamily: Font.bold,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.8,
  },
  welcomeSub: { fontFamily: Font.regular, fontSize: 16, lineHeight: 24 },
  stepHeaderSection: { marginBottom: Spacing.xl, gap: Spacing.xs },
  stepTitle: {
    fontFamily: Font.bold,
    fontSize: 26,
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  stepSub: { fontFamily: Font.regular, fontSize: 15, lineHeight: 22 },
  inputWrapper: {
    borderWidth: 1.5,
    borderRadius: 16,
    padding: Spacing.lg,
  },
  input: {
    fontFamily: Font.semibold,
    fontSize: 18,
    padding: 0,
    margin: 0,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  ctaBtn: {
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaBtnDisabled: { opacity: 0.5 },
  ctaBtnText: { color: '#FFFFFF', fontFamily: Font.bold, fontSize: 18 },
});
