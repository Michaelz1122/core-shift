import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import AppText from '../ui/AppText';
import { useAppStore } from '@/store/useAppStore';
import { Colors, Spacing, Radii, Gradients, Shadows } from '@/constants/theme';

interface BrainDumpProps {
  onComplete: () => void;
  onBack: () => void;
}

export default function BrainDump({ onComplete, onBack }: BrainDumpProps) {
  const [text, setText] = useState('');
  const [isMelting, setIsMelting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const addXp = useAppStore((state) => state.addXp);

  const textOpacity = useRef(new Animated.Value(1)).current;
  const textScale = useRef(new Animated.Value(1)).current;

  const startMelt = () => {
    if (!text.trim() || isMelting) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setIsMelting(true);

    // Run custom melting animation: fade out and shrink the text
    Animated.parallel([
      Animated.timing(textOpacity, {
        toValue: 0,
        duration: 2500,
        useNativeDriver: true,
      }),
      Animated.timing(textScale, {
        toValue: 0.8,
        duration: 2500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIsFinished(true);
      addXp(50);
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {!isFinished ? (
          <>
            <View style={styles.header}>
              <Ionicons name="leaf-sharp" size={24} color={Colors.primaryBlue} />
              <AppText variant="h3">The Brain Dump Dissolver</AppText>
            </View>

            <AppText variant="body" align="center" style={styles.subtitle}>
              What is looping inside your head right now? Anxiety, worries, a stressful thought? Pour it all out below.
            </AppText>

            {/* Input Box */}
            <Animated.View
              style={[
                styles.inputContainer,
                {
                  opacity: textOpacity,
                  transform: [{ scale: textScale }],
                },
              ]}
            >
              <TextInput
                style={styles.input}
                multiline
                numberOfLines={6}
                placeholder="Type your looping thoughts here... No filters. Nobody else will ever see this."
                placeholderTextColor={Colors.muted}
                value={text}
                onChangeText={setText}
                editable={!isMelting}
              />
            </Animated.View>

            {/* Melt Button */}
            {!isMelting ? (
              <TouchableOpacity
                style={[styles.btnMelt, !text.trim() && styles.btnMeltDisabled]}
                onPress={startMelt}
                disabled={!text.trim()}
              >
                <LinearGradient
                  colors={text.trim() ? Gradients.purple : ['#E5E5EA', '#E5E5EA']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientBtn}
                >
                  <Ionicons name="flame-outline" size={20} color={Colors.white} />
                  <AppText variant="bodyMedium" style={styles.btnText}>
                    Melt & Dissolve Thoughts
                  </AppText>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <View style={styles.meltingLoader}>
                <Ionicons name="leaf-outline" size={20} color={Colors.primaryBlue} style={styles.rotatingIcon} />
                <AppText variant="bodyMedium" color="primaryBlue">
                  Melt away... releasing from your mind...
                </AppText>
              </View>
            )}

            {!isMelting && (
              <TouchableOpacity style={styles.btnCancel} onPress={onBack}>
                <AppText variant="small" style={styles.cancelText}>Nevermind, go back</AppText>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <View style={styles.finishedContainer}>
            <Ionicons name="checkmark-circle-outline" size={64} color={Colors.success} style={styles.successIcon} />
            <AppText variant="h2" align="center" style={styles.successTitle}>
              It is Melted.
            </AppText>
            <AppText variant="body" align="center" style={styles.successSub}>
              Those thoughts no longer exist. They are dust. Take one deep breath, let your shoulders drop, and return to the present moment.
            </AppText>

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
          </View>
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
    marginBottom: Spacing.lg,
  },
  inputContainer: {
    width: '100%',
    backgroundColor: Colors.background,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  input: {
    fontSize: 15,
    color: Colors.charcoal,
    height: 140,
    textAlignVertical: 'top',
  },
  btnMelt: {
    width: '100%',
    borderRadius: Radii.lg,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  btnMeltDisabled: {
    opacity: 0.5,
  },
  gradientBtn: {
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
    marginTop: Spacing.md,
    padding: Spacing.xs,
  },
  cancelText: {
    color: Colors.muted,
    textDecorationLine: 'underline',
  },
  meltingLoader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  rotatingIcon: {
    // animated rotations can be simulated or basic static sparkle
  },
  finishedContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    width: '100%',
  },
  successIcon: {
    marginBottom: Spacing.md,
  },
  successTitle: {
    fontWeight: '700',
    color: Colors.success,
    marginBottom: Spacing.sm,
  },
  successSub: {
    color: Colors.charcoalSoft,
    marginBottom: Spacing.xl,
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
