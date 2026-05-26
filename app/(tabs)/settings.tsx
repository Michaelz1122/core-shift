import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AppText from '@/components/ui/AppText';
import Card from '@/components/ui/Card';
import { useAppStore } from '@/store/useAppStore';
import { Colors, Spacing, Radii } from '@/constants/theme';
import { Copy } from '@/constants/copy';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

interface SettingsRowProps {
  icon: IconName;
  label: string;
  onPress?: () => void;
  rightContent?: React.ReactNode;
  danger?: boolean;
}

function SettingsRow({ icon, label, onPress, rightContent, danger }: SettingsRowProps) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.rowLeft}>
        <View style={[styles.iconBg, danger && styles.iconBgDanger]}>
          <Ionicons name={icon} size={18} color={danger ? '#FF3B30' : Colors.primaryBlue} />
        </View>
        <AppText variant="bodyMedium" style={danger ? styles.dangerText : undefined}>
          {label}
        </AppText>
      </View>
      {rightContent ?? (
        onPress ? <Ionicons name="chevron-forward" size={16} color={Colors.muted} /> : null
      )}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const { userName, userEmail, resetAll, isDarkMode, toggleDarkMode } = useAppStore();

  const avatarLetter = userName ? userName.charAt(0).toUpperCase() : '?';

  const handleReset = () => {
    Alert.alert(
      'Reset local data',
      'This will clear all your habits, progress, notes and onboarding data. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetAll();
            router.replace('/auth/login');
          },
        },
      ]
    );
  };

  const handleToggleDarkMode = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleDarkMode();
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
          <AppText variant="h1">{Copy.settings.header}</AppText>
        </View>

        {/* Profile */}
        <Card style={styles.profileCard}>
          <View style={styles.avatar}>
            <AppText style={styles.avatarText}>{avatarLetter}</AppText>
          </View>
          <View>
            <AppText variant="h3">{userName || 'Your name'}</AppText>
            <AppText variant="small" color="muted">
              {userEmail || '—'}
            </AppText>
          </View>
        </Card>

        {/* Habits & Goals */}
        <AppText variant="label" style={styles.groupLabel}>Habits & Goals</AppText>
        <Card style={styles.cardGroup}>
          <SettingsRow
            icon="list-outline"
            label={Copy.settings.manageHabits}
            onPress={() => router.push('/onboarding/habits')}
          />
          <View style={styles.divider} />
          <SettingsRow
            icon="flag-outline"
            label={Copy.settings.editGoals}
            onPress={() => router.push('/onboarding/goals')}
          />
        </Card>

        {/* Reminders */}
        <AppText variant="label" style={styles.groupLabel}>Reminders</AppText>
        <Card style={styles.cardGroup}>
          <SettingsRow
            icon="notifications-outline"
            label={Copy.settings.reminders}
            onPress={() => router.push('/reminders')}
          />
          <View style={styles.divider} />
          <SettingsRow
            icon="calendar-outline"
            label={Copy.settings.weeklyReview}
            onPress={() => router.push('/weekly-review')}
          />
        </Card>

        {/* Preferences */}
        <AppText variant="label" style={styles.groupLabel}>Preferences</AppText>
        <Card style={styles.cardGroup}>
          <SettingsRow
            icon={isDarkMode ? 'moon' : 'moon-outline'}
            label={Copy.settings.darkMode}
            onPress={handleToggleDarkMode}
            rightContent={
              <TouchableOpacity
                onPress={handleToggleDarkMode}
                activeOpacity={0.8}
                style={[
                  styles.switchTrack,
                  isDarkMode && styles.switchTrackActive
                ]}
              >
                <View style={[
                  styles.switchThumb,
                  isDarkMode && styles.switchThumbActive
                ]} />
              </TouchableOpacity>
            }
          />
        </Card>

        {/* Account */}
        <AppText variant="label" style={styles.groupLabel}>Account</AppText>
        <Card style={styles.cardGroup}>
          <SettingsRow
            icon="log-out-outline"
            label={Copy.settings.logout}
            onPress={() => router.replace('/auth/login')}
            danger
          />
        </Card>

        {/* Dev / Debug */}
        <AppText variant="label" style={styles.groupLabel}>Developer</AppText>
        <Card style={styles.cardGroup}>
          <SettingsRow
            icon="trash-outline"
            label="Reset local data"
            onPress={handleReset}
            danger
          />
        </Card>

        <AppText variant="caption" align="center" color="muted" style={styles.version}>
          CoreShift v1.0.0 · MVP
        </AppText>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: Spacing.base, paddingBottom: Spacing.xxxl },
  header: { paddingTop: Spacing.xl, marginBottom: Spacing.lg },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
    marginBottom: Spacing.xl,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 22, fontWeight: '700', color: Colors.white },
  groupLabel: { color: Colors.muted, marginBottom: Spacing.sm, marginTop: Spacing.xs },
  cardGroup: { padding: 0, marginBottom: Spacing.lg, overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  iconBg: {
    width: 34,
    height: 34,
    borderRadius: Radii.sm,
    backgroundColor: Colors.blueLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBgDanger: { backgroundColor: '#FFF0F0' },
  dangerText: { color: '#FF3B30' },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: Spacing.base + 34 + Spacing.md,
  },
  // High fidelity custom Switch styling
  switchTrack: {
    width: 46,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.border,
    padding: 2,
    justifyContent: 'center',
  },
  switchTrackActive: {
    backgroundColor: Colors.primaryBlue,
  },
  switchThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  switchThumbActive: {
    transform: [{ translateX: 20 }],
  },
  version: { marginTop: Spacing.xl },
});
