import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '@/store/useStore';
import { strings } from '@/constants/strings';
import { Colors, Spacing, Radii, Font } from '@/constants/theme';
import type { Feeling } from '@/types';

const { height } = Dimensions.get('window');

const FEELING_OPTIONS: { id: Feeling; icon: keyof typeof Ionicons.glyphMap; bg: string }[] = [
  { id: 'distracted', icon: 'shuffle-outline', bg: '#D8E2FF' },
  { id: 'no_energy', icon: 'battery-dead-outline', bg: '#DCE2F3' },
  { id: 'urge', icon: 'flame-outline', bg: '#FFDAD6' },
  { id: 'stressed', icon: 'warning-outline', bg: '#FFDBC9' },
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
  const textMuted = darkMode ? Colors.mutedDark : Colors.muted;

  const handleSelect = (f: Feeling) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelected(f);
  };

  const handleDone = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addXp(5);
    router.back();
  };

  return (
    <View style={styles.overlayContainer}>
      {/* Semi-transparent backdrop tap to close */}
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={() => router.back()}
      />

      {/* Bottom Sheet Sheet Panel */}
      <SafeAreaView style={[styles.bottomSheet, { backgroundColor: bg, borderTopColor: borderColor }]}>
        {/* Drag handle decoration */}
        <View style={[styles.dragHandle, { backgroundColor: borderColor }]} />

        {/* Header with Close Button */}
        <View style={[styles.headerRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Text style={[styles.sheetTitle, { color: textColor }]}>
            {selected ? t.feelings[selected].title : t.shiftNow}
          </Text>
          <TouchableOpacity
            style={[styles.closeBtn, { backgroundColor: borderColor }]}
            onPress={() => router.back()}
          >
            <Text style={[styles.closeText, { color: textColor }]}>✕</Text>
          </TouchableOpacity>
        </View>

        {!selected ? (
          <View style={styles.contentContainer}>
            {/* Title & Subtitle */}
            <View style={styles.textSection}>
              <Text style={[styles.mainQuestion, { color: textColor, textAlign: isRTL ? 'right' : 'left' }]}>
                {t.shiftTitle}
              </Text>
              <Text style={[styles.subQuestion, { color: textMuted, textAlign: isRTL ? 'right' : 'left' }]}>
                {t.shiftSub}
              </Text>
            </View>

            {/* Feelings Selection Grid */}
            <View style={[styles.grid, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              {FEELING_OPTIONS.map((opt) => {
                const feelStrings = t.feelings[opt.id];
                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[styles.feelingCard, { backgroundColor: cardBg, borderColor }]}
                    onPress={() => handleSelect(opt.id)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.cardRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                      <View style={[styles.emojiCircle, { backgroundColor: opt.bg }]}>
                        <Ionicons name={opt.icon} size={24} color={Colors.primary} />
                      </View>
                      <View style={styles.textColumn}>
                        <Text style={[styles.cardTitle, { color: textColor, textAlign: isRTL ? 'right' : 'left' }]}>
                          {feelStrings.title}
                        </Text>
                        <Text style={[styles.cardActionLabel, { color: Colors.primary, textAlign: isRTL ? 'right' : 'left' }]}>
                          {feelStrings.action}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ) : (
          <View style={styles.tipContainer}>
            {/* Selected state details */}
            <View style={styles.centerIconArea}>
              <View style={[styles.largeEmojiCircle, { backgroundColor: Colors.primaryLight }]}>
                <Ionicons
                  name={FEELING_OPTIONS.find((f) => f.id === selected)?.icon as keyof typeof Ionicons.glyphMap}
                  size={48}
                  color={Colors.primary}
                />
              </View>
              <Text style={[styles.selectedTitleText, { color: textColor }]}>
                {t.feelings[selected].title}
              </Text>
            </View>

            {/* Tip Card */}
            <View style={[styles.tipCard, { backgroundColor: cardBg, borderColor }]}>
              <Text style={[styles.tipText, { color: textColor, textAlign: isRTL ? 'right' : 'left' }]}>
                {t.shiftTip[selected]}
              </Text>
            </View>

            {/* Done Action */}
            <View style={styles.doneBtnSection}>
              <TouchableOpacity style={styles.doneBtn} onPress={handleDone} activeOpacity={0.8}>
                <Text style={styles.doneBtnText}>{t.shiftDone}</Text>
              </TouchableOpacity>
              <Text style={[styles.xpTextNote, { color: textMuted }]}>+5 {t.xp}</Text>
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomSheet: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderTopWidth: 1.5,
    paddingTop: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl,
    maxHeight: height * 0.85,
    minHeight: 400,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  headerRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  sheetTitle: {
    fontFamily: Font.bold,
    fontSize: 18,
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 12,
    fontFamily: Font.bold,
  },

  contentContainer: {
    gap: Spacing.xl,
  },
  textSection: {
    gap: 4,
  },
  mainQuestion: {
    fontFamily: Font.bold,
    fontSize: 22,
    letterSpacing: -0.5,
  },
  subQuestion: {
    fontFamily: Font.medium,
    fontSize: 14,
  },

  /* Grid Options */
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  feelingCard: {
    width: '47%',
    borderRadius: 20,
    borderWidth: 1.5,
    padding: Spacing.md,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardRow: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  emojiCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardEmoji: {
    fontSize: 20,
  },
  textColumn: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: Font.bold,
    fontSize: 14,
    marginBottom: 2,
  },
  cardActionLabel: {
    fontFamily: Font.semibold,
    fontSize: 11,
  },

  /* Tip Screen */
  tipContainer: {
    alignItems: 'center',
    gap: Spacing.xl,
    paddingTop: Spacing.md,
  },
  centerIconArea: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  largeEmojiCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  largeEmoji: {
    fontSize: 40,
  },
  selectedTitleText: {
    fontFamily: Font.bold,
    fontSize: 20,
  },
  tipCard: {
    width: '100%',
    borderWidth: 1.5,
    borderRadius: 20,
    padding: Spacing.lg,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  tipText: {
    fontFamily: Font.medium,
    fontSize: 15,
    lineHeight: 24,
  },
  doneBtnSection: {
    width: '100%',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  doneBtn: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: Colors.success,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontFamily: Font.bold,
    fontSize: 16,
  },
  xpTextNote: {
    fontFamily: Font.bold,
    fontSize: 12,
  },
});
