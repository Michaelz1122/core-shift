import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '@/store/useStore';
import { strings } from '@/constants/strings';
import { Colors, Spacing, Radii, Font } from '@/constants/theme';
import { generatePlan } from '@/utils/planEngine';
import type { Struggle, Goal, Action } from '@/types';

type Step = 'welcome' | 'goal' | 'sacrifice' | 'struggle' | 'plan';
const STEPS: Step[] = ['welcome', 'goal', 'sacrifice', 'struggle', 'plan'];

const GOAL_OPTIONS: { id: Goal; icon: keyof typeof Ionicons.glyphMap; bg: string }[] = [
  { id: 'work', icon: 'briefcase-outline', bg: '#D8E2FF' },
  { id: 'study', icon: 'book-outline', bg: '#DCE2F3' },
  { id: 'health', icon: 'fitness-outline', bg: '#FFDAD6' },
  { id: 'life_balance', icon: 'leaf-outline', bg: '#FFDBC9' },
];

const STRUGGLE_OPTIONS: { id: Struggle; icon: keyof typeof Ionicons.glyphMap; bg: string }[] = [
  { id: 'procrastination', icon: 'hourglass-outline', bg: '#E6E8F2' },
  { id: 'phone_addiction', icon: 'phone-portrait-outline', bg: '#E6E8F2' },
  { id: 'focus', icon: 'locate-outline', bg: '#E6E8F2' },
  { id: 'discipline', icon: 'flash-outline', bg: '#E6E8F2' },
  { id: 'consistency', icon: 'refresh-outline', bg: '#E6E8F2' },
];

const { width } = Dimensions.get('window');

