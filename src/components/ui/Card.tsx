import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Colors, Radii, Shadows, Spacing } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'highlighted' | 'flat';
  padding?: number;
}

export default function Card({
  children,
  style,
  variant = 'default',
  padding = Spacing.base,
}: CardProps) {
  return (
    <View
      style={[
        styles.base,
        variant === 'highlighted' ? styles.highlighted : null,
        variant === 'flat' ? styles.flat : null,
        { padding },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.card,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  highlighted: {
    backgroundColor: Colors.blueLight,
    borderColor: Colors.primaryBlue,
    borderWidth: 1.5,
  },
  flat: {
    backgroundColor: Colors.card,
    borderWidth: 0,
    ...Shadows.md,
  },
});
