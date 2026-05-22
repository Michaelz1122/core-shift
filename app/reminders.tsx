import { View, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppText from '@/components/ui/AppText';
import Card from '@/components/ui/Card';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { useAppStore } from '@/store/useAppStore';
import { DEMO_HABITS } from '@/data/mockHabits';
import { Colors, Spacing } from '@/constants/theme';

export default function RemindersScreen() {
  const { dailyReminderEnabled, dailyReminderTime, setDailyReminder, selectedHabitIds } =
    useAppStore();

  const habits = DEMO_HABITS.filter((h) => selectedHabitIds.includes(h.id));

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.charcoal} />
        </TouchableOpacity>
        <AppText variant="h3">Reminder Settings</AppText>
        <View style={styles.backBtn} />
      </View>

      <View style={styles.content}>
        {/* Daily check-in reminder */}
        <AppText variant="label" color="muted" style={styles.groupLabel}>Daily Check-in</AppText>
        <Card style={styles.cardGroup}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name="notifications-outline" size={20} color={Colors.primaryBlue} />
              <AppText variant="bodyMedium">Daily reminder</AppText>
            </View>
            <Switch
              value={dailyReminderEnabled}
              onValueChange={(v) => setDailyReminder(v)}
              trackColor={{ false: Colors.border, true: Colors.primaryBlue }}
              thumbColor={Colors.white}
            />
          </View>
          {dailyReminderEnabled && (
            <>
              <View style={styles.divider} />
              <View style={styles.row}>
                <View style={styles.rowLeft}>
                  <Ionicons name="time-outline" size={20} color={Colors.muted} />
                  <AppText variant="bodyMedium">Reminder time</AppText>
                </View>
                <AppText variant="bodyMedium" color="primaryBlue">
                  {dailyReminderTime}
                </AppText>
              </View>
            </>
          )}
        </Card>

        {/* Habit reminders */}
        <AppText variant="label" color="muted" style={styles.groupLabel}>Habit Reminders</AppText>
        <Card style={[styles.cardGroup, styles.cardPad0]}>
          {habits.map((habit, idx) => (
            <View key={habit.id}>
              <View style={styles.habitRow}>
                <AppText variant="bodyMedium" style={styles.habitTitle} numberOfLines={1}>
                  {habit.title}
                </AppText>
                <Switch
                  value={false}
                  onValueChange={() => {}}
                  trackColor={{ false: Colors.border, true: Colors.primaryBlue }}
                  thumbColor={Colors.white}
                />
              </View>
              {idx < habits.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </Card>

        <View style={styles.note}>
          <Ionicons name="information-circle-outline" size={16} color={Colors.muted} />
          <AppText variant="caption" color="muted" style={styles.noteText}>
            {/* TODO: Wire up Expo Notifications in a future phase */}
            Notifications will be available in the next release.
          </AppText>
        </View>

        <PrimaryButton
          title="Save Changes"
          onPress={() => router.back()}
          style={styles.saveBtn}
        />
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: { width: 36, padding: Spacing.xs },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.lg,
  },
  groupLabel: {
    marginBottom: Spacing.sm,
    marginTop: Spacing.sm,
  },
  cardGroup: {
    marginBottom: Spacing.xl,
  },
  cardPad0: {
    padding: 0,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
  },
  habitTitle: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: Spacing.base,
  },
  note: {
    flexDirection: 'row',
    gap: Spacing.xs,
    alignItems: 'flex-start',
    marginBottom: Spacing.xl,
  },
  noteText: {
    flex: 1,
    lineHeight: 18,
  },
  saveBtn: {
    marginTop: 'auto',
    marginBottom: Spacing.lg,
  },
});