export default function Onboarding() {
  const {
    language, setLanguage, struggle, setStruggle, goals, toggleGoal,
    completeOnboarding, darkMode
  } = useStore();
  const [step, setStep] = useState<Step>('welcome');
  const t = strings[language];
  const isRTL = language === 'ar';
  const stepIndex = STEPS.indexOf(step);

  // Plan Builder State
  const [customPlan, setCustomPlan] = useState<string[]>(['', '', '']);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const bg = darkMode ? Colors.bgDark : Colors.bg;
  const cardBg = darkMode ? Colors.cardDark : Colors.card;
  const borderColor = darkMode ? Colors.borderDark : Colors.border;
  const textColor = darkMode ? Colors.textDark : Colors.text;
  const textMuted = darkMode ? Colors.mutedDark : Colors.muted;

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
    } else if (step === 'goal' && goals.length > 0) {
      setStep('sacrifice');
    } else if (step === 'sacrifice') {
      setStep('struggle');
    } else if (step === 'struggle' && struggle) {
      setStep('plan');
    } else if (step === 'plan') {
      // Build Action objects from filled slots
      const filledSlots = customPlan.filter((text) => text.trim() !== '');
      if (filledSlots.length === 0) return;

      const finalActions: Action[] = filledSlots.map((text, i) => ({
        id: `custom_${Date.now()}_${i}`,
        title: text,
        titleAr: text,
        icon: 'checkmark-circle-outline',
        completed: false,
        duration: '5m',
      }));

      completeOnboarding(finalActions);
      router.replace('/today');
    }
  };

  const toggleLanguage = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const filledTaskCount = customPlan.filter((text) => text.trim() !== '').length;

  const canContinue =
    step === 'welcome' ||
    (step === 'goal' && goals.length > 0) ||
    step === 'sacrifice' ||
    (step === 'struggle' && struggle !== null) ||
    (step === 'plan' && filledTaskCount > 0);

  // Suggestions for Step 4 (use the first goal for suggestions if multiple)
  const suggestedActions = generatePlan(struggle, goals[0] || 'work');

  const addSuggestion = (actionText: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const emptyIndex = customPlan.findIndex((text) => text.trim() === '');
    if (emptyIndex !== -1) {
      const newPlan = [...customPlan];
      newPlan[emptyIndex] = actionText;
      setCustomPlan(newPlan);
    } else {
      // If no empty slots, append a new slot
      setCustomPlan([...customPlan, actionText]);
    }
  };

  const addNewSlot = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCustomPlan([...customPlan, '']);
    setEditingIndex(customPlan.length);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
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
          {/* Progress Bar (Visible on steps > 0) */}
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
              <Text style={[styles.progressLabel, { color: textMuted, textAlign: isRTL ? 'left' : 'right' }]}>
                {step === 'goal' ? t.stepGoal : step === 'sacrifice' ? t.stepSacrifice : step === 'struggle' ? t.stepStruggle : t.stepPlan}
              </Text>
            </View>
          )}

          {/* Step 0: Welcome Screen */}
          {step === 'welcome' && (
            <View style={styles.stepContainer}>
              <View style={styles.heroWrapper}>
                <View style={[styles.heroCard, { backgroundColor: cardBg, borderColor }]}>
                  <View style={[styles.geometricBg, { backgroundColor: Colors.primaryLight }]} />
                  <View style={styles.geometricFront}>
                    <Ionicons name="rocket-outline" size={40} color={Colors.primary} />
                  </View>
                </View>
              </View>

              <View style={styles.welcomeTextSection}>
                <Text style={[styles.welcomeTitle, { color: textColor, textAlign: isRTL ? 'right' : 'left' }]}>
                  {t.welcomeTitle}
                </Text>
                <Text style={[styles.welcomeSub, { color: textMuted, textAlign: isRTL ? 'right' : 'left' }]}>
                  {t.welcomeSub}
                </Text>
              </View>
            </View>
          )}

          {/* Step 1: Goal Selection */}
          {step === 'goal' && (
            <View style={styles.stepContainer}>
              <View style={styles.stepHeaderSection}>
                <Text style={[styles.stepTitle, { color: textColor, textAlign: isRTL ? 'right' : 'left' }]}>
                  {t.goalTitle}
                </Text>
                <Text style={[styles.stepSub, { color: textMuted, textAlign: isRTL ? 'right' : 'left' }]}>
                  {t.goalSub}
                </Text>
              </View>

              <View style={[styles.grid, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                {GOAL_OPTIONS.map((opt) => {
                  const selected = goals.includes(opt.id);
                  const optString = t.goals[opt.id];
                  return (
                    <TouchableOpacity
                      key={opt.id}
                      style={[
                        styles.goalCard,
                        {
                          backgroundColor: selected ? (darkMode ? '#1E293B' : '#F2F3FE') : cardBg,
                          borderColor: selected ? Colors.primary : borderColor,
                        },
                      ]}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        toggleGoal(opt.id);
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.cardIconWrapper, { backgroundColor: opt.bg }]}>
                        <Ionicons name={opt.icon} size={24} color={Colors.primary} />
                      </View>
                      <Text style={[styles.cardTitle, { color: textColor, textAlign: isRTL ? 'right' : 'left' }]}>
                        {optString.title}
                      </Text>
                      <Text style={[styles.cardDesc, { color: textMuted, textAlign: isRTL ? 'right' : 'left' }]}>
                        {optString.desc}
                      </Text>

                      {selected && (
                        <View style={[styles.checkCircle, { [isRTL ? 'left' : 'right']: Spacing.sm }]}>
                          <Text style={styles.checkText}>✓</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Step 2: Sacrifice Commitment */}
          {step === 'sacrifice' && (
            <View style={styles.stepContainer}>
              <View style={styles.sacrificeIconBox}>
                <Ionicons name="warning" size={64} color={Colors.danger} />
              </View>
              <View style={[styles.stepHeaderSection, { alignItems: 'center', marginTop: Spacing.xl }]}>
                <Text style={[styles.stepTitle, { color: textColor, textAlign: 'center' }]}>
                  {t.sacrificeTitle}
                </Text>
                <Text style={[styles.stepSub, { color: textMuted, textAlign: 'center', marginTop: Spacing.md, fontSize: 16, lineHeight: 24 }]}>
                  {t.sacrificeSub}
                </Text>
              </View>
            </View>
          )}

          {/* Step 3: Struggle Selection */}
          {step === 'struggle' && (
            <View style={styles.stepContainer}>
              <View style={styles.stepHeaderSection}>
                <Text style={[styles.stepTitle, { color: textColor, textAlign: isRTL ? 'right' : 'left' }]}>
                  {t.struggleTitle}
                </Text>
                <Text style={[styles.stepSub, { color: textMuted, textAlign: isRTL ? 'right' : 'left' }]}>
                  {t.struggleSub}
                </Text>
              </View>

              <View style={[styles.grid, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                {STRUGGLE_OPTIONS.map((opt) => {
                  const selected = struggle === opt.id;
                  const optString = t.struggles[opt.id];
                  const isConsistency = opt.id === 'consistency';

                  return (
                    <TouchableOpacity
                      key={opt.id}
                      style={[
                        styles.struggleCard,
                        isConsistency && styles.fullWidthCard,
                        {
                          backgroundColor: selected ? (darkMode ? '#1E293B' : '#F2F3FE') : cardBg,
                          borderColor: selected ? Colors.primary : borderColor,
                        },
                      ]}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setStruggle(opt.id);
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.iconRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                        <View style={[styles.cardIconWrapper, { backgroundColor: opt.bg, marginRight: isRTL ? 0 : Spacing.sm, marginLeft: isRTL ? Spacing.sm : 0 }]}>
                          <Ionicons name={opt.icon} size={24} color={Colors.primary} />
                        </View>
                        <View style={styles.flexOne}>
                          <Text style={[styles.cardTitle, { color: textColor, textAlign: isRTL ? 'right' : 'left' }]}>
                            {optString.title}
                          </Text>
                          <Text style={[styles.cardDesc, { color: textMuted, textAlign: isRTL ? 'right' : 'left' }]}>
                            {optString.desc}
                          </Text>
                        </View>
                        {selected && (
                          <View style={styles.checkCircleInline}>
                            <Text style={styles.checkText}>✓</Text>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Step 4: Plan Builder */}
          {step === 'plan' && (
            <View style={styles.stepContainer}>
              <View style={styles.stepHeaderSectionPlan}>
                <View style={[styles.sparkleIconBg, { backgroundColor: Colors.primaryLight }]}>
                  <Ionicons name="construct-outline" size={32} color={Colors.primary} />
                </View>
                <Text style={[styles.stepTitle, { color: textColor, textAlign: 'center' }]}>
                  {t.planTitle}
                </Text>
                <Text style={[styles.stepSub, { color: textMuted, textAlign: 'center' }]}>
                  {t.planSub}
                </Text>
              </View>

              {/* Editable Slots */}
              <View style={styles.planList}>
                {customPlan.map((text, index) => (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.8}
                    style={[
                      styles.planSlotCard,
                      { backgroundColor: cardBg, borderColor: text ? Colors.primary : borderColor },
                    ]}
                    onPress={() => setEditingIndex(index)}
                  >
                    <View style={[styles.slotRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                      <View style={[styles.slotNumber, { backgroundColor: text ? Colors.primaryLight : borderColor }]}>
                        <Text style={[styles.slotNumText, { color: text ? Colors.primary : textMuted }]}>
                          {index + 1}
                        </Text>
                      </View>

                      {editingIndex === index ? (
                        <TextInput
                          style={[styles.slotInput, { color: textColor, textAlign: isRTL ? 'right' : 'left' }]}
                          value={text}
                          onChangeText={(val) => {
                            const newPlan = [...customPlan];
                            newPlan[index] = val;
                            setCustomPlan(newPlan);
                          }}
                          placeholder={t.planBuilderCustomPlaceholder}
                          placeholderTextColor={textMuted}
                          autoFocus
                          onBlur={() => setEditingIndex(null)}
                          returnKeyType="done"
                        />
                      ) : (
                        <Text
                          style={[
                            styles.slotText,
                            { color: text ? textColor : textMuted, textAlign: isRTL ? 'right' : 'left' },
                          ]}
                        >
                          {text || t.planBuilderCustomPlaceholder}
                        </Text>
                      )}

                      {text !== '' && editingIndex !== index && (
                        <TouchableOpacity
                          onPress={() => {
                            const newPlan = [...customPlan];
                            newPlan[index] = '';
                            setCustomPlan(newPlan);
                          }}
                        >
                          <Ionicons name="close-circle" size={20} color={textMuted} />
                        </TouchableOpacity>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}

                {customPlan.length > 4 && (
                  <View style={[styles.warningBox, { backgroundColor: '#FEF2F2', borderColor: '#FCA5A5' }]}>
                    <Ionicons name="information-circle" size={20} color="#DC2626" />
                    <Text style={[styles.warningText, { color: '#991B1B', textAlign: isRTL ? 'right' : 'left' }]}>
                      {t.maxTasksWarning}
                    </Text>
                  </View>
                )}

                <TouchableOpacity
                  style={[styles.addSlotBtn, { borderColor, borderStyle: 'dashed' }]}
                  onPress={addNewSlot}
                  activeOpacity={0.7}
                >
                  <Ionicons name="add" size={20} color={textMuted} />
                  <Text style={[styles.addSlotText, { color: textMuted }]}>{t.addTask}</Text>
                </TouchableOpacity>
              </View>

              {/* Suggestions */}
              <View style={styles.suggestionsSection}>
                <Text style={[styles.suggestionsTitle, { color: textColor, textAlign: isRTL ? 'right' : 'left' }]}>
                  {t.planBuilderSuggestions}
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.suggestionsScroll, isRTL && { flexDirection: 'row-reverse' }]}>
                  {suggestedActions.map((action, idx) => {
                    const actionText = isRTL ? action.titleAr : action.title;
                    return (
                      <TouchableOpacity
                        key={idx}
                        style={[styles.suggestionPill, { backgroundColor: darkMode ? '#1E293B' : '#F2F3FE', borderColor: Colors.primary }]}
                        onPress={() => addSuggestion(actionText)}
                      >
                        <Ionicons name="add" size={16} color={Colors.primary} />
                        <Text style={[styles.suggestionText, { color: Colors.primary }]}>{actionText}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Footer / CTA Section */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.ctaBtn,
              step === 'sacrifice' && { backgroundColor: Colors.danger, shadowColor: Colors.danger },
              !canContinue && styles.ctaBtnDisabled,
            ]}
            onPress={handleNext}
            disabled={!canContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.ctaBtnText}>
              {step === 'welcome'
                ? t.getStarted
                : step === 'sacrifice'
                ? t.sacrificeAccept
                : step === 'plan'
                ? t.planStart
                : isRTL
                ? 'استمرار ←'
                : 'Continue →'}
            </Text>
          </TouchableOpacity>

          {/* Welcome indicator dots */}
          {step === 'welcome' && (
            <View style={styles.dotsRow}>
              <View style={[styles.dot, styles.dotActive, { backgroundColor: Colors.primary }]} />
              <View style={[styles.dot, styles.dotInactive, { backgroundColor: borderColor }]} />
              <View style={[styles.dot, styles.dotInactive, { backgroundColor: borderColor }]} />
              <View style={[styles.dot, styles.dotInactive, { backgroundColor: borderColor }]} />
            </View>
          )}
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
  headerBtn: {
    width: 40,
    justifyContent: 'center',
  },
  backText: {
    fontFamily: Font.bold,
    fontSize: 22,
  },
  headerTitle: {
    fontFamily: Font.bold,
    fontSize: 20,
  },
  langBtn: {
    width: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  langText: {
    fontFamily: Font.semibold,
    fontSize: 15,
  },

  scroll: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    paddingBottom: 160,
  },

  progressSection: {
    marginBottom: Spacing.lg,
  },
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
  progressLabel: {
    fontFamily: Font.medium,
    fontSize: 12,
  },

  stepContainer: {
    flex: 1,
    marginTop: Spacing.sm,
  },

  /* Step 0: Welcome */
  heroWrapper: {
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  heroCard: {
    width: width * 0.7,
    aspectRatio: 1,
    borderRadius: 32,
    borderWidth: 1.5,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  geometricBg: {
    position: 'absolute',
    width: '120%',
    height: '120%',
    transform: [{ rotate: '45deg' }],
    borderRadius: 80,
  },
  geometricFront: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  welcomeTextSection: {
    marginVertical: Spacing.md,
    gap: Spacing.md,
  },
  welcomeTitle: {
    fontFamily: Font.bold,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.8,
  },
  welcomeSub: {
    fontFamily: Font.regular,
    fontSize: 16,
    lineHeight: 24,
  },

  /* Step Headers */
  stepHeaderSection: {
    marginBottom: Spacing.xl,
    gap: Spacing.xs,
  },
  stepTitle: {
    fontFamily: Font.bold,
    fontSize: 26,
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  stepSub: {
    fontFamily: Font.regular,
    fontSize: 15,
    lineHeight: 22,
  },

  /* Sacrifice Step */
  sacrificeIconBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xxl,
  },

  /* Step 1 & 3: Selection Grids */
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  goalCard: {
    width: '47%',
    aspectRatio: 0.95,
    padding: Spacing.md,
    borderRadius: 24,
    borderWidth: 1.5,
    justifyContent: 'flex-start',
    position: 'relative',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontFamily: Font.bold,
    fontSize: 16,
    marginBottom: 4,
  },
  cardDesc: {
    fontFamily: Font.regular,
    fontSize: 12,
    lineHeight: 16,
  },
  checkCircle: {
    position: 'absolute',
    top: Spacing.sm,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircleInline: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: Font.bold,
  },

  struggleCard: {
    width: '100%',
    padding: Spacing.md,
    borderRadius: 16,
    borderWidth: 1.5,
    marginBottom: 2,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  fullWidthCard: {
    width: '100%',
  },
  iconRow: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  flexOne: {
    flex: 1,
  },

  /* Step 4: Plan Builder */
  stepHeaderSectionPlan: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    gap: Spacing.xs,
  },
  sparkleIconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  planList: {
    gap: Spacing.md,
  },
  planSlotCard: {
    borderWidth: 1.5,
    borderRadius: 16,
    padding: Spacing.md,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  slotRow: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  slotNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slotNumText: {
    fontFamily: Font.bold,
    fontSize: 13,
  },
  slotText: {
    flex: 1,
    fontFamily: Font.semibold,
    fontSize: 15,
  },
  slotInput: {
    flex: 1,
    fontFamily: Font.semibold,
    fontSize: 15,
    padding: 0,
    margin: 0,
  },
  addSlotBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    borderRadius: 16,
    borderWidth: 1.5,
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  addSlotText: {
    fontFamily: Font.semibold,
    fontSize: 14,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  warningText: {
    flex: 1,
    fontFamily: Font.regular,
    fontSize: 13,
    lineHeight: 18,
  },

  suggestionsSection: {
    marginTop: Spacing.xl,
  },
  suggestionsTitle: {
    fontFamily: Font.bold,
    fontSize: 14,
    marginBottom: Spacing.md,
  },
  suggestionsScroll: {
    paddingVertical: Spacing.xs,
    gap: Spacing.sm,
  },
  suggestionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  suggestionText: {
    fontFamily: Font.semibold,
    fontSize: 13,
  },

  /* Footer / CTA styling */
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  ctaBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 30,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  ctaBtnDisabled: {
    opacity: 0.5,
  },
  ctaBtnText: {
    color: '#FFFFFF',
    fontFamily: Font.bold,
    fontSize: 17,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: Spacing.xs,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
  },
  dotInactive: {
    width: 8,
  },
});
