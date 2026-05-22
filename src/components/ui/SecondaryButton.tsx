import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Typography, Spacing, Radii } from '@/constants/theme';
import AppText from './AppText';

interface SecondaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  variant?: 'outline' | 'ghost';
}

export default function SecondaryButton({
  title,
  onPress,
  disabled = false,
  style,
  variant = 'outline',
}: SecondaryButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'outline' ? styles.outline : null,
        variant === 'ghost' ? styles.ghost : null,
        disabled ? styles.disabled : null,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <AppText
        variant="bodyMedium"
        style={variant === 'ghost' ? styles.ghostText : styles.text}
      >
        {title}
      </AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: Radii.md,
    paddingVertical: Spacing.md + 2,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    width: '100%',
  },
  outline: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.4,
  },
  text: {
    color: Colors.charcoal,
    fontWeight: '500' as const,
    fontSize: Typography.base,
  },
  ghostText: {
    color: Colors.primaryBlue,
    fontWeight: '500' as const,
    fontSize: Typography.base,
  },
});
