import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Habit } from '@/types';
import { Colors, Spacing, Radii, Typography } from '@/constants/theme';
import AppText from '@/components/ui/AppText';

interface HabitItemProps {
  habit: Habit;
  completed?: boolean;
  onToggle?: () => void;
  onPress?: () => void;
  showGoal?: boolean;
  rightAction?: React.ReactNode;
}

export default function HabitItem({
  habit,
  completed = false,
  onToggle,
  onPress,
  showGoal = false,
  rightAction,
}: HabitItemProps) {
  return (
    <TouchableOpacity
      style={[styles.container, completed && styles.completed]}
      onPress={onPress ?? onToggle}
      activeOpacity={0.7}
    >
      <TouchableOpacity
        style={[styles.check, completed && styles.checkDone]}
        onPress={onToggle}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        {completed && (
          <Ionicons name="checkmark" size={14} color={Colors.white} />
        )}
      </TouchableOpacity>

      <View style={styles.textBlock}>
        <AppText
          variant="bodyMedium"
          style={completed ? styles.textDone : undefined}
          numberOfLines={1}
        >
          {habit.title}
        </AppText>
        {showGoal && (
          <AppText variant="caption" style={styles.goal}>
            {habit.goalId.replace(/-/g, ' ')}
          </AppText>
        )}
      </View>

      {rightAction ?? (
        <Ionicons name="chevron-forward" size={16} color={Colors.muted} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  completed: {
    backgroundColor: Colors.successLight,
    borderColor: Colors.success,
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkDone: {
    backgroundColor: Colors.primaryBlue,
    borderColor: Colors.primaryBlue,
  },
  textBlock: {
    flex: 1,
  },
  textDone: {
    textDecorationLine: 'line-through',
    color: Colors.muted,
  },
  goal: {
    marginTop: 2,
    textTransform: 'capitalize',
  },
});
