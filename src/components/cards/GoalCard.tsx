import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Goal } from '@/types';
import { Colors, Spacing, Radii, Typography, Shadows } from '@/constants/theme';
import AppText from '@/components/ui/AppText';
import * as Haptics from 'expo-haptics';

import { useAppStore } from '@/store/useAppStore';

interface GoalCardProps {
  goal: Goal;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
}

export default function GoalCard({ goal, selected, onPress, disabled }: GoalCardProps) {
  const isDarkMode = useAppStore((state) => state.isDarkMode);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const cardBg = selected
    ? (isDarkMode ? 'rgba(45, 127, 249, 0.15)' : Colors.blueLight)
    : (isDarkMode ? '#1C1C1E' : Colors.white);

  const cardBorder = selected
    ? Colors.primaryBlue
    : (isDarkMode ? '#2C2C2E' : Colors.border);

  const emojiContainerBg = selected
    ? (isDarkMode ? '#1C1C1E' : Colors.white)
    : (isDarkMode ? '#121214' : Colors.background);

  const emojiContainerBorder = selected
    ? 'rgba(45, 127, 249, 0.2)'
    : (isDarkMode ? '#2C2C2E' : Colors.border);

  const labelColor = selected
    ? Colors.primaryBlue
    : (isDarkMode ? '#FFFFFF' : Colors.charcoal);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: cardBg,
          borderColor: cardBorder,
        },
        disabled && !selected && styles.dimmed,
      ]}
      onPress={handlePress}
      disabled={disabled && !selected}
      activeOpacity={0.75}
    >
      <View style={styles.row}>
        <View
          style={[
            styles.emojiContainer,
            {
              backgroundColor: emojiContainerBg,
              borderColor: emojiContainerBorder,
            }
          ]}
        >
          <AppText style={styles.emoji}>{goal.emoji}</AppText>
        </View>
        <View style={styles.textContainer}>
          <AppText
            variant="bodyMedium"
            style={[
              styles.label,
              { color: labelColor },
              selected && styles.labelSelected
            ]}
          >
            {goal.label}
          </AppText>
          <AppText variant="caption" color="muted" numberOfLines={1}>
            Map to your {goal.id} loop systems
          </AppText>
        </View>
      </View>
      <View style={[styles.checkbox, selected && styles.checkboxActive]}>
        {selected ? (
          <Ionicons name="checkmark" size={12} color={Colors.white} />
        ) : (
          <View style={styles.checkboxInner} />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: Radii.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  selected: {
    borderColor: Colors.primaryBlue,
    backgroundColor: Colors.blueLight,
    ...Shadows.md,
  },
  dimmed: {
    opacity: 0.35,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  emojiContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emojiContainerSelected: {
    backgroundColor: Colors.white,
    borderColor: 'rgba(45, 127, 249, 0.2)',
  },
  emoji: {
    fontSize: 18,
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontSize: Typography.base,
    fontWeight: '600',
    color: Colors.charcoal,
  },
  labelSelected: {
    color: Colors.primaryBlue,
    fontWeight: '700',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: Colors.primaryBlue,
    borderColor: Colors.primaryBlue,
  },
  checkboxInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'transparent',
  },
});
