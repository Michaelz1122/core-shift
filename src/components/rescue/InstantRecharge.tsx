import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import AppText from '../ui/AppText';
import { useAppStore } from '@/store/useAppStore';
import { Colors, Spacing, Radii, Gradients, Shadows } from '@/constants/theme';

interface InstantRechargeProps {
  onComplete: () => void;
  onBack: () => void;
}

interface RechargeItem {
  id: string;
  title: string;
  sub: string;
  emoji: string;
  xpReward: number;
}

const ITEMS: RechargeItem[] = [
  {
    id: 'water',
    title: 'Drink a full glass of cold water',
    sub: 'Rehydrates the brain, boosts alertness instantly.',
    emoji: '💧',
    xpReward: 10,
  },
  {
    id: 'stretch',
    title: 'Do 5 jumps or a 30s stretch',
    sub: 'Gets blood flowing and releases natural endorphins.',
    emoji: '🏃‍♂️',
    xpReward: 10,
  },
  {
    id: 'sunlight',
    title: 'Stand in natural light for 20s',
    sub: 'Resets your circadian rhythm and suppresses melatonin.',
    emoji: '☀️',
    xpReward: 10,
  },
  {
    id: 'music',
    title: 'Play one high-energy track',
    sub: 'Auditory stimulation breaks low-energy mental loops.',
    emoji: '🎵',
    xpReward: 10,
  },
];

export default function InstantRecharge({ onComplete, onBack }: InstantRechargeProps) {
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const addXp = useAppStore((state) => state.addXp);

  const toggleItem = (id: string, xpReward: number) => {
    if (completedIds.includes(id)) return; // No unchecking to farm XP

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const newCompleted = [...completedIds, id];
    setCompletedIds(newCompleted);
    addXp(xpReward);

    // If this completes the whole list, give a +10 XP bonus (making it +50 XP total!)
    if (newCompleted.length === ITEMS.length) {
      setTimeout(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        addXp(10);
      }, 500);
    }
  };

  const isAllCompleted = completedIds.length === ITEMS.length;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Ionicons name="battery-charging-sharp" size={24} color={Colors.success} />
          <AppText variant="h3">Instant Energy Recharge</AppText>
        </View>

        <AppText variant="body" align="center" style={styles.subtitle}>
          Your body controls your mind. Complete these zero-friction physical hacks to shift your physiological state!
        </AppText>

        {/* Checklist */}
        <View style={styles.list}>
          {ITEMS.map((item) => {
            const isDone = completedIds.includes(item.id);
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.itemCard, isDone && styles.itemCardDone]}
                onPress={() => toggleItem(item.id, item.xpReward)}
                activeOpacity={isDone ? 1 : 0.8}
              >
                <View style={styles.emojiContainer}>
                  <AppText variant="h2">{item.emoji}</AppText>
                </View>
                <View style={styles.textContainer}>
                  <AppText variant="bodyMedium" style={[styles.itemTitle, isDone && styles.itemTitleDone]}>
                    {item.title}
                  </AppText>
                  <AppText variant="caption" style={styles.itemSub}>
                    {item.sub}
                  </AppText>
                </View>
                <View style={styles.checkWrapper}>
                  {isDone ? (
                    <Ionicons name="checkmark-circle" size={26} color={Colors.success} />
                  ) : (
                    <View style={styles.uncheckRing} />
                  )}
                  <AppText variant="caption" style={[styles.xpText, isDone && styles.xpTextDone]}>
                    +{item.xpReward} XP
                  </AppText>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Finish & Progress */}
        <View style={styles.footer}>
          {!isAllCompleted ? (
            <View style={styles.progressContainer}>
              <AppText variant="small" color="muted">
                Completed {completedIds.length} of {ITEMS.length} hacks
              </AppText>
              <View style={styles.track}>
                <View
                  style={[
                    styles.fill,
                    { width: `${(completedIds.length / ITEMS.length) * 100}%` },
                  ]}
                />
              </View>
              <TouchableOpacity style={styles.btnCancel} onPress={onBack}>
                <AppText variant="small" style={styles.cancelText}>Nevermind, go back</AppText>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.btnFinish} onPress={onComplete}>
              <LinearGradient
                colors={Gradients.success}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.finishGradient}
              >
                <AppText variant="bodyMedium" style={styles.btnFinishText}>
                  Claim +10 XP Bonus & Return
                </AppText>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    ...Shadows.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    color: Colors.charcoalSoft,
    marginBottom: Spacing.lg,
  },
  list: {
    width: '100%',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  itemCardDone: {
    backgroundColor: Colors.successLight,
    borderColor: Colors.success + '44',
  },
  emojiContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  itemTitle: {
    color: Colors.charcoal,
    fontWeight: '600',
  },
  itemTitleDone: {
    color: Colors.charcoalSoft,
    textDecorationLine: 'line-through',
  },
  itemSub: {
    color: Colors.charcoalSoft,
  },
  checkWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minWidth: 44,
  },
  uncheckRing: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.muted,
  },
  xpText: {
    color: Colors.muted,
    fontWeight: '600',
    fontSize: 9,
  },
  xpTextDone: {
    color: Colors.success,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  track: {
    width: '80%',
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginVertical: Spacing.xs,
  },
  fill: {
    height: '100%',
    backgroundColor: Colors.success,
    borderRadius: 3,
  },
  btnCancel: {
    marginTop: Spacing.sm,
    padding: Spacing.xs,
  },
  cancelText: {
    color: Colors.muted,
    textDecorationLine: 'underline',
  },
  btnFinish: {
    width: '100%',
    borderRadius: Radii.lg,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  finishGradient: {
    width: '100%',
    paddingVertical: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnFinishText: {
    color: Colors.white,
    fontWeight: '600',
  },
});
