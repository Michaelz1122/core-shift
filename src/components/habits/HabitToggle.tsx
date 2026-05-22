import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radii, Typography } from '@/constants/theme';
import AppText from '@/components/ui/AppText';

interface HabitToggleProps {
  title: string;
  completed: boolean;
  onToggle: () => void;
}

export default function HabitToggle({ title, completed, onToggle }: HabitToggleProps) {
  return (
    <TouchableOpacity
      style={[styles.row, completed ? styles.rowDone : null]}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View style={[styles.check, completed ? styles.checkDone : null]}>
        {completed && <Ionicons name="checkmark" size={14} color={Colors.white} />}
      </View>
      <AppText
        variant="bodyMedium"
        style={[styles.text, completed ? styles.textDone : null]}
        numberOfLines={1}
      >
        {title}
      </AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm + 2,
  },
  rowDone: {
    opacity: 0.7,
  },
  check: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkDone: {
    backgroundColor: Colors.primaryBlue,
    borderColor: Colors.primaryBlue,
  },
  text: {
    flex: 1,
    fontSize: Typography.base,
    color: Colors.charcoal,
  },
  textDone: {
    textDecorationLine: 'line-through' as const,
    color: Colors.muted,
  },
});
