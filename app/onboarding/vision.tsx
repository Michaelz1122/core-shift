import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import AppText from '@/components/ui/AppText';
import { useAppStore } from '@/store/useAppStore';
import { ALL_VISIONS } from '@/data/visions';
import { Colors, Spacing, Radii, Gradients, Shadows } from '@/constants/theme';
import { useTranslation } from '@/i18n';
import type { VisionId } from '@/types';

// ── Step dots (reused from challenge screen pattern) ──────────────────────────

function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <View style={stepStyles.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            stepStyles.dot,
            i < current ? stepStyles.dotDone : i === current ? stepStyles.dotActive : stepStyles.dotPending,
          ]}
        />
      ))}
    </View>
  );
}

const stepStyles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 6 },
  dot: { height: 6, borderRadius: 3 },
  dotDone: { width: 16, backgroundColor: Colors.primaryBlue },
  dotActive: { width: 24, backgroundColor: Colors.primaryBlue },
  dotPending: { width: 16, backgroundColor: Colors.border },
});

// ── Main screen ───────────────────────────────────────────────────────────────

export default function VisionScreen() {
  const { t, language, isRTL } = useTranslation();
  const { selectedVisionIds, toggleVision } = useAppStore();

  const handleToggle = (id: VisionId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleVision(id);
  };

  const canContinue = selectedVisionIds.length >= 1;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Fixed header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.charcoal} />
        </TouchableOpacity>
        <StepDots current={2} total={4} />
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View style={styles.titleBlock}>
          <AppText variant="label" color="primaryBlue" style={isRTL ? styles.textRight : undefined}>
            {language === 'ar' ? 'خطوة ٢ من ٤' : 'Step 2 of 4'}
          </AppText>
          <AppText
            variant="h1"
            style={[styles.title, isRTL && styles.textRight]}
          >
            {t.visionTitle}
          </AppText>
          <AppText
            variant="body"
            color="muted"
            style={[styles.subtitle, isRTL && styles.textRight]}
          >
            {t.visionSubtitle}
          </AppText>
        </View>

        {/* 90-day vision badge */}
        <View style={styles.dayBadge}>
          <LinearGradient
            colors={Gradients.gold}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.dayBadgeGradient}
          >
            <AppText style={styles.dayBadgeText}>
              {language === 'ar' ? '🎯 رحلة ٩٠ يوم' : '🎯 90-Day Journey'}
            </AppText>
          </LinearGradient>
        </View>

        {/* Vision pills grid */}
        <View style={styles.grid}>
          {ALL_VISIONS.map((vision) => {
            const selected = selectedVisionIds.includes(vision.id);
            return (
              <TouchableOpacity
                key={vision.id}
                onPress={() => handleToggle(vision.id)}
                activeOpacity={0.8}
                style={[styles.pill, selected && styles.pillSelected]}
              >
                <AppText style={styles.pillEmoji}>{vision.emoji}</AppText>
                <AppText
                  variant="bodyMedium"
                  style={[
                    styles.pillLabel,
                    selected && styles.pillLabelSelected,
                    isRTL && styles.textRight,
                  ]}
                >
                  {vision.label[language]}
                </AppText>
                {selected && (
                  <Ionicons name="checkmark-circle" size={18} color={Colors.primaryBlue} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Counter */}
        {selectedVisionIds.length > 0 && (
          <AppText
            variant="caption"
            color="primaryBlue"
            style={[styles.counter, isRTL && styles.textRight]}
          >
            {selectedVisionIds.length}{' '}
            {language === 'ar' ? 'هدف محدد' : `goal${selectedVisionIds.length !== 1 ? 's' : ''} selected`}
          </AppText>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Fixed CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => {
            if (!canContinue) return;
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push('/onboarding/quiz');
          }}
          activeOpacity={canContinue ? 0.9 : 1}
          style={[styles.ctaWrapper, !canContinue && styles.ctaDisabled]}
        >
          <LinearGradient
            colors={canContinue ? Gradients.primary : ['#C7C7CC', '#C7C7CC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.cta}
          >
            <AppText variant="bodyMedium" style={styles.ctaText}>
              {t.continue}
            </AppText>
            <Ionicons name={isRTL ? 'arrow-back' : 'arrow-forward'} size={18} color={Colors.white} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  backBtn: { width: 36, alignItems: 'center' },
  scroll: { paddingHorizontal: Spacing.base, paddingTop: Spacing.md },

  titleBlock: { gap: Spacing.sm, marginBottom: Spacing.base },
  title: { fontWeight: '800', letterSpacing: -0.5, lineHeight: 38, color: Colors.charcoal },
  subtitle: { lineHeight: 22 },
  textRight: { textAlign: 'right', writingDirection: 'rtl' },

  dayBadge: { marginBottom: Spacing.lg, alignSelf: 'flex-start' },
  dayBadgeGradient: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radii.full,
  },
  dayBadgeText: { color: Colors.white, fontWeight: '700', fontSize: 13 },

  grid: { gap: Spacing.sm },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radii.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
    ...Shadows.sm,
  },
  pillSelected: {
    borderColor: Colors.primaryBlue,
    backgroundColor: Colors.blueLight,
  },
  pillEmoji: { fontSize: 24 },
  pillLabel: { flex: 1, fontWeight: '600', color: Colors.charcoal },
  pillLabelSelected: { color: Colors.primaryBlue },

  counter: {
    marginTop: Spacing.md,
    fontWeight: '700',
    textAlign: 'center',
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.md,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  ctaWrapper: { borderRadius: Radii.xl, overflow: 'hidden', ...Shadows.md },
  ctaDisabled: { opacity: 0.5 },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
  },
  ctaText: { color: Colors.white, fontWeight: '700', fontSize: 17 },
});
