import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Spacing } from '@/constants/theme';
import AppText from './AppText';

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  style?: ViewStyle;
  children?: React.ReactNode;
}

export default function EmptyState({
  title,
  subtitle,
  style,
  children,
}: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      <AppText variant="h3" align="center" style={styles.title}>
        {title}
      </AppText>
      {subtitle ? (
        <AppText variant="body" align="center" style={styles.subtitle}>
          {subtitle}
        </AppText>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl,
    paddingHorizontal: Spacing.xl,
  },
  title: {
    marginBottom: Spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
});
