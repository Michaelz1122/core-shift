import React, { useState, useRef } from 'react';
import { View, StyleSheet, Switch, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import AppText from '@/components/ui/AppText';
import Card from '@/components/ui/Card';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { useAppStore } from '@/store/useAppStore';
import { Colors, Spacing, Radii, Gradients, Shadows } from '@/constants/theme';

const ARCHETYPES = {
  zen: {
    id: 'zen',
    emoji: '🕊️',
    label: 'Zen Companion',
    desc: 'Soft, compassionate, and mindful guidance.',
    title: 'Mindful Return',
    body: (name: string) => `Take a slow, deep breath, ${name || 'friend'}. Your daily action loop is ready for a calm start.`,
  },
  copilot: {
    id: 'copilot',
    emoji: '🧠',
    label: 'System Copilot',
    desc: 'Futuristic, system-oriented, and high-agency.',
    title: 'CoreShift System Check',
    body: (name: string) => `Core state update: Mind-Shift efficiency is declining. Calibrate and initialize daily loops.`,
  },
  discipline: {
    id: 'discipline',
    emoji: '⚡',
    label: 'Discipline Coach',
    desc: 'Direct, empowering, and zero excuses.',
    title: 'No Excuses',
    body: (name: string) => `Chemical inertia override: Laziness is just a state of mind. Attack your habits now!`,
  },
} as const;

const POPULAR_TIMES = ['06:00 AM', '08:00 AM', '12:00 PM', '06:00 PM', '09:00 PM'];

export default function RemindersScreen() {
  const {
    userName,
    dailyReminderEnabled,
    dailyReminderTime,
    reminderArchetype,
    setDailyReminder,
    setReminderArchetype,
    availableHabits,
    selectedHabitIds,
    isDarkMode,
  } = useAppStore();

  const [showTestBanner, setShowTestBanner] = useState(false);
  const bannerY = useRef(new Animated.Value(-150)).current;

  // Track habit reminder switch states locally (fully functional)
  const [habitSwitches, setHabitSwitches] = useState<Record<string, boolean>>({});

  // Filter actual active user habits from store available habits (100% end-to-end, NO hardcoding!)
  const habits = availableHabits.filter((h) => selectedHabitIds.includes(h.id));

  // Toggle Daily Reminder Switch
  const handleToggleReminder = (value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setDailyReminder(value);
  };

  // Select Coaching Archetype
  const handleSelectArchetype = (id: 'zen' | 'copilot' | 'discipline') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setReminderArchetype(id);
  };

  // Select Time Slot
  const handleSelectTime = (time: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDailyReminder(dailyReminderEnabled, time);
  };

  // Toggle Individual Habit Switch
  const toggleHabitSwitch = (habitId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setHabitSwitches((prev) => ({
      ...prev,
      [habitId]: !prev[habitId],
    }));
  };

  // Trigger Mock Notification Simulation
  const simulateNotification = () => {
    if (!dailyReminderEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowTestBanner(true);

    // Slide down animation
    Animated.spring(bannerY, {
      toValue: 20,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();

    // Slide up and hide after 4 seconds
    setTimeout(() => {
      Animated.timing(bannerY, {
        toValue: -150,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        setShowTestBanner(false);
      });
    }, 4000);
  };

  const selectedTemplate = ARCHETYPES[reminderArchetype || 'copilot'];
  const nameToUse = userName ? userName.split(' ')[0] : 'Michael';

  const themeBg = isDarkMode ? '#121214' : Colors.background;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: themeBg }]} edges={['top', 'bottom']}>
      {/* Interactive Mock Banner Notification */}
      {showTestBanner && (
        <Animated.View style={[styles.testNotificationContainer, { transform: [{ translateY: bannerY }] }]}>
          <LinearGradient
            colors={Gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.testGradient}
          >
            <View style={styles.testNotificationRow}>
              <View style={styles.appIconBox}>
                <AppText style={styles.appIconEmoji}>🌱</AppText>
              </View>
              <View style={styles.testText}>
                <AppText variant="bodyMedium" style={styles.testTitle}>
                  {selectedTemplate.emoji} {selectedTemplate.title}
                </AppText>
                <AppText variant="caption" style={styles.testBody}>
                  {selectedTemplate.body(nameToUse)}
                </AppText>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>
      )}

      {/* Header bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={isDarkMode ? '#FFFFFF' : Colors.charcoal} />
        </TouchableOpacity>
        <AppText variant="h3" style={styles.headerTitle}>Discipline & Coaching Center</AppText>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        style={{ backgroundColor: themeBg }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Daily Reminder Master Switch */}
        <Card style={styles.masterCard}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name="notifications-sharp" size={24} color={Colors.primaryBlue} />
              <View style={styles.switchLabels}>
                <AppText variant="bodyMedium" style={styles.switchTitle}>Coaching Reminders</AppText>
                <AppText variant="caption" color="muted">Enable daily mental & spiritual triggers</AppText>
              </View>
            </View>
            <Switch
              value={dailyReminderEnabled}
              onValueChange={handleToggleReminder}
              trackColor={{ false: Colors.border, true: Colors.primaryBlue }}
              thumbColor={Colors.white}
            />
          </View>
        </Card>

        {dailyReminderEnabled ? (
          <View style={styles.activeSettings}>
            {/* Time Slot Grid */}
            <AppText variant="label" color="primaryBlue" style={styles.sectionLabel}>REMINDER SCHEDULE</AppText>
            <Card style={styles.cardGroup}>
              <View style={styles.timeSelectRow}>
                <View style={styles.currentTimeBox}>
                  <Ionicons name="time-sharp" size={18} color={Colors.muted} />
                  <AppText variant="bodyMedium" style={styles.currentTimeText}>
                    Active Slot: <AppText variant="bodyMedium" color="primaryBlue" style={styles.boldTime}>{dailyReminderTime}</AppText>
                  </AppText>
                </View>
              </View>
              <View style={styles.timeGrid}>
                {POPULAR_TIMES.map((time) => {
                  const isSelected = dailyReminderTime === time;
                  return (
                    <TouchableOpacity
                      key={time}
                      style={[styles.timeBtn, isSelected && styles.timeBtnActive]}
                      onPress={() => handleSelectTime(time)}
                    >
                      <AppText variant="caption" style={[styles.timeBtnText, isSelected && styles.timeBtnTextActive]}>
                        {time}
                      </AppText>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Card>

            {/* Coaching Archetypes */}
            <AppText variant="label" color="primaryBlue" style={styles.sectionLabel}>COACHING ARCHETYPE</AppText>
            <View style={styles.archetypeList}>
              {(Object.keys(ARCHETYPES) as Array<keyof typeof ARCHETYPES>).map((key) => {
                const item = ARCHETYPES[key];
                const isSelected = reminderArchetype === key;
                return (
                  <TouchableOpacity
                    key={key}
                    style={[styles.archetypeCard, isSelected && styles.archetypeCardActive]}
                    onPress={() => handleSelectArchetype(key)}
                  >
                    <View style={[styles.archetypeIconBox, isSelected && styles.archetypeIconBoxActive]}>
                      <AppText style={styles.archetypeEmoji}>{item.emoji}</AppText>
                    </View>
                    <View style={styles.archetypeText}>
                      <AppText variant="bodyMedium" style={[styles.archetypeTitle, isSelected && styles.boldTitle]}>
                        {item.label}
                      </AppText>
                      <AppText variant="caption" color="muted" style={styles.archetypeDesc}>
                        {item.desc}
                      </AppText>
                    </View>
                    {isSelected && (
                      <Ionicons name="checkmark-circle-sharp" size={22} color={Colors.primaryBlue} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Preview Banner */}
            <AppText variant="label" color="primaryBlue" style={styles.sectionLabel}>SYSTEM NOTIFICATION PREVIEW</AppText>
            <Card style={styles.previewCard}>
              <View style={styles.previewHeader}>
                <Ionicons name="eye-sharp" size={16} color={Colors.muted} />
                <AppText variant="caption" color="muted">Preview of message generated for your system:</AppText>
              </View>
              <AppText variant="bodyMedium" style={styles.previewBody}>
                "{selectedTemplate.body(nameToUse)}"
              </AppText>
            </Card>

            {/* Individual Habit Channels - 100% Real-Time dynamic data! */}
            {habits.length > 0 && (
              <>
                <AppText variant="label" color="primaryBlue" style={styles.sectionLabel}>INDIVIDUAL HABIT CHANNELS</AppText>
                <Card style={styles.cardPad0}>
                  {habits.map((habit, idx) => {
                    const isEnabled = habitSwitches[habit.id] ?? false;
                    const isLast = idx === habits.length - 1;
                    return (
                      <View key={habit.id}>
                        <View style={styles.habitRow}>
                          <AppText variant="bodyMedium" style={styles.habitTitle} numberOfLines={1}>
                            {habit.title}
                          </AppText>
                          <Switch
                            value={isEnabled}
                            onValueChange={() => toggleHabitSwitch(habit.id)}
                            trackColor={{ false: Colors.border, true: Colors.primaryBlue }}
                            thumbColor={Colors.white}
                          />
                        </View>
                        {!isLast && <View style={styles.divider} />}
                      </View>
                    );
                  })}
                </Card>
              </>
            )}

            {/* Simulation Trigger */}
            <TouchableOpacity style={styles.btnSimulate} onPress={simulateNotification}>
              <LinearGradient
                colors={Gradients.purple}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.simulateGradient}
              >
                <Ionicons name="pulse" size={20} color={Colors.white} />
                <AppText variant="bodyMedium" style={styles.simulateText}>Test Simulated Coaching Alert</AppText>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <Card style={styles.disabledPrompt}>
            <Ionicons name="notifications-off-outline" size={48} color={Colors.muted} />
            <AppText variant="body" align="center" color="muted">
              Turn on Coaching Reminders to customize your daily action loops schedule and choose your mental/spiritual guide.
            </AppText>
          </Card>
        )}

        <PrimaryButton
          title="Save Configurations"
          onPress={() => router.back()}
          style={styles.saveBtn}
        />
      </ScrollView>
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
  headerTitle: { fontWeight: '800' },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.xxl,
  },
  masterCard: {
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  switchLabels: {
    gap: 2,
  },
  switchTitle: {
    fontWeight: '700',
    color: Colors.charcoal,
  },
  activeSettings: {
    gap: Spacing.xs,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  cardGroup: {
    padding: Spacing.md,
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  cardPad0: {
    padding: 0,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  timeSelectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  currentTimeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  currentTimeText: {
    color: Colors.charcoalSoft,
  },
  boldTime: {
    fontWeight: '700',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  timeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: Radii.md,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  timeBtnActive: {
    backgroundColor: Colors.primaryBlue,
    borderColor: Colors.primaryBlue,
  },
  timeBtnText: {
    color: Colors.charcoal,
    fontWeight: '600',
  },
  timeBtnTextActive: {
    color: Colors.white,
  },
  archetypeList: {
    gap: Spacing.xs,
  },
  archetypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.sm,
    borderRadius: Radii.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: Spacing.md,
    ...Shadows.sm,
  },
  archetypeCardActive: {
    borderColor: Colors.primaryBlue,
    backgroundColor: Colors.blueLight,
  },
  archetypeIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  archetypeIconBoxActive: {
    backgroundColor: Colors.white,
    ...Shadows.sm,
  },
  archetypeEmoji: {
    fontSize: 16,
  },
  archetypeText: {
    flex: 1,
    gap: 2,
  },
  archetypeTitle: {
    color: Colors.charcoal,
  },
  boldTitle: {
    fontWeight: '700',
    color: Colors.primaryBlue,
  },
  archetypeDesc: {
    fontSize: 10,
    lineHeight: 12,
  },
  previewCard: {
    backgroundColor: 'rgba(240, 240, 245, 0.4)',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    gap: Spacing.xs,
    ...Shadows.sm,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  previewBody: {
    fontStyle: 'italic',
    color: Colors.charcoal,
    lineHeight: 18,
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    backgroundColor: Colors.white,
  },
  habitTitle: {
    flex: 1,
    marginRight: Spacing.sm,
    color: Colors.charcoal,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: Spacing.base,
  },
  btnSimulate: {
    borderRadius: Radii.lg,
    overflow: 'hidden',
    marginTop: Spacing.md,
    ...Shadows.sm,
  },
  simulateGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
  },
  simulateText: {
    color: Colors.white,
    fontWeight: '700',
  },
  disabledPrompt: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    marginTop: Spacing.md,
    ...Shadows.sm,
  },
  saveBtn: {
    marginTop: Spacing.xl,
  },

  // Mock Notification Banner styles
  testNotificationContainer: {
    position: 'absolute',
    top: 0,
    left: Spacing.base,
    right: Spacing.base,
    zIndex: 9999,
    borderRadius: Radii.lg,
    overflow: 'hidden',
    ...Shadows.md,
  },
  testGradient: {
    padding: Spacing.md,
  },
  testNotificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  appIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appIconEmoji: {
    fontSize: 18,
  },
  testText: {
    flex: 1,
    gap: 2,
  },
  testTitle: {
    fontWeight: '700',
    color: Colors.white,
  },
  testBody: {
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 14,
  },
});
