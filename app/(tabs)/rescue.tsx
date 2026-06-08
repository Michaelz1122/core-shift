import { View, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppText from '@/components/ui/AppText';
import RescueFeelingCard from '@/components/rescue/RescueFeelingCard';
import { useAppStore } from '@/store/useAppStore';
import { Colors, Spacing } from '@/constants/theme';
import { useTranslation } from '@/i18n';
import { CHALLENGE_TO_RESCUE, RescueFeeling } from '@/types';

const ALL_FEELINGS: RescueFeeling[] = [
  'laziness',
  'distraction',
  'low-motivation',
  'harmful-urge',
  'relapse',
  'sadness',
  'anxiety',
  'loneliness',
  'feeling-lost',
];

export default function RescueScreen() {
  const { t, isRTL } = useTranslation();
  const { selectedChallengeIds, isDarkMode } = useAppStore();

  // Prioritise feelings mapped from user's selected challenges
  const prioritised = selectedChallengeIds
    .map((id) => CHALLENGE_TO_RESCUE[id])
    .filter((f): f is RescueFeeling => f !== undefined);

  const prioritisedUnique = [...new Set(prioritised)];
  const rest = ALL_FEELINGS.filter((f) => !prioritisedUnique.includes(f));
  const orderedFeelings = [...prioritisedUnique, ...rest];

  const handleFeeling = (feeling: RescueFeeling) => {
    router.push({ pathname: '/rescue-response', params: { feeling } });
  };

  const themeBg = isDarkMode ? '#121214' : Colors.background;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: themeBg }]} edges={['top']}>
      <ScrollView
        style={{ backgroundColor: themeBg }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <AppText variant="label" color="primaryBlue" style={isRTL ? styles.textRight : undefined}>
            {t.shiftNowHeader}
          </AppText>
          <AppText variant="h1" style={[styles.title, isRTL && styles.textRight]}>
            {t.shiftNowTitle}
          </AppText>
          <AppText variant="body" style={isRTL ? styles.textRight : undefined}>
            {t.shiftNowSubtitle}
          </AppText>
        </View>

        {/* Prioritised feelings based on user's challenges */}
        {prioritisedUnique.length > 0 && (
          <View style={styles.section}>
            <AppText variant="caption" style={[styles.sectionLabel, isRTL && styles.textRight]}>
              {isRTL ? '⚡ بناءً على تحدياتك' : '⚡ Based on your challenges'}
            </AppText>
            {prioritisedUnique.map((feeling) => (
              <RescueFeelingCard
                key={feeling}
                feeling={feeling}
                onPress={() => handleFeeling(feeling)}
              />
            ))}
          </View>
        )}

        {/* Rest of feelings */}
        <View style={styles.section}>
          {prioritisedUnique.length > 0 && (
            <AppText variant="caption" style={[styles.sectionLabel, isRTL && styles.textRight]}>
              {isRTL ? 'المزيد' : 'More states'}
            </AppText>
          )}
          {rest.map((feeling) => (
            <RescueFeelingCard
              key={feeling}
              feeling={feeling}
              onPress={() => handleFeeling(feeling)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: Spacing.base, paddingBottom: Spacing.xxxl },
  header: { paddingTop: Spacing.xl, marginBottom: Spacing.lg, gap: Spacing.xs },
  title: { fontWeight: '800', letterSpacing: -0.5 },
  textRight: { textAlign: 'right', writingDirection: 'rtl' },
  section: { marginBottom: Spacing.lg, gap: Spacing.sm },
  sectionLabel: {
    color: Colors.muted,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
  },
});
