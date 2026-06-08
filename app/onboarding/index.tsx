import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AppText from '@/components/ui/AppText';
import { Colors, Spacing, Radii, Gradients, Shadows } from '@/constants/theme';
import { useTranslation } from '@/i18n';
import { useAppStore } from '@/store/useAppStore';

interface FeatureCard {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  desc: string;
  gradient: readonly [string, string];
}

export default function OnboardingWelcome() {
  const { t, isRTL } = useTranslation();
  const isDarkMode = useAppStore((s) => s.isDarkMode);

  const cardBg = isDarkMode ? '#1C1C1E' : Colors.card;
  const borderCol = isDarkMode ? '#2C2C2E' : Colors.border;
  const themeBg = isDarkMode ? '#121214' : Colors.background;

  const features: FeatureCard[] = [
    {
      icon: 'person-circle-outline',
      title: t.welcomeFeature1Title,
      desc: t.welcomeFeature1Desc,
      gradient: Gradients.primary,
    },
    {
      icon: 'shield-checkmark-outline',
      title: t.welcomeFeature2Title,
      desc: t.welcomeFeature2Desc,
      gradient: Gradients.purple,
    },
    {
      icon: 'bar-chart-outline',
      title: t.welcomeFeature3Title,
      desc: t.welcomeFeature3Desc,
      gradient: Gradients.gold,
    },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: themeBg }]} edges={['top', 'bottom']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <LinearGradient
            colors={Gradients.xp}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoGradient}
          >
            <AppText style={styles.logoEmoji}>⚡</AppText>
          </LinearGradient>
          <AppText
            variant="hero"
            style={[styles.title, isRTL && styles.textRight]}
          >
            {t.welcomeTitle}
          </AppText>
          <AppText
            variant="body"
            style={[styles.subtitle, isRTL && styles.textRight]}
          >
            {t.welcomeSubtitle}
          </AppText>
        </View>

        {/* Feature cards */}
        <View style={styles.features}>
          {features.map((f) => (
            <View
              key={f.title}
              style={[
                styles.featureCard,
                { backgroundColor: cardBg, borderColor: borderCol },
              ]}
            >
              <LinearGradient
                colors={f.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.featureIcon}
              >
                <Ionicons name={f.icon} size={20} color={Colors.white} />
              </LinearGradient>
              <View style={styles.featureText}>
                <AppText
                  variant="bodyMedium"
                  style={[styles.featureTitle, isRTL && styles.textRight]}
                >
                  {f.title}
                </AppText>
                <AppText
                  variant="small"
                  color="muted"
                  style={isRTL ? styles.textRight : undefined}
                >
                  {f.desc}
                </AppText>
              </View>
            </View>
          ))}
        </View>

        {/* CTA */}
        <TouchableOpacity
          onPress={() => router.push('/onboarding/language')}
          activeOpacity={0.9}
          style={styles.ctaWrapper}
        >
          <LinearGradient
            colors={Gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.cta}
          >
            <AppText variant="bodyMedium" style={styles.ctaText}>
              {t.welcomeButton}
            </AppText>
            <Ionicons name="arrow-forward" size={18} color={Colors.white} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xl,
    justifyContent: 'space-between',
  },
  header: { gap: Spacing.base, alignItems: 'flex-start' },
  logoGradient: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    ...Shadows.md,
  },
  logoEmoji: { fontSize: 26 },
  title: {
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 40,
    color: Colors.charcoal,
  },
  subtitle: { color: Colors.charcoalSoft, lineHeight: 22 },
  textRight: { textAlign: 'right', writingDirection: 'rtl' },

  features: { gap: Spacing.sm },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radii.lg,
    borderWidth: 1,
    ...Shadows.sm,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: Radii.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: { flex: 1, gap: 2 },
  featureTitle: { fontWeight: '700', color: Colors.charcoal },

  ctaWrapper: { borderRadius: Radii.xl, overflow: 'hidden', ...Shadows.md },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
  },
  ctaText: { color: Colors.white, fontWeight: '700', fontSize: 17 },
});
