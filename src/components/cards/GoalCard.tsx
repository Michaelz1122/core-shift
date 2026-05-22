import React from 'react';
import { TouchableOpacity, View, StyleSheet, StyleProp, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Goal } from '@/types';
import { Colors, Spacing, Radii, Typography } from '@/constants/theme';
import AppText from '@/components/ui/AppText';

interface GoalCardProps {
  goal: Goal;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
}

export default function GoalCard({ goal, selected, onPress, disabled }: GoalCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, selected ? styles.selected : null, disabled && !selected ? styles.dimmed : null]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.row}>
        <AppText style={styles.emoji}>{goal.emoji}</AppText>
        <AppText
          variant="bodyMedium"
          style={[styles.label, selected ? styles.labelSelected : null]}
        >
          {goal.label}
        </AppText>
      </View>
      {selected && (
        <Ionicons name="checkmark-circle" size={20} color={Colors.primaryBlue} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.card,
    borderRadius: Radii.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.sm,
  },
  selected: {
    borderColor: Colors.primaryBlue,
    backgroundColor: Colors.blueLight,
  },
  dimmed: {
    opacity: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  emoji: {
    fontSize: 20,
  },
  label: {
    fontSize: Typography.base,
    color: Colors.charcoal,
  },
  labelSelected: {
    color: Colors.primaryBlue,
    fontWeight: '600' as const,
  },
});
