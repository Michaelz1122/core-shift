import { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '@/store/useStore';
import { strings } from '@/constants/strings';
import { Colors, Spacing, Radii, Font } from '@/constants/theme';

export default function Progress() {
  const { language, xp, level, streak, history, actions, darkMode } = useStore();
  const t = strings[language];
  const isRTL = language === 'ar';

  const bg = darkMode ? Colors.bgDark : Colors.bg;
  const cardBg = darkMode ? Colors.cardDark : Colors.card;
  const borderColor = darkMode ? Colors.borderDark : Colors.border;
  const textColor = darkMode ? Colors.textDark : Colors.text;

  // 14-day rolling data
  const rollingData = useMemo(() => {
    const today = new Date();
    const data = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayNames = isRTL
        ? ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت']
        : ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
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

  // Today
  const completedToday = actions.filter((a) => a.completed).length;
  const total = actions.length;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={[styles.backText, { color: textColor }]}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: textColor }]}>{t.progressTitle}</Text>
          <View style={styles.backBtn} />
        </View>

        {/* Stats row: streak + XP */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: cardBg, borderColor }]}>
            <Text style={styles.statEmoji}>🔥</Text>
            <Text style={[styles.statValue, { color: textColor }]}>{streak}</Text>
            <Text style={[styles.statUnit, { color: Colors.muted }]}>
              {t.currentStreak}
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: cardBg, borderColor }]}>
            <Text style={styles.statEmoji}>⚡</Text>
            <Text style={[styles.statValue, { color: textColor }]}>{xp}</Text>
            <Text style={[styles.statUnit, { color: Colors.muted }]}>
              {t.totalXp}
            </Text>
          </View>
        </View>

        {/* Today's actions */}
        <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardLabel, { color: Colors.muted }]}>
              {isRTL ? 'النهارده' : 'Today'}
            </Text>
            <Text style={[styles.cardRight, { color: Colors.primary }]}>
              {completedToday}/{total}
            </Text>
          </View>
          <View style={[styles.progressTrack, { backgroundColor: borderColor }]}>
            <View
              style={[
                styles.progressFill,
                { width: total > 0 ? `${(completedToday / total) * 100}%` : '0%' },
                total > 0 && completedToday === total && { backgroundColor: Colors.success },
              ]}
            />
          </View>
        </View>

        {/* Overall completion rate */}
        <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardLabel, { color: Colors.muted }]}>{t.completionRate}</Text>
            <Text style={[styles.cardRight, { color: textColor }]}>
              {daysCompleted}/{totalTracked} {t.days}
            </Text>
          </View>
          <Text style={[styles.bigNumber, { color: Colors.primary }]}>{overallRate}%</Text>
          <View style={[styles.progressTrack, { backgroundColor: borderColor }]}>
            <View style={[styles.progressFill, { width: `${overallRate}%` }]} />
          </View>
        </View>

        {/* 14-day timeline */}
        <Text style={[styles.sectionTitle, { color: textColor, textAlign: isRTL ? 'right' : 'left' }]}>
          {t.last14}
        </Text>
        <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
          <View style={styles.timeline}>
            {rollingData.map((d, i) => (
              <View key={i} style={styles.timelineDay}>
                <View
                  style={[
                    styles.dot,
                    {
                      backgroundColor: d.completed ? Colors.success : borderColor,
                      borderWidth: d.isToday ? 2 : 0,
                      borderColor: d.isToday ? Colors.primary : 'transparent',
                    },
                  ]}
                />
                <Text style={[styles.dayLabel, { color: d.isToday ? Colors.primary : Colors.muted }]}>
                  {d.day}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxxl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  backBtn: { width: 36 },
  backText: { fontFamily: Font.bold, fontSize: 22 },
  title: { fontFamily: Font.bold, fontSize: 20 },

  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.base,
  },
  statCard: {
    flex: 1,
    padding: Spacing.base,
    borderRadius: Radii.lg,
    borderWidth: 1,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statEmoji: { fontSize: 22 },
  statValue: { fontFamily: Font.bold, fontSize: 28 },
  statUnit: { fontFamily: Font.medium, fontSize: 12 },

  card: {
    padding: Spacing.lg,
    borderRadius: Radii.lg,
    borderWidth: 1,
    marginBottom: Spacing.base,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  cardLabel: { fontFamily: Font.medium, fontSize: 13 },
  cardRight: { fontFamily: Font.bold, fontSize: 14 },
  bigNumber: { fontFamily: Font.bold, fontSize: 32, marginBottom: Spacing.md },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },

  sectionTitle: {
    fontFamily: Font.bold,
    fontSize: 17,
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  timeline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timelineDay: { alignItems: 'center', gap: Spacing.xs },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  dayLabel: { fontFamily: Font.regular, fontSize: 10 },
});
