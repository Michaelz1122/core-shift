import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, Spacing, Radii, Typography } from '@/constants/theme';
import AppText from '@/components/ui/AppText';
import Card from '@/components/ui/Card';

interface ProgressCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  accent?: boolean;
}

export default function ProgressCard({ label, value, subtitle, accent }: ProgressCardProps) {
  return (
    <Card style={[styles.card, accent ? styles.accent : null]}>
      <AppText variant="caption" style={styles.label}>
        {label}
      </AppText>
      <AppText
        variant="h1"
        style={accent ? styles.accentText : styles.value}
      >
        {value}
      </AppText>
      {subtitle ? (
        <AppText variant="small" style={styles.subtitle}>
          {subtitle}
        </AppText>
      ) : null}
    </Card>
  );
}

export function ProgressBar({ value, total }: { value: number; total: number }) {
  const pct = total > 0 ? Math.min(value / total, 1) : 0;
  return (
    <View style={barStyles.track}>
      <View style={[barStyles.fill, { width: `${pct * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  accent: {
    borderColor: Colors.primaryBlue,
    backgroundColor: Colors.blueLight,
  },
  label: {
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
    color: Colors.muted,
  },
  value: {
    fontSize: Typography.xxl,
    color: Colors.charcoal,
  },
  accentText: {
    fontSize: Typography.xxl,
    color: Colors.primaryBlue,
  },
  subtitle: {
    marginTop: Spacing.xs,
    color: Colors.muted,
  },
});

const barStyles = StyleSheet.create({
  track: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: Radii.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: Colors.primaryBlue,
    borderRadius: Radii.full,
  },
});
