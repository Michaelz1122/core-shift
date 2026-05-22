import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Screen from '@/components/ui/Screen';
import AppText from '@/components/ui/AppText';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { Colors, Spacing } from '@/constants/theme';
import { Copy } from '@/constants/copy';

export default function OnboardingWelcome() {
  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.topSection}>
          <View style={styles.iconBlock}>
            <AppText style={styles.icon}>🌱</AppText>
          </View>
          <AppText variant="hero" style={styles.headline} align="center">
            {Copy.onboarding.headline}
          </AppText>
          <AppText variant="body" style={styles.sub} align="center">
            {Copy.onboarding.subheadline}
          </AppText>
        </View>

        <View style={styles.features}>
          {[
            { emoji: '🎯', text: 'Set meaningful goals' },
            { emoji: '✅', text: 'Build small daily habits' },
            { emoji: '📈', text: 'Track your progress' },
            { emoji: '💙', text: 'Support yourself on hard days' },
          ].map((item) => (
            <View key={item.text} style={styles.featureRow}>
              <AppText style={styles.featureEmoji}>{item.emoji}</AppText>
              <AppText variant="bodyMedium">{item.text}</AppText>
            </View>
          ))}
        </View>

        <PrimaryButton
          title={Copy.onboarding.startButton}
          onPress={() => router.push('/onboarding/goals')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xxl,
  },
  topSection: {
    alignItems: 'center',
    gap: Spacing.base,
  },
  iconBlock: {
    width: 80,
    height: 80,
    backgroundColor: Colors.blueLight,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  icon: {
    fontSize: 36,
  },
  headline: {
    letterSpacing: -0.5,
  },
  sub: {
    paddingHorizontal: Spacing.base,
  },
  features: {
    gap: Spacing.md,
    paddingHorizontal: Spacing.base,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  featureEmoji: {
    fontSize: 22,
  },
});
