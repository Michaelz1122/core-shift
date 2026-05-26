import { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import { Colors, Spacing, Radii } from '@/constants/theme';
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
      <View style={styles.logoBlock}>
        <Image
          source={require('../assets/icon.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <AppText variant="hero" style={styles.logoText}>
          CoreShift
        </AppText>
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
  logoImage: {
    width: 100,
    height: 100,
    borderRadius: Radii.lg,
    marginBottom: Spacing.md,
  },
  tagline: {
    color: Colors.muted,
    marginTop: Spacing.sm,
  },
});
