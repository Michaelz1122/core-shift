import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import AppText from '@/components/ui/AppText';
import { useAppStore } from '@/store/useAppStore';
import { ALL_CHALLENGES } from '@/data/challenges';
import { Colors, Spacing, Radii, Gradients, Shadows } from '@/constants/theme';
import { useTranslation } from '@/i18n';
import type { ChallengeId } from '@/types';

const MAX = 2;

// ── Step progress indicator ──────────────────────────────────────────────────

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

export default function ChallengeScreen() {
  const { t, language, isRTL } = useTranslation();
  const { selectedChallengeIds, toggleChallenge } = useAppStore();

  const handleToggle = (id: ChallengeId) => {
    const isSelected = selectedChallengeIds.includes(id);
    if (!isSelected && selectedChallengeIds.length >= MAX) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleChallenge(id);
  };

  const canContinue = selectedChallengeIds.length >= 1;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Fixed header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.charcoal} />
        </TouchableOpacity>
        <StepDots current={1} total={4} />
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View style={styles.titleBlock}>
          <AppText variant="label" color="primaryBlue" style={isRTL ? styles.textRight : undefined}>
            {language === 'ar' ? 'خطوة ١ من ٤' : 'Step 1 of 4'}
          </AppText>
          <AppText
            variant="h1"
            style={[styles.title, isRTL && styles.textRight]}
          >
            {t.challengeTitle}
          </AppText>
          <AppText
            variant="body"
            color="muted"
            style={[styles.subtitle, isRTL && styles.textRight]}
          >
            {t.challengeSubtitle}
          </AppText>
          <View style={styles.maxBadge}>
            <AppText variant="caption" style={styles.maxText}>
              {t.challengeMax} · {selectedChallengeIds.length}/{MAX}
            </AppText>
          </View>
        </View>

        {/* Challenge grid */}
        <View style={styles.grid}>
          {ALL_CHALLENGES.map((challenge) => {
            const selected = selectedChallengeIds.includes(challenge.id);
            const locked = !selected && selectedChallengeIds.length >= MAX;

            return (
              <TouchableOpacity
                key={challenge.id}
                onPress={() => handleToggle(challenge.id)}
                activeOpacity={0.8}
                style={[
                  styles.card,
                  selected && styles.cardSelected,
                  locked && styles.cardLocked,
                ]}
              >
                <AppText style={styles.cardEmoji}>{challenge.emoji}</AppText>
                <AppText
                  variant="bodyMedium"
                  style={[
                    styles.cardLabel,
                    selected && styles.cardLabelSelected,
                    locked && styles.cardLabelLocked,
                    isRTL && styles.textCenter,
                  ]}
                >
                  {challenge.label[language]}
                </AppText>
                <AppText
                  variant="caption"
                  style={[
                    styles.cardDesc,
                    selected && styles.cardDescSelected,
                    locked && styles.cardDescLocked,
                    isRTL && styles.textCenter,
                  ]}
                >
                  {challenge.description[language]}
                </AppText>
                {selected && (
                  <View style={[styles.checkBadge, { backgroundColor: challenge.color }]}>
                    <Ionicons name="checkmark" size={12} color={Colors.white} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Bottom spacer for fixed button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Fixed CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => {
            if (!canContinue) return;
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push('/onboarding/vision');
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

  titleBlock: { gap: Spacing.sm, marginBottom: Spacing.lg },
  title: { fontWeight: '800', letterSpacing: -0.5, lineHeight: 38, color: Colors.charcoal },
  subtitle: { lineHeight: 22 },
  textRight: { textAlign: 'right', writingDirection: 'rtl' },
  textCenter: { textAlign: 'center' },
  maxBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.blueLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radii.full,
  },
  maxText: { color: Colors.primaryBlue, fontWeight: '700' },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  card: {
    width: '47.5%',
    padding: Spacing.md,
    borderRadius: Radii.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
    gap: Spacing.xs,
    alignItems: 'flex-start',
    position: 'relative',
    ...Shadows.sm,
  },
  cardSelected: {
    borderColor: Colors.primaryBlue,
    backgroundColor: Colors.blueLight,
  },
  cardLocked: { opacity: 0.4 },
  cardEmoji: { fontSize: 28, marginBottom: 2 },
  cardLabel: { fontWeight: '700', color: Colors.charcoal, fontSize: 14 },
  cardLabelSelected: { color: Colors.primaryBlue },
  cardLabelLocked: { color: Colors.muted },
  cardDesc: { color: Colors.muted, fontSize: 11, lineHeight: 14 },
  cardDescSelected: { color: Colors.primaryBlue + 'CC' },
  cardDescLocked: { color: Colors.border },
  checkBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
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
  ctaDisabled: { opacity: 0.6 },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
  },
  ctaText: { color: Colors.white, fontWeight: '700', fontSize: 17 },
});
