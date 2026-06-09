import { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, LayoutAnimation, UIManager, Platform, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '@/store/useStore';
import { strings } from '@/constants/strings';
import { Colors, Spacing, Radii, Font } from '@/constants/theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Today() {
  const {
    language, actions, xp, streak, level,
    toggleAction, checkNewDay, darkMode, history,
    lastOverloadPrompt, setOverloadPrompt
  } = useStore();
  const insets = useSafeAreaInsets();
  const t = strings[language];
  const isRTL = language === 'ar';

  useEffect(() => {
    checkNewDay();
  }, []);

  useEffect(() => {
    // Progressive Overload Logic
    if (streak > 0 && streak % 7 === 0 && lastOverloadPrompt !== streak) {
      setTimeout(() => {
        Alert.alert(
          isRTL ? 'عاش يا بطل! 🚀' : 'Level Up! 🚀',
          isRTL 
            ? `بقالك ${streak} أيام مستمر من غير ما تقطع. إيه رأيك نعلي الليفل ونضيف مهمة جديدة عشان التحدي يكبر؟`
            : `You've been consistent for ${streak} days. Ready to level up and add a new task?`,
          [
            { text: isRTL ? 'لأ، مش دلوقتي' : 'Not now', style: 'cancel', onPress: () => setOverloadPrompt(streak) },
            { 
              text: isRTL ? 'يلا بينا!' : 'Let\'s do it!', 
              onPress: () => {
                setOverloadPrompt(streak);
                router.push('/onboarding'); // or any edit screen
              } 
            }
          ]
        );
      }, 1000); // slight delay so it doesn't pop up instantly before UI mounts
    }
  }, [streak, lastOverloadPrompt]);

  const completedCount = actions.filter((a) => a.completed).length;
  const total = actions.length;
  const allDone = total > 0 && completedCount === total;

  const bg = darkMode ? Colors.bgDark : Colors.bg;
  const cardBg = darkMode ? Colors.cardDark : Colors.card;
  const borderColor = darkMode ? Colors.borderDark : Colors.border;
  const textColor = darkMode ? Colors.textDark : Colors.text;
  const textMuted = darkMode ? Colors.mutedDark : Colors.muted;

  const handleToggle = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    toggleAction(id);
  };

  // Level progress variables
  const levelProgress = (xp % 100) / 100;
  const xpNeeded = 100 - (xp % 100);

  // Time based greeting
  const hour = new Date().getHours();
  const greetingEn = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const greetingAr = hour < 12 ? 'صباح الخير' : hour < 17 ? 'مساء الخير' : 'مساء الخير';
  const greeting = isRTL ? greetingAr : greetingEn;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      {/* TopAppBar */}
      <View style={[styles.topAppBar, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <View style={styles.topBtnPlaceholder} />
        <Text style={[styles.appTitle, { color: textColor }]}>CoreShift</Text>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push('/settings');
          }}
          style={[styles.profileAvatar, { backgroundColor: Colors.primaryLight }]}
        >
          <Ionicons name="person" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Greeting Section */}
        <View style={styles.greetingSection}>
          <Text style={[styles.greetingText, { color: textMuted, textAlign: isRTL ? 'right' : 'left' }]}>
            {greeting}
          </Text>
        </View>

        {/* Daily Execution Stats Card */}
        <View style={[styles.executionCard, { backgroundColor: cardBg, borderColor }]}>
          <View style={[styles.executionHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={styles.flexOne}>
              <Text style={[styles.executionTitle, { color: textColor, textAlign: isRTL ? 'right' : 'left' }]}>
                {t.dailyExecution}
              </Text>
              <Text style={[styles.executionSubtitle, { color: Colors.primary, textAlign: isRTL ? 'right' : 'left' }]}>
                {isRTL ? `${t.scholar} مستوى ${level}` : `Level ${level} ${t.scholar}`}
              </Text>
            </View>
            <View style={styles.xpBox}>
              <Text style={[styles.bigXpValue, { color: textColor }]}>{xp}</Text>
              <Text style={[styles.xpLabel, { color: textMuted }]}>{t.xpToday}</Text>
            </View>
          </View>

          {/* Level Progress Bar */}
          <View style={[styles.levelProgressTrack, { backgroundColor: borderColor }]}>
            <View
              style={[
                styles.levelProgressFill,
                {
                  width: `${levelProgress * 100}%`,
                  left: isRTL ? undefined : 0,
                  right: isRTL ? 0 : undefined,
                },
              ]}
            />
          </View>

          <View style={[styles.levelLabelsRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text style={[styles.levelLabelText, { color: textMuted }]}>0</Text>
            <Text style={[styles.levelLabelText, { color: textMuted }]}>
              {isRTL ? `${xpNeeded} ${t.nextLevel}` : `${xpNeeded} XP ${t.nextLevel}`}
            </Text>
          </View>
        </View>

        {/* Focus Modules Section Header */}
        <Text style={[styles.sectionTitle, { color: textColor, textAlign: isRTL ? 'right' : 'left' }]}>
          {t.todayTitle}
        </Text>

        {/* Actions List */}
        <View style={styles.actionsList}>
          {actions.map((action) => {
            const titleText = isRTL ? action.titleAr : action.title;
            const descText = isRTL ? action.descriptionAr : action.description;

            return (
              <TouchableOpacity
                key={action.id}
                style={[
                  styles.actionCard,
                  {
                    backgroundColor: action.completed ? (darkMode ? '#1E293B' : '#F2F3FE') : cardBg,
                    borderColor: action.completed ? Colors.primary : borderColor,
                    flexDirection: isRTL ? 'row-reverse' : 'row',
                  },
                ]}
                onPress={() => handleToggle(action.id)}
                activeOpacity={0.7}
              >
                {/* Left check circle */}
                <View
                  style={[
                    styles.checkbox,
                    action.completed && {
                      backgroundColor: Colors.primary,
                      borderColor: Colors.primary,
                    },
                  ]}
                >
                  {action.completed && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                </View>

                {/* Icon box */}
                <View style={[styles.actionIconBox, { backgroundColor: action.completed ? 'transparent' : Colors.primaryLight }]}>
                  <Ionicons name={action.icon as keyof typeof Ionicons.glyphMap} size={20} color={action.completed ? textMuted : Colors.primary} />
                </View>

                {/* Center details */}
                <View style={styles.flexOne}>
                  <Text
                    style={[
                      styles.actionTitle,
                      { color: textColor },
                      action.completed && styles.actionDoneText,
                      { textAlign: isRTL ? 'right' : 'left' },
                    ]}
                  >
                    {titleText}
                  </Text>
                  {descText && (
                    <Text
                      style={[
                        styles.actionDesc,
                        { color: textMuted },
                        action.completed && styles.actionDoneText,
                        { textAlign: isRTL ? 'right' : 'left' },
                      ]}
                    >
                      {descText}
                    </Text>
                  )}
                </View>

                {/* Right side: Duration Pill & Play Btn */}
                <View style={[styles.rightActionsRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <View style={[styles.cardDurationPill, { backgroundColor: borderColor }]}>
                    <Text style={[styles.cardDurationText, { color: textColor }]}>
                      {action.duration || '5m'}
                    </Text>
                  </View>
                  {!action.completed && (
                    <TouchableOpacity
                      style={[styles.playBtnSmall, { backgroundColor: Colors.primaryLight }]}
                      onPress={(e) => {
                        e.stopPropagation();
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        router.push({ pathname: '/focus', params: { id: action.id } });
                      }}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="play" size={14} color={Colors.primary} style={{ marginLeft: 2 }} />
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* All items completed celebration */}
        {allDone && (
          <View style={[styles.celebrationBanner, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Ionicons name="trophy" size={28} color="#15803D" />
            <View style={styles.flexOne}>
              <Text style={[styles.celebrationTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
                {t.allDoneTitle}
              </Text>
              <Text style={[styles.celebrationSub, { textAlign: isRTL ? 'right' : 'left' }]}>
                {t.allDoneSub}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button "Shift Now" */}
      <TouchableOpacity
        style={[styles.fab, isRTL ? { left: Spacing.xl } : { right: Spacing.xl }, { bottom: 84 + insets.bottom }]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          router.push('/shift-now');
        }}
        activeOpacity={0.8}
      >
        <Ionicons name="flash" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Bottom Navigation Bar */}
      <View style={[styles.bottomBar, { backgroundColor: bg, borderTopColor: borderColor, paddingBottom: Math.max(insets.bottom, Spacing.xs), height: 72 + insets.bottom }]}>
        <TouchableOpacity
          style={[styles.navTab, styles.navTabActive, { backgroundColor: darkMode ? '#1E293B' : '#ECEDF8' }]}
          onPress={() => {}}
          activeOpacity={0.7}
        >
          <Ionicons name="calendar" size={22} color={textColor} style={styles.navIcon} />
          <Text style={[styles.navText, { color: textColor }]}>Today</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navTab}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.replace('/progress');
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="stats-chart-outline" size={22} color={textMuted} style={styles.navIcon} />
          <Text style={[styles.navText, { color: textMuted }]}>Progress</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navTab}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.replace('/settings');
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="settings-outline" size={22} color={textMuted} style={styles.navIcon} />
          <Text style={[styles.navText, { color: textMuted }]}>Settings</Text>
        </TouchableOpacity>
      </View>
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
  topBtnPlaceholder: {
    width: 40,
  },
  appTitle: {
    fontFamily: Font.bold,
    fontSize: 20,
    letterSpacing: -0.5,
  },
  profileAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileEmoji: {
    fontSize: 18,
  },

  scroll: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: 160,
  },

  greetingSection: {
    marginBottom: Spacing.md,
  },
  greetingText: {
    fontFamily: Font.semibold,
    fontSize: 14,
  },

  /* Daily Execution Card */
  executionCard: {
    borderWidth: 1.5,
    borderRadius: 24,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  executionHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  flexOne: {
    flex: 1,
  },
  executionTitle: {
    fontFamily: Font.bold,
    fontSize: 18,
    marginBottom: 4,
  },
  executionSubtitle: {
    fontFamily: Font.semibold,
    fontSize: 13,
  },
  xpBox: {
    alignItems: 'center',
  },
  bigXpValue: {
    fontFamily: Font.bold,
    fontSize: 28,
    lineHeight: 32,
  },
  xpLabel: {
    fontFamily: Font.medium,
    fontSize: 11,
  },
  levelProgressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  levelProgressFill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  levelLabelsRow: {
    justifyContent: 'space-between',
  },
  levelLabelText: {
    fontFamily: Font.medium,
    fontSize: 11,
  },

  /* Focus Modules */
  sectionTitle: {
    fontFamily: Font.bold,
    fontSize: 18,
    letterSpacing: -0.3,
    marginBottom: Spacing.md,
  },
  actionsList: {
    gap: Spacing.md,
  },
  actionCard: {
    borderWidth: 1.5,
    borderRadius: 16,
    padding: Spacing.md,
    alignItems: 'center',
    gap: Spacing.md,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#9DA3AE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: {
    color: '#FFFFFF',
    fontFamily: Font.bold,
    fontSize: 13,
  },
  actionIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTitle: {
    fontFamily: Font.bold,
    fontSize: 15,
    marginBottom: 2,
  },
  actionDesc: {
    fontFamily: Font.regular,
    fontSize: 12,
    lineHeight: 16,
  },
  actionDoneText: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  rightActionsRow: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  cardDurationPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  cardDurationText: {
    fontFamily: Font.semibold,
    fontSize: 11,
  },
  playBtnSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Celebration */
  celebrationBanner: {
    backgroundColor: '#E6F6EC',
    borderRadius: 16,
    padding: Spacing.md,
    gap: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  celebrationEmoji: {
    fontSize: 28,
  },
  celebrationTitle: {
    fontFamily: Font.bold,
    fontSize: 15,
    color: '#15803D',
  },
  celebrationSub: {
    fontFamily: Font.medium,
    fontSize: 12,
    color: '#166534',
    marginTop: 2,
  },

  /* Floating Action Button */
  fab: {
    position: 'absolute',
    bottom: 84,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  fabIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  navTab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: 20,
    minWidth: 70,
  },
  navTabActive: {},
  navIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  navText: {
    fontFamily: Font.bold,
    fontSize: 11,
  },
});
