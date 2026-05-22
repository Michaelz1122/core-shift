import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppText from '@/components/ui/AppText';
import Card from '@/components/ui/Card';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import { RESCUE_RESPONSES } from '@/data/mockProgress';
import { FEELING_CONFIG } from '@/components/rescue/RescueFeelingCard';
import { RescueFeeling } from '@/types';
import { Colors, Spacing, Radii } from '@/constants/theme';
import { Copy } from '@/constants/copy';

export default function RescueResponseScreen() {
  const { feeling } = useLocalSearchParams<{ feeling: RescueFeeling }>();

  const response = RESCUE_RESPONSES[feeling ?? 'laziness'] ?? RESCUE_RESPONSES['laziness'];
  const config = FEELING_CONFIG[feeling ?? 'laziness'];

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.charcoal} />
        </TouchableOpacity>
        <AppText variant="label" color="primaryBlue">
          {Copy.rescue.header}
        </AppText>
        <View style={styles.backBtn} />
      </View>

      <View style={styles.content}>
        {/* Feeling badge */}
        <View style={styles.feelingBadge}>
          <AppText style={styles.feelingEmoji}>{config?.emoji}</AppText>
          <AppText variant="small" color="primaryBlue">
            {config?.label}
          </AppText>
        </View>

        {/* Main message */}
        <View style={styles.messageBlock}>
          <AppText variant="h1" style={styles.pause}>
            {Copy.rescue.responseTitle}
          </AppText>
          <AppText variant="body" style={styles.messageBody}>
            {response.message}
          </AppText>
        </View>

        {/* Action card */}
        <Card style={styles.actionCard} variant="highlighted">
          <AppText variant="label" color="primaryBlue" style={styles.actionLabel}>
            {Copy.rescue.actionTitle}
          </AppText>
          <AppText variant="bodyMedium" style={styles.actionText}>
            {response.action}
          </AppText>
        </Card>

        {/* Arabic support line */}
        <AppText variant="body" align="center" style={styles.arabic}>
          {Copy.rescue.arabicSupport}
        </AppText>

        {/* Buttons */}
        <View style={styles.buttons}>
          <PrimaryButton
            title={Copy.rescue.doItNow}
            onPress={() => router.replace('/(tabs)/today')}
          />
          <SecondaryButton
            title={Copy.rescue.writeNote}
            onPress={() => {
              router.replace('/note-new');
            }}
            variant="outline"
          />
          <TouchableOpacity onPress={() => router.replace('/(tabs)/today')}>
            <AppText variant="small" color="muted" align="center">
              {Copy.rescue.backToToday}
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  backBtn: { width: 36 },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xl,
    gap: Spacing.xl,
  },
  feelingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.blueLight,
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.full,
  },
  feelingEmoji: {
    fontSize: 18,
  },
  messageBlock: {
    gap: Spacing.sm,
  },
  pause: {
    letterSpacing: -0.3,
  },
  messageBody: {
    lineHeight: 24,
  },
  actionCard: {
    gap: Spacing.sm,
  },
  actionLabel: {
    marginBottom: Spacing.xs,
  },
  actionText: {
    lineHeight: 24,
  },
  arabic: {
    fontFamily: undefined,
    lineHeight: 26,
    color: Colors.charcoalSoft,
  },
  buttons: {
    gap: Spacing.sm,
    marginTop: 'auto',
    paddingBottom: Spacing.lg,
  },
});
