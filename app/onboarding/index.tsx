import React from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Screen from '@/components/ui/Screen';
import AppText from '@/components/ui/AppText';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { Colors, Spacing, Radii, Gradients, Shadows } from '@/constants/theme';

import { useAppStore } from '@/store/useAppStore';

const { width } = Dimensions.get('window');

export default function OnboardingWelcome() {
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  
  const cardBg = isDarkMode ? '#1C1C1E' : Colors.white;
  const borderCol = isDarkMode ? '#2C2C2E' : Colors.border;
  const emojiBg = isDarkMode ? 'rgba(45, 127, 249, 0.15)' : Colors.blueLight;

  return (
    <Screen>
      <View style={styles.container}>
        {/* Futuristic Top Header Banner */}
        <View style={styles.topSection}>
          <View style={[styles.logoContainer, { backgroundColor: cardBg, borderColor: borderCol }]}>
            <Image
              source={require('../../assets/icon.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          <AppText variant="hero" style={styles.headline} align="center">
            CoreShift
          </AppText>
          <AppText variant="bodyMedium" color="muted" align="center" style={styles.sub}>
            Change from the inside out. Forge a resilient, science-backed system for ultimate self-mastery.
          </AppText>
        </View>

        {/* Feature List Cards */}
        <View style={styles.features}>
          {[
            {
              emoji: '🎯',
              title: 'High-Agency Habits',
              desc: 'Select daily action loops tailored to your spiritual, physical, and intellectual growth.',
            },
            {
              emoji: '⚡',
              title: 'Active Rescue Systems',
              desc: 'Overcome laziness, overthinking, fatigue, and urges with active state-shifting interventions.',
            },
            {
              emoji: '📊',
              title: 'Deep Progress Analytics',
              desc: 'Measure self-improvement and consistency through GitHub-style heatmap contribution calendars.',
            },
          ].map((item, idx) => (
            <View
              key={idx}
              style={[
                styles.featureRow,
                { backgroundColor: cardBg, borderColor: borderCol }
              ]}
            >
              <View style={[styles.featureEmojiContainer, { backgroundColor: emojiBg }]}>
                <AppText style={styles.featureEmoji}>{item.emoji}</AppText>
              </View>
              <View style={styles.featureTextContainer}>
                <AppText variant="bodyMedium" style={styles.featureTitle}>
                  {item.title}
                </AppText>
                <AppText variant="caption" color="muted" style={styles.featureDesc}>
                  {item.desc}
                </AppText>
              </View>
            </View>
          ))}
        </View>

        {/* Start Button */}
        <View style={styles.footer}>
          <PrimaryButton
            title="Initialize Onboarding"
            onPress={() => router.push('/onboarding/goals')}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  topSection: {
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.md,
  },
  logoContainer: {
    width: 90,
    height: 90,
    borderRadius: Radii.lg,
    overflow: 'hidden',
    marginBottom: Spacing.base,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Shadows.md,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  headline: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.charcoal,
    letterSpacing: -1,
  },
  sub: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.xs,
    lineHeight: 20,
  },
  features: {
    gap: Spacing.md,
    marginVertical: Spacing.lg,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
    ...Shadows.sm,
  },
  featureEmojiContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.blueLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureEmoji: {
    fontSize: 20,
  },
  featureTextContainer: {
    flex: 1,
    gap: 2,
  },
  featureTitle: {
    fontWeight: '700',
    color: Colors.charcoal,
  },
  featureDesc: {
    lineHeight: 14,
  },
  footer: {
    paddingBottom: Spacing.md,
  },
});
