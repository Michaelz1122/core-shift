import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useStore } from '@/store/useStore';
import { strings } from '@/constants/strings';
import { Colors, Spacing, Radii, Font } from '@/constants/theme';

export default function Today() {
  const {
    language, actions, xp, streak,
    toggleAction, checkNewDay, darkMode,
  } = useStore();
  const t = strings[language];
  const isRTL = language === 'ar';

  useEffect(() => { checkNewDay(); }, []);

  const completedCount = actions.filter((a) => a.completed).length;
  const total = actions.length;
  const allDone = total > 0 && completedCount === total;

  const bg = darkMode ? Colors.bgDark : Colors.bg;
  const cardBg = darkMode ? Colors.cardDark : Colors.card;
  const borderColor = darkMode ? Colors.borderDark : Colors.border;
  const textColor = darkMode ? Colors.textDark : Colors.text;

  const handleToggle = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleAction(id);
  };

  // Greeting based on time
  const hour = new Date().getHours();
  const greetingEn = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const greetingAr = hour < 12 ? 'صباح الخير' : hour < 17 ? 'مساء الخير' : 'مساء الخير';
  const greeting = isRTL ? greetingAr : greetingEn;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={[styles.greeting, { color: Colors.muted, textAlign: isRTL ? 'right' : 'left' }]}>
            {greeting}
          </Text>
          <View style={[styles.streakRow, isRTL && { flexDirection: 'row-reverse' }]}>
            <Text style={[styles.streakText, { color: textColor }]}>
              🔥 {streak} {t.days}
            </Text>
            <Text style={[styles.xpText, { color: Colors.muted }]}>
              {xp} XP
            </Text>
          </View>
        </View>

        {/* Section title + progress */}
        <Text style={[styles.sectionTitle, { color: textColor, textAlign: isRTL ? 'right' : 'left' }]}>
          {t.todayTitle}
        </Text>

        <View style={[styles.progressTrack, { backgroundColor: borderColor }]}>
          <View
            style={[
              styles.progressFill,
              { width: total > 0 ? `${(completedCount / total) * 100}%` : '0%' },
              allDone && { backgroundColor: Colors.success },
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color: Colors.muted, textAlign: isRTL ? 'right' : 'left' }]}>
          {completedCount} / {total} {t.completed}
        </Text>

        {/* Celebration banner when all done */}
        {allDone && (
          <View style={styles.celebrationBanner}>
            <Text style={styles.celebrationEmoji}>🎉</Text>
            <Text style={[styles.celebrationText, { textAlign: isRTL ? 'right' : 'left' }]}>
              {isRTL ? 'أحسنت! خلصت كل حاجة النهارده.' : 'All done! You showed up today.'}
            </Text>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actionsList}>
          {actions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={[
                styles.actionCard,
                {
                  backgroundColor: action.completed ? Colors.primaryLight : cardBg,
                  borderColor: action.completed ? Colors.primary : borderColor,
                },
              ]}
              onPress={() => handleToggle(action.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, action.completed && styles.checkboxDone]}>
                {action.completed && <Text style={styles.checkIcon}>✓</Text>}
              </View>
              <Text
                style={[
                  styles.actionTitle,
                  { color: action.completed ? Colors.primary : textColor },
                  action.completed && styles.actionDone,
                  { textAlign: isRTL ? 'right' : 'left' },
                ]}
              >
                {language === 'ar' ? action.titleAr : action.title}
              </Text>
              <Text style={styles.actionEmoji}>{action.emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom bar */}
      <View style={[styles.bottomBar, { backgroundColor: bg, borderTopColor: borderColor }]}>
        <TouchableOpacity
          style={styles.shiftButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push('/shift-now');
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.shiftText}>🛡️ {t.shiftNow}</Text>
        </TouchableOpacity>

        <View style={styles.navRow}>
          <TouchableOpacity onPress={() => router.push('/progress')} style={styles.navBtn}>
            <Text style={styles.navEmoji}>📊</Text>
            <Text style={[styles.navLabel, { color: Colors.muted }]}>
              {isRTL ? 'التقدم' : 'Progress'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/settings')} style={styles.navBtn}>
            <Text style={styles.navEmoji}>⚙️</Text>
            <Text style={[styles.navLabel, { color: Colors.muted }]}>
              {isRTL ? 'إعدادات' : 'Settings'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: 160,
  },

  headerSection: {
    marginBottom: Spacing.xl,
    gap: Spacing.xs,
  },
  greeting: {
    fontFamily: Font.medium,
    fontSize: 14,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  streakText: {
    fontFamily: Font.bold,
    fontSize: 18,
  },
  xpText: {
    fontFamily: Font.medium,
    fontSize: 14,
  },

  sectionTitle: {
    fontFamily: Font.bold,
    fontSize: 22,
    letterSpacing: -0.3,
    marginBottom: Spacing.md,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: Spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  progressText: {
    fontFamily: Font.medium,
    fontSize: 13,
    marginBottom: Spacing.lg,
  },

  celebrationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: '#E8F5E9',
    padding: Spacing.base,
    borderRadius: Radii.lg,
    marginBottom: Spacing.lg,
  },
  celebrationEmoji: { fontSize: 28 },
  celebrationText: {
    flex: 1,
    fontFamily: Font.semibold,
    fontSize: 15,
    color: '#2E7D32',
    lineHeight: 20,
  },

  actionsList: { gap: Spacing.sm },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    borderRadius: Radii.lg,
    borderWidth: 1.5,
    gap: Spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkIcon: { color: Colors.white, fontSize: 14, fontFamily: Font.bold },
  actionTitle: {
    flex: 1,
    fontFamily: Font.semibold,
    fontSize: 15,
    lineHeight: 20,
  },
  actionDone: { textDecorationLine: 'line-through' },
  actionEmoji: { fontSize: 20 },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
    borderTopWidth: 1,
    gap: Spacing.md,
  },
  shiftButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radii.lg,
    paddingVertical: Spacing.base,
    alignItems: 'center',
  },
  shiftText: {
    fontFamily: Font.bold,
    fontSize: 16,
    color: Colors.white,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xxxl,
  },
  navBtn: { alignItems: 'center', gap: 2, padding: Spacing.xs },
  navEmoji: { fontSize: 20 },
  navLabel: {
    fontFamily: Font.medium,
    fontSize: 11,
  },
});
