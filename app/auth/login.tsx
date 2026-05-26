import { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Screen from '@/components/ui/Screen';
import AppText from '@/components/ui/AppText';
import PrimaryButton from '@/components/ui/PrimaryButton';
import TextInputField from '@/components/ui/TextInputField';
import { useAppStore } from '@/store/useAppStore';
import { Colors, Spacing } from '@/constants/theme';
import { Copy } from '@/constants/copy';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser, onboardingCompleted } = useAppStore();

  const navigate = () =>
    router.replace(onboardingCompleted ? '/(tabs)/today' : '/onboarding');

  const handleLogin = () => {
    const trimmedEmail = email.trim();
    const trimmedPass = password.trim();

    if (!trimmedEmail || !trimmedPass) {
      Alert.alert('Required Fields', 'Please enter both your email and password.');
      return;
    }

    if (!trimmedEmail.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (trimmedPass.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters.');
      return;
    }

    const name = trimmedEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    setUser(name, trimmedEmail, 'email');
    navigate();
  };

  const handleGoogle = () => {
    // Mock Google — use a realistic display name
    setUser('Michael', 'michaelzahy1@gmail.com', 'google');
    navigate();
  };

  return (
    <Screen scroll keyboardAvoiding>
      <View style={styles.header}>
        <AppText variant="hero" style={styles.logo}>CoreShift</AppText>
        <View style={styles.logoAccent} />
      </View>

      <AppText variant="h1" style={styles.title}>{Copy.auth.welcomeBack}</AppText>
      <AppText variant="body" style={styles.subtitle}>Good to have you back.</AppText>

      <View style={styles.form}>
        <TouchableOpacity style={styles.googleBtn} onPress={handleGoogle} activeOpacity={0.8}>
          <Ionicons name="logo-google" size={20} color={Colors.charcoal} />
          <AppText variant="bodyMedium">{Copy.auth.continueWithGoogle}</AppText>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <AppText variant="caption" style={styles.dividerText}>or</AppText>
          <View style={styles.dividerLine} />
        </View>

        <TextInputField
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoComplete="email"
        />
        <TextInputField
          label="Password"
          placeholder="Your password"
          value={password}
          onChangeText={setPassword}
          isPassword
          autoComplete="current-password"
        />

        <TouchableOpacity style={styles.forgotLink}>
          <AppText variant="small" color="primaryBlue">{Copy.auth.forgotPassword}</AppText>
        </TouchableOpacity>

        <PrimaryButton title={Copy.auth.loginButton} onPress={handleLogin} />
      </View>

      <TouchableOpacity onPress={() => router.push('/auth/signup')} style={styles.signupLink}>
        <AppText variant="small" color="muted" align="center">
          {Copy.auth.createAccount}
        </AppText>
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', marginTop: Spacing.xl, marginBottom: Spacing.xxl },
  logo: { color: Colors.charcoal, letterSpacing: -0.5 },
  logoAccent: { width: 28, height: 3, backgroundColor: Colors.primaryBlue, borderRadius: 2, marginTop: Spacing.xs },
  title: { marginBottom: Spacing.xs },
  subtitle: { marginBottom: Spacing.xl },
  form: {},
  googleBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.sm, backgroundColor: Colors.card, borderWidth: 1.5,
    borderColor: Colors.border, borderRadius: 12, paddingVertical: 14,
    marginBottom: Spacing.base,
  },
  divider: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.base },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { color: Colors.muted },
  forgotLink: { alignSelf: 'flex-end', marginBottom: Spacing.base, marginTop: -Spacing.xs },
  signupLink: { marginTop: Spacing.xl, paddingBottom: Spacing.xl },
});
