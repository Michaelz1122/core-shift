import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Screen from '@/components/ui/Screen';
import AppText from '@/components/ui/AppText';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { ALL_STRUGGLES } from '@/data/mockStruggles';
import { useAppStore } from '@/store/useAppStore';
import { Colors, Spacing, Radii, Shadows, Typography } from '@/constants/theme';

export default function StruggleSelection() {
  const { selectedStruggleIds, toggleStruggle, isDarkMode } = useAppStore();
  const canContinue = selectedStruggleIds.length >= 1;
  const atMax = selectedStruggleIds.length >= 3;

  const handleToggle = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleStruggle(id as any);
  };

  return (
    <Screen scroll>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={isDarkMode ? '#FFFFFF' : Colors.charcoal} />
        </TouchableOpacity>
        
        <View style={styles.stepRow}>
          <AppText variant="label" color="primaryBlue" style={styles.stepLabel}>
            STATION 02 // FRICTION DECRYPTION
          </AppText>
        </View>
        <AppText variant="h1" style={styles.title}>Where does your physical & mental friction lie?</AppText>
        <AppText variant="body" style={styles.subtitle}>
          Identify the friction vectors you want CoreShift to help you instantly override. ({selectedStruggleIds.length}/3 selected)
        </AppText>
        
        {/* Step progress tracker */}
        <View style={styles.pills}>
          <View style={[styles.pill, styles.pillActive]} />
          <View style={[styles.pill, styles.pillActive]} />
          <View style={styles.pill} />
        </View>
      </View>

      <View style={styles.list}>
        {ALL_STRUGGLES.map((struggle) => {
          const selected = selectedStruggleIds.includes(struggle.id);
          const disabled = atMax && !selected;

          const cardBg = selected
            ? (isDarkMode ? 'rgba(45, 127, 249, 0.15)' : Colors.blueLight)
            : (isDarkMode ? '#1C1C1E' : Colors.white);

          const cardBorder = selected
            ? Colors.primaryBlue
            : (isDarkMode ? '#2C2C2E' : Colors.border);

          const emojiContainerBg = selected
            ? (isDarkMode ? '#1C1C1E' : Colors.white)
            : (isDarkMode ? '#121214' : Colors.background);

          const emojiContainerBorder = selected
            ? 'rgba(45, 127, 249, 0.2)'
            : (isDarkMode ? '#2C2C2E' : Colors.border);

          const labelColor = selected
            ? Colors.primaryBlue
            : (isDarkMode ? '#FFFFFF' : Colors.charcoal);

          return (
            <TouchableOpacity
              key={struggle.id}
              style={[
                styles.card,
                {
                  backgroundColor: cardBg,
                  borderColor: cardBorder,
                },
                disabled && !selected && styles.cardDimmed,
              ]}
              onPress={() => handleToggle(struggle.id)}
              disabled={disabled}
              activeOpacity={0.75}
            >
              <View style={styles.cardRow}>
                <View
                  style={[
                    styles.emojiContainer,
                    {
                      backgroundColor: emojiContainerBg,
                      borderColor: emojiContainerBorder,
                    }
                  ]}
                >
                  <AppText style={styles.emoji}>{struggle.emoji}</AppText>
                </View>
                <View style={styles.textContainer}>
                  <AppText
                    variant="bodyMedium"
                    style={[
                      styles.label,
                      { color: labelColor },
                      selected && styles.labelSelected
                    ]}
                  >
                    {struggle.label}
                  </AppText>
                  <AppText variant="caption" color="muted">
                    Bypass daily {struggle.id} blockages
                  </AppText>
                </View>
              </View>
              <View style={[styles.checkbox, selected && styles.checkboxActive]}>
                {selected ? (
                  <Ionicons name="checkmark" size={12} color={Colors.white} />
                ) : (
                  <View style={styles.checkboxInner} />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.footer}>
        {atMax && (
          <AppText variant="caption" align="center" color="muted" style={styles.maxText}>
            Maximum of 3 friction variables identified
          </AppText>
        )}
        <PrimaryButton
          title="Proceed to Station 03"
          onPress={() => router.push('/onboarding/habits')}
          disabled={!canContinue}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: Spacing.xl, marginBottom: Spacing.base, gap: Spacing.xs },
  backBtn: { alignSelf: 'flex-start', padding: Spacing.xs, marginLeft: -Spacing.xs, marginBottom: Spacing.xs },
  stepRow: { marginBottom: Spacing.xs },
  stepLabel: { fontSize: 11, letterSpacing: 1, fontWeight: '700' },
  title: { fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { marginTop: Spacing.xs, color: Colors.charcoalSoft, lineHeight: 20 },
  pills: { flexDirection: 'row', gap: Spacing.xs, marginTop: Spacing.md },
  pill: { width: 36, height: 5, borderRadius: Radii.sm, backgroundColor: Colors.border },
  pillActive: { backgroundColor: Colors.primaryBlue },

  list: { marginVertical: Spacing.sm },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: Radii.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  cardSelected: {
    borderColor: Colors.primaryBlue,
    backgroundColor: Colors.blueLight,
    ...Shadows.md,
  },
  cardDimmed: { opacity: 0.35 },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, flex: 1 },
  emojiContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emojiContainerSelected: {
    backgroundColor: Colors.white,
    borderColor: 'rgba(45, 127, 249, 0.2)',
  },
  emoji: { fontSize: 18 },
  textContainer: { flex: 1, gap: 2 },
  label: { fontSize: Typography.base, fontWeight: '600', color: Colors.charcoal },
  labelSelected: { color: Colors.primaryBlue, fontWeight: '700' },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: Colors.primaryBlue,
    borderColor: Colors.primaryBlue,
  },
  checkboxInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'transparent',
  },

  footer: { marginTop: Spacing.xl, gap: Spacing.sm, paddingBottom: Spacing.xl },
  maxText: { fontWeight: '600', color: Colors.primaryBlue },
});
