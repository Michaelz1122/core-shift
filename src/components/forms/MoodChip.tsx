import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MoodType } from '@/types';
import { Colors, Spacing, Radii, Typography } from '@/constants/theme';
import AppText from '@/components/ui/AppText';

const MOOD_CONFIG: Record<MoodType, { label: string; emoji: string }> = {
  calm: { label: 'Calm', emoji: '😌' },
  tired: { label: 'Tired', emoji: '😴' },
  focused: { label: 'Focused', emoji: '🎯' },
  stressed: { label: 'Stressed', emoji: '😤' },
  low: { label: 'Low', emoji: '😔' },
  motivated: { label: 'Motivated', emoji: '💪' },
};

interface MoodChipProps {
  mood: MoodType;
  selected: boolean;
  onPress: () => void;
}

export default function MoodChip({ mood, selected, onPress }: MoodChipProps) {
  const config = MOOD_CONFIG[mood];
  return (
    <TouchableOpacity
      style={[styles.chip, selected ? styles.selected : null]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <AppText style={styles.emoji}>{config.emoji}</AppText>
      <AppText
        variant="small"
        style={[styles.label, selected ? styles.labelSelected : null]}
      >
        {config.label}
      </AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.card,
    borderRadius: Radii.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    minWidth: 72,
    gap: Spacing.xs,
  },
  selected: {
    borderColor: Colors.primaryBlue,
    backgroundColor: Colors.blueLight,
  },
  emoji: {
    fontSize: 22,
  },
  label: {
    color: Colors.charcoalSoft,
    fontSize: Typography.xs,
    fontWeight: '500' as const,
  },
  labelSelected: {
    color: Colors.primaryBlue,
    fontWeight: '600' as const,
  },
});
