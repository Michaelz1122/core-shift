import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radii, Typography } from '@/constants/theme';
import AppText from '@/components/ui/AppText';

interface HabitToggleProps {
  title: string;
  completed: boolean;
  onToggle: () => void;
  onPressDetails?: () => void;
}

export default function HabitToggle({ title, completed, onToggle, onPressDetails }: HabitToggleProps) {
  return (
    <View style={[styles.row, completed ? styles.rowDone : null]}>
      <TouchableOpacity
        style={[styles.check, completed ? styles.checkDone : null]}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        {completed && <Ionicons name="checkmark" size={14} color={Colors.white} />}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.detailsClickable}
        onPress={onPressDetails}
        disabled={!onPressDetails}
        activeOpacity={0.6}
      >
        <AppText
          variant="bodyMedium"
          style={[styles.text, completed ? styles.textDone : null]}
          numberOfLines={1}
        >
          {title}
        </AppText>
        {onPressDetails && (
          <Ionicons name="chevron-forward" size={16} color={Colors.muted} />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
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
  detailsClickable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
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
