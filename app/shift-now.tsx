import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useStore } from '@/store/useStore';
import { strings } from '@/constants/strings';
import { Colors, Spacing, Radii, Font } from '@/constants/theme';
import type { Feeling } from '@/types';

const FEELINGS: { id: Feeling; emoji: string }[] = [
  { id: 'distracted', emoji: '😵‍💫' },
  { id: 'no_energy', emoji: '😴' },
  { id: 'urge', emoji: '🔥' },
  { id: 'stressed', emoji: '😰' },
];

export default function ShiftNow() {
  const { language, darkMode, addXp } = useStore();
  const t = strings[language];
  const isRTL = language === 'ar';
  const [selected, setSelected] = useState<Feeling | null>(null);

  const bg = darkMode ? Colors.bgDark : Colors.bg;
  const cardBg = darkMode ? Colors.cardDark : Colors.card;
  const borderColor = darkMode ? Colors.borderDark : Colors.border;
  const textColor = darkMode ? Colors.textDark : Colors.text;

  const handleSelect = (f: Feeling) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected(f);
  };

  const handleDone = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addXp(5);
    router.back();
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
            <Text style={[styles.closeText, { color: Colors.muted }]}>✕</Text>
          </TouchableOpacity>
        </View>

        {!selected ? (
          <>
            <Text style={[styles.title, { color: textColor, textAlign: isRTL ? 'right' : 'left' }]}>
              {t.shiftTitle}
            </Text>
            <View style={styles.grid}>
              {FEELINGS.map((f) => (
                <TouchableOpacity
                  key={f.id}
                  style={[styles.feelingCard, { backgroundColor: cardBg, borderColor }]}
                  onPress={() => handleSelect(f.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.feelingEmoji}>{f.emoji}</Text>
                  <Text style={[styles.feelingLabel, { color: textColor }]}>
                    {t.feelings[f.id]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          <View style={styles.tipContainer}>
            <Text style={styles.tipEmoji}>
              {FEELINGS.find((f) => f.id === selected)?.emoji}
            </Text>
            <Text style={[styles.tipTitle, { color: textColor }]}>
              {t.feelings[selected]}
            </Text>
            <View style={[styles.tipCard, { backgroundColor: cardBg, borderColor }]}>
              <Text style={[styles.tipText, { color: textColor, textAlign: isRTL ? 'right' : 'left' }]}>
                {t.shiftTip[selected]}
              </Text>
            </View>
            <TouchableOpacity style={styles.doneBtn} onPress={handleDone} activeOpacity={0.8}>
              <Text style={styles.doneBtnText}>{t.shiftDone}</Text>
            </TouchableOpacity>
            <Text style={[styles.xpNote, { color: Colors.muted }]}>+5 XP</Text>
          </View>
        )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: Spacing.xl,
  },
  closeBtn: { padding: Spacing.sm },
  closeText: { fontSize: 20 },

  title: {
    fontFamily: Font.bold,
    fontSize: 24,
    letterSpacing: -0.3,
    marginBottom: Spacing.xl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  feelingCard: {
    width: '48%',
    alignItems: 'center',
    padding: Spacing.xl,
    borderRadius: Radii.lg,
    borderWidth: 1.5,
    gap: Spacing.sm,
  },
  feelingEmoji: { fontSize: 36 },
  feelingLabel: {
    fontFamily: Font.semibold,
    fontSize: 15,
  },

  tipContainer: { alignItems: 'center', gap: Spacing.lg },
  tipEmoji: { fontSize: 56 },
  tipTitle: {
    fontFamily: Font.bold,
    fontSize: 22,
  },
  tipCard: {
    width: '100%',
    padding: Spacing.xl,
    borderRadius: Radii.lg,
    borderWidth: 1,
  },
  tipText: {
    fontFamily: Font.regular,
    fontSize: 16,
    lineHeight: 26,
  },
  doneBtn: {
    backgroundColor: Colors.success,
    borderRadius: Radii.lg,
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.xxxl,
    marginTop: Spacing.md,
  },
  doneBtnText: {
    fontFamily: Font.bold,
    fontSize: 16,
    color: Colors.white,
  },
  xpNote: {
    fontFamily: Font.medium,
    fontSize: 13,
  },
});
