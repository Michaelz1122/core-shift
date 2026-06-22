import { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform, UIManager } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useStore, getLocalDateStr } from '@/store/useStore';
import { Colors, Spacing, Font } from '@/constants/theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Today() {
  const {
    language, goals, actions, history,
    checkNewDay, darkMode, toggleActionCompletion
  } = useStore();
  
  const isRTL = language === 'ar';

  useEffect(() => {
    checkNewDay();
  }, []);

  const todayStr = getLocalDateStr();
  const todayStats = history[todayStr] || { completedActions: 0, totalActions: 0, completionRate: 0 };
  const { completedActions, completionRate } = todayStats;
  
  const todayActions = actions[todayStr] || [];

  const bg = darkMode ? '#000000' : '#FFFFFF';
  const cardBg = darkMode ? '#111111' : '#F9F9F9';
  const borderColor = darkMode ? '#222222' : '#EAEAEA';
  const textColor = darkMode ? '#FFFFFF' : '#000000';
  const textMuted = darkMode ? '#888888' : '#666666';

  const hour = new Date().getHours();
  const isEvening = hour >= 17;

  const handleToggle = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleActionCompletion(todayStr, id);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]} edges={['top', 'left', 'right']}>
      {/* TopAppBar */}
      <View style={[styles.topAppBar, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <View style={styles.topBtnPlaceholder} />
        <Text style={[styles.appTitle, { color: textColor }]}>CoreShift</Text>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push('/settings');
          }}
          style={[styles.profileAvatar, { backgroundColor: cardBg }]}
        >
          <Ionicons name="person" size={18} color={textColor} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        {/* Dynamic Header */}
        <View style={styles.greetingSection}>
          <Text style={[styles.greetingText, { color: textMuted, textAlign: isRTL ? 'right' : 'left' }]}>
            {isEvening ? (isRTL ? 'مساء الخير 👋' : 'Good evening 👋') : (isRTL ? 'صباح الخير 👋' : 'Good morning 👋')}
          </Text>
          <Text style={[styles.headerTitle, { color: textColor, textAlign: isRTL ? 'right' : 'left' }]}>
            {Math.round(completionRate * 100)}% {isRTL ? 'مكتمل' : 'completion'}
          </Text>
          <Text style={[styles.greetingSub, { color: textMuted, textAlign: isRTL ? 'right' : 'left' }]}>
            {completedActions} of {todayActions.length} actions completed
          </Text>
        </View>

        {isEvening && (
          <TouchableOpacity
            style={[styles.reviewCard, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
            activeOpacity={0.8}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push('/evening-review');
            }}
          >
            <View style={styles.reviewIconBox}>
              <Ionicons name="moon" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.flexOne}>
              <Text style={[styles.reviewTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
                {isRTL ? 'المراجعة المسائية' : 'Evening Review'}
              </Text>
              <Text style={[styles.reviewSub, { textAlign: isRTL ? 'right' : 'left' }]}>
                {isRTL ? 'راجع إنجازاتك اليوم وحضّر ليوم غد.' : 'Acknowledge today and prepare for tomorrow.'}
              </Text>
            </View>
            <Ionicons name={isRTL ? "chevron-back" : "chevron-forward"} size={20} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
        )}

        <Text style={[styles.sectionTitle, { color: textColor, textAlign: isRTL ? 'right' : 'left', marginTop: isEvening ? Spacing.lg : 0 }]}>
          {isRTL ? 'مهام اليوم' : 'Today\'s Actions'}
        </Text>

        <View style={styles.actionsList}>
          {todayActions.map((action) => {
            const goal = goals.find(g => g.id === action.goalId);
            return (
              <TouchableOpacity
                key={action.id}
                style={[
                  styles.actionCard,
                  {
                    backgroundColor: action.isCompleted ? (darkMode ? '#1E3A8A' : '#DBEAFE') : cardBg,
                    borderColor: action.isCompleted ? Colors.primary : borderColor,
                    flexDirection: isRTL ? 'row-reverse' : 'row',
                  },
                ]}
                onPress={() => handleToggle(action.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, { 
                  borderColor: action.isCompleted ? Colors.primary : textMuted,
                  backgroundColor: action.isCompleted ? Colors.primary : 'transparent'
                }]}>
                  {action.isCompleted && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                </View>

                <View style={styles.flexOne}>
                  <Text
                    style={[
                      styles.actionTitle,
                      { color: textColor, textDecorationLine: action.isCompleted ? 'line-through' : 'none' },
                      { textAlign: isRTL ? 'right' : 'left' },
                    ]}
                  >
                    {action.title}
                  </Text>
                  {goal && (
                    <View style={[styles.goalTag, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                      <Ionicons name={goal.icon as any} size={12} color={textMuted} />
                      <Text style={[styles.goalTagText, { color: textMuted }]}>{goal.title}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
          
          {todayActions.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="checkmark-done-circle-outline" size={48} color={textMuted} />
              <Text style={[styles.emptyText, { color: textMuted, textAlign: 'center' }]}>
                {isRTL ? 'أنت مستعد! لا توجد مهام اليوم.' : 'You are all caught up for today.'}
              </Text>
            </View>
          )}
        </View>

        {/* The Recovery Engine (Always visible at bottom) */}
        <View style={styles.recoverySection}>
          <Text style={[styles.sectionTitle, { color: textColor, textAlign: isRTL ? 'right' : 'left' }]}>
            {isRTL ? 'محرك التعافي' : 'Recovery Engine'}
          </Text>
          <TouchableOpacity
            style={[styles.recoveryCard, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
            activeOpacity={0.8}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push('/shift-now');
            }}
          >
            <View style={styles.recoveryIconBox}>
              <Ionicons name="flash" size={24} color="#F59E0B" />
            </View>
            <View style={styles.flexOne}>
              <Text style={[styles.recoveryTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
                {isRTL ? 'هل تواجه صعوبة في البدء؟' : 'Struggling to start?'}
              </Text>
              <Text style={[styles.recoverySub, { textAlign: isRTL ? 'right' : 'left' }]}>
                {isRTL ? 'اضغط هنا للتدخل الفوري والعودة للمسار.' : 'Tap here for an immediate intervention.'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topAppBar: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
  },
  topBtnPlaceholder: { width: 40 },
  appTitle: {
    fontFamily: Font.bold,
    fontSize: 18,
    letterSpacing: -0.5,
  },
  profileAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: 120, // space for tab bar
  },
  greetingSection: {
    marginBottom: Spacing.xl,
  },
  greetingText: {
    fontFamily: Font.medium,
    fontSize: 16,
    marginBottom: 4,
  },
  headerTitle: {
    fontFamily: Font.bold,
    fontSize: 32,
    letterSpacing: -1,
    marginBottom: 4,
  },
  greetingSub: {
    fontFamily: Font.medium,
    fontSize: 14,
  },
  reviewCard: {
    backgroundColor: '#4F46E5', // Deep indigo for evening review
    borderRadius: 20,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.xl,
    gap: Spacing.md,
    elevation: 4,
    shadowColor: '#4F46E5',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  reviewIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexOne: { flex: 1 },
  reviewTitle: {
    color: '#FFFFFF',
    fontFamily: Font.bold,
    fontSize: 18,
    marginBottom: 4,
  },
  reviewSub: {
    color: 'rgba(255,255,255,0.85)',
    fontFamily: Font.medium,
    fontSize: 13,
    lineHeight: 18,
  },
  sectionTitle: {
    fontFamily: Font.bold,
    fontSize: 18,
    letterSpacing: -0.3,
    marginBottom: Spacing.md,
  },
  actionsList: {
    gap: Spacing.sm,
    marginBottom: Spacing.xxl,
  },
  actionCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: Spacing.md,
    alignItems: 'center',
    gap: Spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTitle: {
    fontFamily: Font.semibold,
    fontSize: 16,
    marginBottom: 4,
  },
  goalTag: {
    alignItems: 'center',
    gap: 4,
  },
  goalTagText: {
    fontFamily: Font.medium,
    fontSize: 12,
  },
  emptyState: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.md,
  },
  emptyText: {
    fontFamily: Font.medium,
    fontSize: 14,
  },
  recoverySection: {
    marginTop: Spacing.xl,
  },
  recoveryCard: {
    backgroundColor: '#FFFBEB', // Light amber background for visibility but not alarm
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 20,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.md,
  },
  recoveryIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recoveryTitle: {
    color: '#92400E',
    fontFamily: Font.bold,
    fontSize: 16,
    marginBottom: 4,
  },
  recoverySub: {
    color: '#B45309',
    fontFamily: Font.medium,
    fontSize: 13,
    lineHeight: 18,
  },
});
