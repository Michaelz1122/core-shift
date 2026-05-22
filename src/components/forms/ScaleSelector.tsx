import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Spacing, Radii, Typography } from '@/constants/theme';
import AppText from '@/components/ui/AppText';

interface ScaleSelectorProps {
  value: number;
  max?: number;
  onChange: (v: number) => void;
  label?: string;
}

export default function ScaleSelector({
  value,
  max = 5,
  onChange,
  label,
}: ScaleSelectorProps) {
  return (
    <View style={styles.container}>
      {label ? (
        <AppText variant="bodyMedium" style={styles.label}>
          {label}
        </AppText>
      ) : null}
      <View style={styles.row}>
        {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
          <TouchableOpacity
            key={n}
            style={[styles.dot, n <= value ? styles.dotActive : null]}
            onPress={() => onChange(n)}
            activeOpacity={0.7}
          >
            <AppText
              style={[styles.dotText, n <= value ? styles.dotTextActive : null]}
            >
              {n}
            </AppText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.base,
  },
  label: {
    marginBottom: Spacing.sm,
    color: Colors.charcoal,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  dot: {
    width: 48,
    height: 48,
    borderRadius: Radii.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotActive: {
    backgroundColor: Colors.primaryBlue,
    borderColor: Colors.primaryBlue,
  },
  dotText: {
    fontSize: Typography.base,
    fontWeight: '600' as const,
    color: Colors.muted,
  },
  dotTextActive: {
    color: Colors.white,
  },
});
