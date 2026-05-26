import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Colors, Radii, Shadows, Spacing } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

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
  const isDarkMode = useAppStore((state) => state.isDarkMode);

  // Resolve dynamic background & border colors based on theme mode
  const cardBg = isDarkMode
    ? variant === 'highlighted' ? 'rgba(45, 127, 249, 0.15)' : '#1C1C1E'
    : variant === 'highlighted' ? Colors.blueLight : Colors.card;

  const cardBorder = isDarkMode
    ? variant === 'highlighted' ? Colors.primaryBlue : '#2C2C2E'
    : variant === 'highlighted' ? Colors.primaryBlue : Colors.border;

  const dynamicStyles = {
    backgroundColor: cardBg,
    borderColor: cardBorder,
    borderWidth: variant === 'flat' ? 0 : (variant === 'highlighted' ? 1.5 : 1),
  };

  return (
    <View
      style={[
        styles.base,
        style,
        dynamicStyles,
        { padding },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radii.lg,
    ...Shadows.sm,
  },
});
