import { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '@/store/useStore';
import { strings } from '@/constants/strings';
import { Colors, Spacing, Radii, Font } from '@/constants/theme';

const { width } = Dimensions.get('window');

export default function Progress() {
  const { language, xp, streak, history, actions, darkMode } = useStore();
  const insets = useSafeAreaInsets();
  const t = strings[language];
  const isRTL = language === 'ar';

  const bg = darkMode ? Colors.bgDark : Colors.bg;
  const cardBg = darkMode ? Colors.cardDark : Colors.card;
  const borderColor = darkMode ? Colors.borderDark : Colors.border;
  const textColor = darkMode ? Colors.textDark : Colors.text;
  const textMuted = darkMode ? Colors.mutedDark : Colors.muted;

  // 14-day rolling data
  const rollingData = useMemo(() => {
    const today = new Date();
    const data = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayNamesEn = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
      const dayNamesAr = ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'];
      const dayNames = isRTL ? dayNamesAr : dayNamesEn;

      data.push({
        day: d.getDate(),
        weekday: dayNames[d.getDay()],
        completed: history[dateStr] === true,
        isToday: i === 0,
      });
    }
    return data;
  }, [history, isRTL]);

  // Overall completion rate from history
  const totalTracked = Object.keys(history).length;
  const daysCompleted = Object.values(history).filter(Boolean).length;
  const overallRate = totalTracked > 0 ? Math.round((daysCompleted / totalTracked) * 100) : 0;

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
        {/* Screen Title */}
        <View style={styles.titleSection}>
          <Text style={[styles.screenTitle, { color: textColor, textAlign: isRTL ? 'right' : 'left' }]}>
            {t.progressTitle}
          </Text>
          <Text style={[styles.screenSub, { color: textMuted, textAlign: isRTL ? 'right' : 'left' }]}>
            {t.progressSub}
          </Text>
        </View>

        {/* Stats Bento Grid */}
        <View style={styles.bentoContainer}>
          {/* Card 1: Completion (Circular Ring) */}
          <View style={[styles.bentoCardLarge, { backgroundColor: cardBg, borderColor }]}>
            <Text style={[styles.bentoLabel, { color: textMuted }]}>{t.completionRate}</Text>
            <View style={styles.circularContainer}>
              <View style={[styles.progressRingOuter, { borderColor: borderColor }]}>
                {/* Simulated inner content */}
                <Text style={[styles.circularRateText, { color: textColor }]}>{overallRate}%</Text>
              </View>
            </View>
            <Text style={[styles.bentoSubText, { color: textMuted }]}>
              {isRTL ? `${daysCompleted} من أصل ${totalTracked} أيام` : `${daysCompleted} of ${totalTracked} days`}
            </Text>
          </View>

          {/* Cards 2 & 3 Right Column */}
          <View style={styles.bentoColumn}>
            {/* Card 2: Day Streak */}
            <View style={[styles.bentoCardSmall, { backgroundColor: cardBg, borderColor }]}>
              <View style={[styles.bentoHeaderRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Text style={[styles.bentoLabel, { color: textMuted }]}>{t.currentStreak}</Text>
                <Ionicons name="flame" size={20} color="#EA580C" />
              </View>
              <Text style={[styles.bentoValue, { color: textColor, textAlign: isRTL ? 'right' : 'left' }]}>
                {streak}
              </Text>
            </View>

            {/* Card 3: Total XP */}
            <View style={[styles.bentoCardSmall, { backgroundColor: cardBg, borderColor }]}>
              <View style={[styles.bentoHeaderRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Text style={[styles.bentoLabel, { color: textMuted }]}>{t.totalXp}</Text>
                <Ionicons name="star" size={20} color="#EAB308" />
              </View>
              <Text style={[styles.bentoValue, { color: textColor, textAlign: isRTL ? 'right' : 'left' }]}>
                {xp}
              </Text>
            </View>
          </View>
        </View>

        {/* 14-Day Timeline Section */}
        <View style={styles.timelineSection}>
          <Text style={[styles.sectionTitle, { color: textColor, textAlign: isRTL ? 'right' : 'left' }]}>
            {t.recentActivity}
          </Text>
          <Text style={[styles.sectionSubtitle, { color: textMuted, textAlign: isRTL ? 'right' : 'left' }]}>
            {t.last14}
          </Text>

          {/* Horizontally scrollable timeline list */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.timelineScroll, isRTL && { flexDirection: 'row-reverse' }]}
          >
            {rollingData.map((d, i) => (
              <View
                key={i}
                style={[
                  styles.timelinePill,
                  { backgroundColor: cardBg, borderColor },
                  d.isToday && { borderColor: Colors.primary, borderWidth: 2, backgroundColor: darkMode ? '#1E293B' : '#F2F3FE' },
                ]}
              >
                <Text style={[styles.timelineWeekday, { color: d.isToday ? Colors.primary : textMuted }]}>
                  {d.weekday}
                </Text>
                <Text style={[styles.timelineDayNum, { color: textColor }]}>
                  {d.day}
                </Text>
                <View
                  style={[
                    styles.timelineStatusIndicator,
                    { backgroundColor: d.completed ? Colors.success : borderColor },
                  ]}
                />
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={[styles.bottomBar, { backgroundColor: bg, borderTopColor: borderColor, paddingBottom: Math.max(insets.bottom, Spacing.xs), height: 72 + insets.bottom }]}>
        <TouchableOpacity
          style={styles.navTab}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.replace('/today');
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="calendar-outline" size={22} color={textMuted} style={styles.navIcon} />
          <Text style={[styles.navText, { color: textMuted }]}>Today</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navTab, styles.navTabActive, { backgroundColor: darkMode ? '#1E293B' : '#ECEDF8' }]}
          onPress={() => {}}
          activeOpacity={0.7}
        >
          <Ionicons name="stats-chart" size={22} color={textColor} style={styles.navIcon} />
          <Text style={[styles.navText, { color: textColor }]}>Progress</Text>
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
    paddingBottom: 120,
  },

  titleSection: {
    marginBottom: Spacing.xl,
    gap: Spacing.xs,
  },
  screenTitle: {
    fontFamily: Font.bold,
    fontSize: 26,
    letterSpacing: -0.5,
  },
  screenSub: {
    fontFamily: Font.regular,
    fontSize: 14,
  },

  /* Bento Stats Grid */
  bentoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  bentoCardLarge: {
    flex: 1.2,
    borderWidth: 1.5,
    borderRadius: 24,
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 180,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  bentoColumn: {
    flex: 1,
    gap: Spacing.md,
  },
  bentoCardSmall: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 20,
    padding: Spacing.md,
    justifyContent: 'space-between',
    minHeight: 84,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  bentoHeaderRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bentoLabel: {
    fontFamily: Font.bold,
    fontSize: 12,
  },
  bentoIcon: {
    fontSize: 16,
  },
  bentoValue: {
    fontFamily: Font.bold,
    fontSize: 24,
  },
  bentoSubText: {
    fontFamily: Font.medium,
    fontSize: 11,
    textAlign: 'center',
  },

  /* Circular Ring */
  circularContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: Spacing.xs,
  },
  progressRingOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circularRateText: {
    fontFamily: Font.bold,
    fontSize: 18,
  },

  /* 14-Day Timeline */
  timelineSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontFamily: Font.bold,
    fontSize: 18,
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontFamily: Font.medium,
    fontSize: 12,
    marginBottom: Spacing.md,
  },
  timelineScroll: {
    paddingVertical: Spacing.xs,
    gap: Spacing.sm,
  },
  timelinePill: {
    width: 48,
    height: 90,
    borderRadius: 24,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.01,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  timelineWeekday: {
    fontFamily: Font.bold,
    fontSize: 11,
  },
  timelineDayNum: {
    fontFamily: Font.bold,
    fontSize: 14,
  },
  timelineStatusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
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
