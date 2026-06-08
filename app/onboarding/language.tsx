import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import AppText from '@/components/ui/AppText';
import { useAppStore } from '@/store/useAppStore';
import { Colors, Spacing, Radii, Gradients, Shadows } from '@/constants/theme';
import type { Language } from '@/types';

const LANG_OPTIONS: { id: Language; nativeName: string; englishName: string; flag: string }[] = [
  { id: 'ar', nativeName: 'العربية', englishName: 'Arabic', flag: '🇪🇬' },
  { id: 'en', nativeName: 'English', englishName: 'English', flag: '🌍' },
];

export default function LanguageScreen() {
  const { language, setLanguage } = useAppStore();

  const handleSelect = (lang: Language) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLanguage(lang);
  };

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/onboarding/challenge');
  };

  const title = language === 'ar' ? 'اختر لغتك' : 'Choose your language';
  const subtitle =
    language === 'ar'
      ? 'تقدر تغيرها في أي وقت من الإعدادات'
      : 'You can change this anytime in settings';
  const continueLabel = language === 'ar' ? 'متابعة' : 'Continue';
  const isRTL = language === 'ar';

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <AppText style={styles.globe}>🌍</AppText>
          <AppText
            variant="h1"
            style={[styles.title, isRTL && styles.textRight]}
          >
            {title}
          </AppText>
          <AppText
            variant="body"
            color="muted"
            style={[styles.subtitle, isRTL && styles.textRight]}
          >
            {subtitle}
          </AppText>
        </View>

        {/* Language options */}
        <View style={styles.options}>
          {LANG_OPTIONS.map((opt) => {
            const selected = language === opt.id;
            return (
              <TouchableOpacity
                key={opt.id}
                onPress={() => handleSelect(opt.id)}
                activeOpacity={0.85}
                style={[
                  styles.langCard,
                  selected && styles.langCardSelected,
                ]}
              >
                <AppText style={styles.langFlag}>{opt.flag}</AppText>
                <View style={styles.langText}>
                  <AppText
                    variant="h3"
                    style={[
                      styles.langNative,
                      selected && styles.langTextSelected,
                    ]}
                  >
                    {opt.nativeName}
                  </AppText>
                  <AppText
                    variant="small"
                    style={[
                      styles.langEnglish,
                      selected && styles.langSubSelected,
                    ]}
                  >
                    {opt.englishName}
                  </AppText>
                </View>
                {selected && (
                  <View style={styles.checkCircle}>
                    <AppText style={styles.checkMark}>✓</AppText>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Continue */}
        <TouchableOpacity
          onPress={handleContinue}
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
              {continueLabel}
            </AppText>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xl,
    justifyContent: 'space-between',
  },
  header: { gap: Spacing.md, alignItems: 'flex-start' },
  globe: { fontSize: 42, marginBottom: Spacing.xs },
  title: { fontWeight: '800', letterSpacing: -0.5, color: Colors.charcoal },
  subtitle: { lineHeight: 22 },
  textRight: { textAlign: 'right', writingDirection: 'rtl' },

  options: { gap: Spacing.base },
  langCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
    padding: Spacing.lg,
    borderRadius: Radii.xl,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
    ...Shadows.sm,
  },
  langCardSelected: {
    borderColor: Colors.primaryBlue,
    backgroundColor: Colors.blueLight,
  },
  langFlag: { fontSize: 38 },
  langText: { flex: 1, gap: 2 },
  langNative: { fontWeight: '800', color: Colors.charcoal, fontSize: 22 },
  langTextSelected: { color: Colors.primaryBlue },
  langEnglish: { color: Colors.muted, fontWeight: '500' },
  langSubSelected: { color: Colors.primaryBlue + 'AA' },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primaryBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMark: { color: Colors.white, fontWeight: '800', fontSize: 14 },

  ctaWrapper: { borderRadius: Radii.xl, overflow: 'hidden', ...Shadows.md },
  cta: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
  },
  ctaText: { color: Colors.white, fontWeight: '700', fontSize: 17 },
});
