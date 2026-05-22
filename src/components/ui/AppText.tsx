import React from 'react';
import { Text, TextStyle, StyleSheet, StyleProp } from 'react-native';
import { Colors, Typography } from '@/constants/theme';

type Variant =
  | 'hero'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'body'
  | 'bodyMedium'
  | 'small'
  | 'caption'
  | 'label';

type ColorKey = keyof typeof Colors;

interface AppTextProps {
  variant?: Variant;
  color?: ColorKey;
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
  numberOfLines?: number;
  align?: 'left' | 'center' | 'right';
}

const variantStyles: Record<Variant, TextStyle> = {
  hero: {
    fontSize: Typography.xxxl,
    fontWeight: Typography.bold,
    color: Colors.charcoal,
    lineHeight: Typography.xxxl * Typography.lineHeightTight,
  },
  h1: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: Colors.charcoal,
    lineHeight: Typography.xxl * Typography.lineHeightTight,
  },
  h2: {
    fontSize: Typography.xl,
    fontWeight: Typography.semibold,
    color: Colors.charcoal,
    lineHeight: Typography.xl * Typography.lineHeightNormal,
  },
  h3: {
    fontSize: Typography.md,
    fontWeight: Typography.semibold,
    color: Colors.charcoal,
    lineHeight: Typography.md * Typography.lineHeightNormal,
  },
  body: {
    fontSize: Typography.base,
    fontWeight: Typography.regular,
    color: Colors.charcoalSoft,
    lineHeight: Typography.base * Typography.lineHeightRelaxed,
  },
  bodyMedium: {
    fontSize: Typography.base,
    fontWeight: Typography.medium,
    color: Colors.charcoal,
    lineHeight: Typography.base * Typography.lineHeightNormal,
  },
  small: {
    fontSize: Typography.sm,
    fontWeight: Typography.regular,
    color: Colors.muted,
    lineHeight: Typography.sm * Typography.lineHeightNormal,
  },
  caption: {
    fontSize: Typography.xs,
    fontWeight: Typography.regular,
    color: Colors.muted,
    lineHeight: Typography.xs * Typography.lineHeightNormal,
  },
  label: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.charcoal,
    lineHeight: Typography.sm * Typography.lineHeightNormal,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
};

export default function AppText({
  variant = 'body',
  color,
  style,
  children,
  numberOfLines,
  align = 'left',
}: AppTextProps) {
  const colorStyle: TextStyle = color ? { color: Colors[color] } : {};
  const alignStyle: TextStyle = align !== 'left' ? { textAlign: align } : {};

  return (
    <Text
      style={[variantStyles[variant], colorStyle, alignStyle, style]}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
}
