import { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import { Colors, Spacing } from '@/constants/theme';
import AppText from '@/components/ui/AppText';

export default function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/auth/login');
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* TODO: Replace with actual logo asset once imported */}
      <View style={styles.logoBlock}>
        <AppText variant="hero" style={styles.logoText}>
          CoreShift
        </AppText>
        <View style={styles.logoAccent} />
      </View>
      <AppText variant="body" style={styles.tagline} align="center">
        Change from the inside out.
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  logoBlock: {
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  logoText: {
    color: Colors.charcoal,
    letterSpacing: -0.5,
  },
  logoAccent: {
    width: 32,
    height: 3,
    backgroundColor: Colors.primaryBlue,
    borderRadius: 2,
    marginTop: Spacing.xs,
  },
  tagline: {
    color: Colors.muted,
    marginTop: Spacing.sm,
  },
});
