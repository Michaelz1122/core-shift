import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { RescueFeeling } from '@/types';
import { Colors, Spacing, Radii, Typography } from '@/constants/theme';
import AppText from '@/components/ui/AppText';

const FEELING_CONFIG: Record<RescueFeeling, { label: string; emoji: string }> = {
  laziness: { label: 'Laziness', emoji: '🛋️' },
  distraction: { label: 'Distraction', emoji: '📱' },
  'low-motivation': { label: 'Low Motivation', emoji: '🔋' },
  'harmful-urge': { label: 'Harmful Urge', emoji: '⚡' },
  relapse: { label: 'Relapse / Slipped', emoji: '🔄' },
  sadness: { label: 'Sadness', emoji: '💙' },
  anxiety: { label: 'Anxiety', emoji: '🌊' },
  loneliness: { label: 'Loneliness', emoji: '🤍' },
  'feeling-lost': { label: 'Feeling Lost', emoji: '🧭' },
};

import { useAppStore } from '@/store/useAppStore';

interface RescueFeelingCardProps {
  feeling: RescueFeeling;
  onPress: () => void;
}

export default function RescueFeelingCard({ feeling, onPress }: RescueFeelingCardProps) {
  const config = FEELING_CONFIG[feeling];
  const isDarkMode = useAppStore((state) => state.isDarkMode);

  const cardBg = isDarkMode ? '#1C1C1E' : Colors.card;
  const cardBorder = isDarkMode ? '#2C2C2E' : Colors.border;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <AppText style={styles.emoji}>{config.emoji}</AppText>
      <AppText variant="bodyMedium" style={styles.label}>
        {config.label}
      </AppText>
    </TouchableOpacity>
  );
}

export { FEELING_CONFIG };

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.card,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.sm,
  },
  emoji: {
    fontSize: 22,
  },
  label: {
    color: Colors.charcoal,
    fontSize: Typography.base,
  },
});
