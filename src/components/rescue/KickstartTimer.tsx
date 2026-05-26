import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import AppText from '../ui/AppText';
import { useAppStore } from '@/store/useAppStore';
import { Colors, Spacing, Radii, Gradients, Shadows } from '@/constants/theme';

interface KickstartTimerProps {
  onComplete: () => void;
  onBack: () => void;
}

export default function KickstartTimer({ onComplete, onBack }: KickstartTimerProps) {
  const [seconds, setSeconds] = useState(120);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const addXp = useAppStore((state) => state.addXp);

  useEffect(() => {
    let interval: any = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
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

  const toggleTimer = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsActive(false);
    setSeconds(120);
    setIsFinished(false);
  };

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

  const getEncouragementMessage = (secs: number) => {
    if (secs === 120) return "Just 2 minutes. That's all we ask.";
    if (secs > 90) return "Starting is 99% of the battle. Keep going!";
    if (secs > 60) return "You are doing it! The resistance is fading.";
    if (secs > 30) return "Halfway through. Focus on the physical feeling of moving.";
    if (secs > 0) return "Almost there! Finish strong.";
    return "Amazing job! You took action.";
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Ionicons name="flash-sharp" size={24} color={Colors.primaryBlue} />
          <AppText variant="h3">The 2-Minute Kickstart</AppText>
        </View>

        <AppText variant="body" align="center" style={styles.subtitle}>
          Commit to taking action on your habit for just 2 minutes. You are legally allowed to stop once the timer hits zero!
        </AppText>

        {/* Timer Visual */}
        <View style={styles.timerOuter}>
          <LinearGradient
            colors={isFinished ? Gradients.success : isActive ? Gradients.primary : Gradients.purple}
            style={styles.timerCircle}
          >
            <View style={styles.timerInner}>
              <AppText variant="hero" style={styles.timerText}>
                {formatTime(seconds)}
              </AppText>
              <AppText variant="caption" color="muted">
                {isFinished ? 'COMPLETED' : isActive ? 'ACTIVE' : 'PAUSED'}
              </AppText>
            </View>
          </LinearGradient>
        </View>

        <AppText variant="bodyMedium" align="center" style={styles.encouragement}>
          {getEncouragementMessage(seconds)}
        </AppText>

        {/* Controls */}
        <View style={styles.controlsRow}>
          {!isFinished ? (
            <>
              <TouchableOpacity style={styles.btnSecondary} onPress={resetTimer}>
                <Ionicons name="refresh" size={20} color={Colors.charcoalSoft} />
                <AppText variant="bodyMedium" style={styles.btnSecondaryText}>Reset</AppText>
              </TouchableOpacity>

              <TouchableOpacity style={styles.btnPrimary} onPress={toggleTimer}>
                <Ionicons name={isActive ? 'pause' : 'play'} size={20} color={Colors.white} />
                <AppText variant="bodyMedium" style={styles.btnPrimaryText}>
                  {isActive ? 'Pause' : 'Start'}
                </AppText>
              </TouchableOpacity>

              <TouchableOpacity style={styles.btnSuccess} onPress={forceComplete}>
                <Ionicons name="checkmark-done" size={20} color={Colors.white} />
                <AppText variant="bodyMedium" style={styles.btnPrimaryText}>Done</AppText>
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
                <AppText variant="bodyMedium" style={styles.btnPrimaryText}>Claim +50 XP & Return</AppText>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

        {/* Cancel Button */}
        {!isFinished && (
          <TouchableOpacity style={styles.btnCancel} onPress={onBack}>
            <AppText variant="small" style={styles.cancelText}>Nevermind, go back</AppText>
          </TouchableOpacity>
        )}
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
  timerOuter: {
    width: 170,
    height: 170,
    borderRadius: 85,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    ...Shadows.sm,
  },
  timerCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 85,
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerInner: {
    width: '100%',
    height: '100%',
    borderRadius: 80,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.charcoal,
    lineHeight: 44,
  },
  encouragement: {
    color: Colors.charcoal,
    minHeight: 24,
    marginBottom: Spacing.xl,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    width: '100%',
    justifyContent: 'center',
  },
  btnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.primaryBlue,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    borderRadius: Radii.lg,
    flex: 1.2,
  },
  btnPrimaryText: {
    color: Colors.white,
    fontWeight: '600',
  },
  btnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.background,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    flex: 1,
  },
  btnSecondaryText: {
    color: Colors.charcoalSoft,
    fontWeight: '500',
  },
  btnSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.success,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    borderRadius: Radii.lg,
    flex: 1,
  },
  btnFinish: {
    width: '100%',
    borderRadius: Radii.lg,
    overflow: 'hidden',
  },
  finishGradient: {
    width: '100%',
    paddingVertical: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnCancel: {
    marginTop: Spacing.lg,
    padding: Spacing.xs,
  },
  cancelText: {
    color: Colors.muted,
    textDecorationLine: 'underline',
  },
});
