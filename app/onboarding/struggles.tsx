import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import Screen from '@/components/ui/Screen';
import AppText from '@/components/ui/AppText';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { ALL_STRUGGLES } from '@/data/mockStruggles';
import { useAppStore } from '@/store/useAppStore';
import { Colors, Spacing, Radii } from '@/constants/theme';

export default function StruggleSelection() {
  const { selectedStruggleIds, toggleStruggle } = useAppStore();
  const canContinue = selectedStruggleIds.length >= 1;
  const atMax = selectedStruggleIds.length >= 3;

  return (
    <Screen scroll>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.charcoal} />
        </TouchableOpacity>
        <View style={styles.stepRow}>
          <AppText variant="caption" color="primaryBlue">Step 2 of 3</AppText>
        </View>
        <AppText variant="h1">What gets in your way most?</AppText>
        <AppText variant="body" style={styles.subtitle}>
          Choose what you want CoreShift to help you come back from.
        </AppText>
        <View style={styles.pills}>
          {[1, 2, 3].map((n) => (
            <View
              key={n}
              style={[styles.pill, n <= 2 ? styles.pillActive : null]}
            />
          ))}
        </View>
      </View>

      {ALL_STRUGGLES.map((struggle) => {
        const selected = selectedStruggleIds.includes(struggle.id);
        const disabled = atMax && !selected;
        return (
          <TouchableOpacity
            key={struggle.id}
            style={[
              styles.card,
              selected ? styles.cardSelected : null,
              disabled ? styles.cardDimmed : null,
            ]}
            onPress={() => toggleStruggle(struggle.id)}
            activeOpacity={0.7}
          >
            <View style={styles.cardRow}>
              <AppText style={styles.emoji}>{struggle.emoji}</AppText>
              <AppText
                variant="bodyMedium"
                style={[styles.label, selected ? styles.labelSelected : null]}
              >
                {struggle.label}
              </AppText>
            </View>
            {selected && (
              <Ionicons name="checkmark-circle" size={20} color={Colors.primaryBlue} />
            )}
          </TouchableOpacity>
        );
      })}

      <View style={styles.footer}>
        {atMax && (
          <AppText variant="small" align="center" color="muted">
            Maximum 3 struggles selected
          </AppText>
        )}
        <PrimaryButton
          title="Continue"
          onPress={() => router.push('/onboarding/habits')}
          disabled={!canContinue}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: Spacing.xl, marginBottom: Spacing.lg, gap: Spacing.sm },
  backBtn: { alignSelf: 'flex-start', padding: Spacing.xs, marginLeft: -Spacing.xs },
  stepRow: { marginBottom: Spacing.xs },
  subtitle: { marginTop: Spacing.xs },
  pills: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  pill: { width: 24, height: 4, borderRadius: 2, backgroundColor: Colors.border },
  pillActive: { backgroundColor: Colors.primaryBlue },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.card,
    borderRadius: Radii.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.sm,
  },
  cardSelected: {
    borderColor: Colors.primaryBlue,
    backgroundColor: Colors.blueLight,
  },
  cardDimmed: { opacity: 0.5 },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  emoji: { fontSize: 20 },
  label: { fontSize: 15, color: Colors.charcoal },
  labelSelected: { color: Colors.primaryBlue, fontWeight: '600' },

  footer: { marginTop: Spacing.xl, gap: Spacing.sm, paddingBottom: Spacing.xl },
});
