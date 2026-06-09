import { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '@/store/useStore';
import { Colors, Spacing, Font } from '@/constants/theme';
import { strings } from '@/constants/strings';
import { useKeepAwake } from 'expo-keep-awake';

const { width } = Dimensions.get('window');

export default function FocusScreen() {
  useKeepAwake(); // Keep screen on during focus mode
  
  const { id } = useLocalSearchParams<{ id: string }>();
  const { actions, toggleAction, darkMode, language } = useStore();
  const isRTL = language === 'ar';
  
  const action = actions.find((a) => a.id === id);
  
  // Parse duration into seconds
  const parseDuration = (dur: string) => {
    if (!dur) return 25 * 60;
    const val = parseInt(dur.replace(/\D/g, '')) || 25;
    if (dur.includes('h')) return val * 60 * 60;
    if (dur.includes('d')) return 24 * 60 * 60; // probably shouldn't use timer for this
    return val * 60; // minutes
  };

  const initialSeconds = parseDuration(action?.duration || '25m');
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
      // Timer finished
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIsActive(false);
      if (id && !action?.completed) {
        toggleAction(id);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, id]);

  const toggleTimer = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsActive(!isActive);
  };

  const completeEarly = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (id && !action?.completed) {
      toggleAction(id);
    }
    router.back();
  };

  const abandon = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  if (!action) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text>Task not found.</Text>
      </SafeAreaView>
    );
  }

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const bg = darkMode ? '#0F172A' : '#F8FAFC'; // Deep slate
  const textColor = darkMode ? '#F8FAFC' : '#0F172A';
  const textMuted = darkMode ? '#94A3B8' : '#64748B';

  const titleText = isRTL ? action.titleAr : action.title;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      {/* Header */}
      <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <TouchableOpacity style={styles.iconBtn} onPress={abandon}>
          <Ionicons name="close" size={28} color={textColor} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Task Info */}
        <View style={styles.taskInfo}>
          <Ionicons name={action.icon as any} size={32} color={Colors.primary} style={{ marginBottom: Spacing.md }} />
          <Text style={[styles.taskTitle, { color: textColor, textAlign: 'center' }]}>
            {titleText}
          </Text>
          <Text style={[styles.taskStatus, { color: textMuted }]}>
            {isActive ? (isRTL ? 'جاري التركيز...' : 'Deep Focus...') : (isRTL ? 'متوقف مؤقتاً' : 'Paused')}
          </Text>
        </View>

        {/* Timer Display */}
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

        {/* Controls */}
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

      {/* Footer Complete Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={[styles.completeBtn, { backgroundColor: Colors.success }]} onPress={completeEarly} activeOpacity={0.8}>
          <Ionicons name="checkmark-done" size={20} color="#FFFFFF" />
          <Text style={styles.completeBtnText}>
            {isRTL ? 'إكمال المهمة الآن' : 'Complete Task Now'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
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
    backgroundColor: 'transparent',
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
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  completeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 28,
    gap: Spacing.sm,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  completeBtnText: {
    color: '#FFFFFF',
    fontFamily: Font.bold,
    fontSize: 16,
  },
});
