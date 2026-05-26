import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import AppText from '../ui/AppText';
import { useAppStore } from '@/store/useAppStore';
import { Colors, Spacing, Radii, Gradients, Shadows } from '@/constants/theme';

interface UrgeSurferProps {
  onComplete: () => void;
  onBack: () => void;
}

interface DistractionTask {
  title: string;
  body: string;
  icon: string;
}

const TASKS: DistractionTask[] = [
  {
    title: 'Mental Math Workout',
    body: 'Solve this inside your head: What is 14 multiplied by 6? (Double check your answer)',
    icon: 'calculator-sharp',
  },
  {
    title: 'Physical Grounding Rhythms',
    body: 'Drum your fingers on your lap in this exact repeating sequence: 1 - 2 - 1 - 3 - 1 - 4 - 1. Repeat 5 times.',
    icon: 'hand-left',
  },
  {
    title: 'Environmental Scan',
    body: 'Look around you immediately. Find and name 3 items in the room that are completely blue, green, or red.',
    icon: 'eye-sharp',
  },
  {
    title: 'Deep Self-Mastery Check',
    body: 'Ask yourself: "What will tomorrow Michael feel if I stay strong for just the next 10 minutes?" Visualize the pride.',
    icon: 'ribbon-sharp',
  },
  {
    title: 'Cognitive Memory Recall',
    body: 'Name the last three meals you had, backwards starting from today, including the details of what you drank.',
    icon: 'infinite-sharp',
  },
];

export default function UrgeSurfer({ onComplete, onBack }: UrgeSurferProps) {
  const [seconds, setSeconds] = useState(300); // 5 minutes
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const addXp = useAppStore((state) => state.addXp);

  useEffect(() => {
    let interval: any = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          const next = prev - 1;
          // Rotate cognitive distraction task every 30 seconds
          if (next > 0 && next % 30 === 0) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setCurrentTaskIndex((idx) => (idx + 1) % TASKS.length);
          }
          return next;
        });
      }, 1000);
    } else if (seconds === 0 && !isFinished) {
      setIsActive(false);
      setIsFinished(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      addXp(50);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds]);

  const forceComplete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsActive(false);
    setSeconds(0);
    setIsFinished(true);
    addXp(50);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  const progressPercent = ((300 - seconds) / 300) * 100;
  const currentTask = TASKS[currentTaskIndex];

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Ionicons name="trending-up-sharp" size={24} color={Colors.primaryBlue} />
          <AppText variant="h3">Craving Urge Surfer</AppText>
        </View>

        <AppText variant="body" align="center" style={styles.subtitle}>
          The urge is a wave that peaks and subsides in 5 minutes. Ride the wave by shifting your prefrontal cortex attention!
        </AppText>

        {/* Timer Bar */}
        <View style={styles.timerBarBox}>
          <View style={styles.timerBarLabels}>
            <AppText variant="bodyMedium" style={styles.timerText}>
              Time Remaining: {formatTime(seconds)}
            </AppText>
            <AppText variant="caption" color="muted">
              {Math.floor(progressPercent)}% Ridden
            </AppText>
          </View>
          <View style={styles.track}>
            <LinearGradient
              colors={Gradients.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.fill, { width: `${progressPercent}%` }]}
            />
          </View>
        </View>

        {/* Cognitive Task Card */}
        <View style={styles.taskCard}>
          <View style={styles.taskHeader}>
            <Ionicons name={currentTask.icon as any} size={20} color={Colors.primaryBlue} />
            <AppText variant="bodyMedium" style={styles.taskTitle}>
              {currentTask.title}
            </AppText>
          </View>
          <AppText variant="body" style={styles.taskBody}>
            {currentTask.body}
          </AppText>
          <View style={styles.taskTimerAlert}>
            <Ionicons name="sync" size={12} color={Colors.muted} />
            <AppText variant="caption" style={styles.taskTimerText}>
              Next distraction shifts in {seconds % 30}s
            </AppText>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          {!isFinished ? (
            <>
              <TouchableOpacity style={styles.btnEarly} onPress={forceComplete}>
                <LinearGradient
                  colors={Gradients.success}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.earlyGradient}
                >
                  <Ionicons name="shield-checkmark" size={18} color={Colors.white} />
                  <AppText variant="bodyMedium" style={styles.btnText}>I Rode the Wave & Survived (+50 XP)</AppText>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.btnCancel} onPress={onBack}>
                <AppText variant="small" style={styles.cancelText}>Nevermind, go back</AppText>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.btnFinish} onPress={onComplete}>
              <LinearGradient
                colors={Gradients.success}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.finishGradient}
              >
                <AppText variant="bodyMedium" style={styles.btnText}>Claim +50 XP & Return</AppText>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    ...Shadows.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    color: Colors.charcoalSoft,
    marginBottom: Spacing.xl,
  },
  timerBarBox: {
    width: '100%',
    gap: Spacing.xs,
    marginBottom: Spacing.xl,
  },
  timerBarLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timerText: {
    fontWeight: '700',
    color: Colors.charcoal,
  },
  track: {
    height: 10,
    backgroundColor: Colors.border,
    borderRadius: 5,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 5,
  },
  taskCard: {
    width: '100%',
    backgroundColor: Colors.background,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
    ...Shadows.sm,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  taskTitle: {
    fontWeight: '700',
    color: Colors.charcoal,
  },
  taskBody: {
    color: Colors.charcoalSoft,
    lineHeight: 20,
  },
  taskTimerAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.xs,
  },
  taskTimerText: {
    color: Colors.muted,
  },
  controls: {
    width: '100%',
    alignItems: 'center',
    gap: Spacing.md,
  },
  btnEarly: {
    width: '100%',
    borderRadius: Radii.lg,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  earlyGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
  },
  btnText: {
    color: Colors.white,
    fontWeight: '600',
  },
  btnCancel: {
    padding: Spacing.xs,
  },
  cancelText: {
    color: Colors.muted,
    textDecorationLine: 'underline',
  },
  btnFinish: {
    width: '100%',
    borderRadius: Radii.lg,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  finishGradient: {
    width: '100%',
    paddingVertical: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
