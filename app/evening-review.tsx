import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import * as StoreReview from 'expo-store-review';
import { Ionicons } from '@expo/vector-icons';
import { useStore, getLocalDateStr } from '@/store/useStore';
import { Colors, Spacing, Font } from '@/constants/theme';

type Step = 'summary' | 'prepare';

export default function EveningReview() {
  const {
    language, goals, actions, history, darkMode, completeEveningReview, streak,
    hasShownReview, setHasShownReview
  } = useStore();
  
  const isRTL = language === 'ar';
  const [step, setStep] = useState<Step>('summary');

  const todayStr = getLocalDateStr();
  const todayStats = history[todayStr] || { completedActions: 0, totalActions: 0, completionRate: 0 };
  const { completedActions, totalActions, completionRate } = todayStats;

  // Let's create tomorrow's string
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = getLocalDateStr(tomorrow);
  
  // We won't build a complex tomorrow planner here to save code space, 
  // but we can show them the goals and they can tap to add actions if they want.
  // For simplicity, let's just acknowledge progress.

  const bg = darkMode ? '#000000' : '#FFFFFF';
  const cardBg = darkMode ? '#111111' : '#F9F9F9';
  const borderColor = darkMode ? '#222222' : '#EAEAEA';
  const textColor = darkMode ? '#FFFFFF' : '#000000';
  const textMuted = darkMode ? '#888888' : '#666666';

  const handleComplete = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    completeEveningReview(todayStr);

    // Calculate historical completions
    const totalHistoricalCompleted = Object.values(history).reduce((sum, day) => sum + day.completedActions, 0);

    // Store Review Trigger
    if (!hasShownReview && (completionRate > 0 || totalHistoricalCompleted >= 10)) {
      try {
        const hasAction = await StoreReview.hasAction();
        if (hasAction) {
          await StoreReview.requestReview();
          setHasShownReview(true);
        }
      } catch (err) {
        console.warn("Store review error", err);
      }
    }

    router.back();
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]} edges={['top', 'bottom']}>
      
      {/* Header */}
      <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
        >
          <Ionicons name="close" size={28} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>
          {isRTL ? 'المراجعة المسائية' : 'Evening Review'}
        </Text>
        <View style={styles.headerBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        {step === 'summary' && (
          <View style={styles.stepContainer}>
            <View style={styles.iconCircle}>
              <Ionicons name="moon" size={48} color="#4F46E5" />
            </View>
            <Text style={[styles.stepTitle, { color: textColor, textAlign: 'center' }]}>
              {isRTL ? 'يوم آخر ينقضي.' : 'Another day complete.'}
            </Text>
            
            <View style={[styles.statsCard, { backgroundColor: cardBg, borderColor }]}>
              <View style={styles.statRow}>
                <Text style={[styles.statValue, { color: textColor }]}>{Math.round(completionRate * 100)}%</Text>
                <Text style={[styles.statLabel, { color: textMuted }]}>{isRTL ? 'معدل الإنجاز' : 'Completion Rate'}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statRow}>
                <Text style={[styles.statValue, { color: textColor }]}>{completedActions}/{totalActions}</Text>
                <Text style={[styles.statLabel, { color: textMuted }]}>{isRTL ? 'مهام مكتملة' : 'Tasks Done'}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statRow}>
                <Text style={[styles.statValue, { color: '#F59E0B' }]}>{streak} 🔥</Text>
                <Text style={[styles.statLabel, { color: textMuted }]}>{isRTL ? 'أيام متتالية' : 'Day Streak'}</Text>
              </View>
            </View>
            
            <Text style={[styles.reflectionText, { color: textMuted, textAlign: 'center' }]}>
              {completionRate === 1 
                ? (isRTL ? 'أداء مثالي اليوم! استمر على هذا المنوال.' : 'Perfect execution today! Keep the momentum going.')
                : completionRate > 0.5 
                ? (isRTL ? 'يوم جيد جداً. التقدم هو الأهم وليس المثالية.' : 'Solid day. Progress matters more than perfection.')
                : (isRTL ? 'بعض الأيام أصعب من غيرها. الأهم أنك حاولت.' : 'Some days are harder than others. What matters is you showed up.')}
            </Text>
          </View>
        )}

        {step === 'prepare' && (
          <View style={styles.stepContainer}>
            <View style={[styles.iconCircle, { backgroundColor: '#DBEAFE' }]}>
              <Ionicons name="sunny" size={48} color={Colors.primary} />
            </View>
            <Text style={[styles.stepTitle, { color: textColor, textAlign: 'center' }]}>
              {isRTL ? 'التحضير لغدٍ أفضل' : 'Prepare for Tomorrow'}
            </Text>
            <Text style={[styles.reflectionText, { color: textMuted, textAlign: 'center' }]}>
              {isRTL 
                ? 'لكي تحافظ على الزخم، تأكد من إضافة مهامك للغد في صفحة "أهدافي" قبل النوم.' 
                : 'To maintain momentum, make sure to add your actions for tomorrow in the Goals tab before you sleep.'}
            </Text>

            <View style={styles.goalsList}>
              {goals.filter(g => !g.archived).map(goal => (
                <View key={goal.id} style={[styles.goalItem, { backgroundColor: cardBg, borderColor, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <Ionicons name={goal.icon as any} size={20} color={Colors.primary} />
                  <Text style={[styles.goalItemText, { color: textColor, textAlign: isRTL ? 'right' : 'left' }]}>{goal.title}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

      </ScrollView>

      <View style={styles.footer}>
        {step === 'summary' ? (
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setStep('prepare');
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.ctaBtnText}>{isRTL ? 'الخطوة التالية ←' : 'Next Step →'}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.ctaBtn, { backgroundColor: Colors.success }]}
            onPress={handleComplete}
            activeOpacity={0.8}
          >
            <Text style={styles.ctaBtnText}>{isRTL ? 'إكمال المراجعة ✓' : 'Complete Review ✓'}</Text>
          </TouchableOpacity>
        )}
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
  },
  headerBtn: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { fontFamily: Font.bold, fontSize: 18 },
  scroll: {
    padding: Spacing.xl,
    flexGrow: 1,
    justifyContent: 'center',
  },
  stepContainer: {
    alignItems: 'center',
    gap: Spacing.xl,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepTitle: {
    fontFamily: Font.bold,
    fontSize: 28,
    letterSpacing: -0.5,
  },
  statsCard: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: 20,
    borderWidth: 1,
  },
  statRow: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontFamily: Font.bold,
    fontSize: 24,
  },
  statLabel: {
    fontFamily: Font.medium,
    fontSize: 12,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#33333330',
  },
  reflectionText: {
    fontFamily: Font.medium,
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: Spacing.lg,
  },
  goalsList: {
    width: '100%',
    gap: Spacing.md,
  },
  goalItem: {
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    gap: Spacing.md,
  },
  goalItemText: {
    flex: 1,
    fontFamily: Font.semibold,
    fontSize: 16,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  ctaBtn: {
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4F46E5', // Indigo for review
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaBtnText: { color: '#FFFFFF', fontFamily: Font.bold, fontSize: 18 },
});
