import { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useStore, getLocalDateStr } from '@/store/useStore';
import { Colors, Spacing, Font } from '@/constants/theme';
import { strings } from '@/constants/strings';
import { useKeepAwake } from 'expo-keep-awake';
import type { RecoveryType } from '@/types';

export default function FocusScreen() {
  useKeepAwake();
  
  const { interventionType } = useLocalSearchParams<{ interventionType?: RecoveryType }>();
  const { logRecovery, darkMode, language } = useStore();
  const isRTL = language === 'ar';
  
  const todayStr = getLocalDateStr();

  // Determine initial seconds and labels
  let initialSeconds = 25 * 60;
  let titleStr = 'Focus';
  let iconName: any = 'play';

  if (interventionType) {
    if (interventionType === 'focus') { initialSeconds = 300; titleStr = isRTL ? 'تركيز مكثف' : 'Focus Sprint'; iconName = 'stopwatch'; }
    if (interventionType === 'activation') { initialSeconds = 120; titleStr = isRTL ? 'تنشيط فوري' : 'Activation Challenge'; iconName = 'flash'; }
    if (interventionType === 'urge_delay') { initialSeconds = 90; titleStr = isRTL ? 'تأجيل الرغبة' : 'Urge Delay'; iconName = 'hand-left'; }
    if (interventionType === 'breathing') { initialSeconds = 60; titleStr = isRTL ? 'تنفس استرخائي' : 'Box Breathing'; iconName = 'leaf'; }
  }

  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);

  const breathAnim = useRef(new Animated.Value(1)).current;

  // Breathing animation (subtle pulsing)
  useEffect(() => {
    if (isActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(breathAnim, {
            toValue: 1.15,
            duration: 4000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(breathAnim, {
            toValue: 1,
            duration: 4000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      breathAnim.stopAnimation();
      Animated.timing(breathAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [isActive]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      // Timer finished naturally
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIsActive(false);
      completeSession();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsActive(!isActive);
  };

  const completeSession = () => {
    if (interventionType) {
      logRecovery(interventionType);
    }
    router.back();
  };

  const completeEarly = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    completeSession();
  };

  const abandon = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const bg = darkMode ? '#000000' : '#FFFFFF';
  const textColor = darkMode ? '#FFFFFF' : '#000000';
  const textMuted = darkMode ? '#888888' : '#666666';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <TouchableOpacity style={styles.iconBtn} onPress={abandon}>
          <Ionicons name="close" size={28} color={textColor} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.taskInfo}>
          <Ionicons name={iconName} size={32} color={Colors.primary} style={{ marginBottom: Spacing.md }} />
          <Text style={[styles.taskTitle, { color: textColor, textAlign: 'center' }]}>
            {titleStr}
          </Text>
          <Text style={[styles.taskStatus, { color: textMuted }]}>
            {isActive ? (isRTL ? 'جاري التنفيذ...' : 'Executing...') : (isRTL ? 'اضغط للبدء' : 'Tap play to start')}
          </Text>
        </View>

        <View style={styles.timerContainer}>
          <Animated.View
            style={[
              styles.pulseRing,
              {
                borderColor: isActive ? Colors.primary : textMuted,
                transform: [{ scale: breathAnim }],
                opacity: breathAnim.interpolate({
                  inputRange: [1, 1.15],
                  outputRange: [0.3, 0.1],
                }),
              },
            ]}
          />
          <View style={[styles.timerCircle, { borderColor: isActive ? Colors.primary : textMuted }]}>
            <Text style={[styles.timerText, { color: textColor }]}>
              {formatTime(timeLeft)}
            </Text>
          </View>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.playBtn, { backgroundColor: isActive ? Colors.danger : Colors.primary }]}
            onPress={toggleTimer}
            activeOpacity={0.8}
          >
            <Ionicons name={isActive ? "pause" : "play"} size={32} color="#FFFFFF" style={{ marginLeft: isActive ? 0 : 4 }} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.completeBtn} onPress={completeEarly} activeOpacity={0.8}>
          <Text style={styles.completeBtnText}>
            {isRTL ? 'إنهاء مبكر' : 'Complete Early'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  taskInfo: {
    alignItems: 'center',
    marginBottom: 60,
  },
  taskTitle: {
    fontFamily: Font.bold,
    fontSize: 24,
    lineHeight: 32,
    marginBottom: 8,
  },
  taskStatus: {
    fontFamily: Font.semibold,
    fontSize: 16,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  timerContainer: {
    width: 260,
    height: 260,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 60,
  },
  pulseRing: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 4,
  },
  timerCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontFamily: Font.bold,
    fontSize: 56,
    fontVariant: ['tabular-nums'],
    letterSpacing: -2,
  },
  controls: {
    alignItems: 'center',
  },
  playBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    alignItems: 'center',
  },
  completeBtn: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: 28,
  },
  completeBtnText: {
    color: '#888888',
    fontFamily: Font.bold,
    fontSize: 14,
  },
});
