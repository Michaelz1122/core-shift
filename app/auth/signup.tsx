import { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Screen from '@/components/ui/Screen';
import AppText from '@/components/ui/AppText';
import PrimaryButton from '@/components/ui/PrimaryButton';
import TextInputField from '@/components/ui/TextInputField';
import { Colors, Spacing } from '@/constants/theme';
import { Copy } from '@/constants/copy';

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    router.replace('/onboarding');
  };

  const handleGoogle = () => {
    router.replace('/onboarding');
  };

  return (
    <Screen scroll keyboardAvoiding>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={24} color={Colors.charcoal} />
      </TouchableOpacity>

      <View style={styles.header}>
        <AppText variant="hero" style={styles.logo}>
          CoreShift
        </AppText>
        <View style={styles.logoAccent} />
      </View>

      <AppText variant="h1" style={styles.title}>
        {Copy.auth.startYourShift}
      </AppText>
      <AppText variant="body" style={styles.subtitle}>
        Build your new life system.
      </AppText>

      <View style={styles.form}>
        <TouchableOpacity style={styles.googleBtn} onPress={handleGoogle} activeOpacity={0.8}>
          <Ionicons name="logo-google" size={20} color={Colors.charcoal} />
          <AppText variant="bodyMedium" style={styles.googleText}>
            {Copy.auth.continueWithGoogle}
          </AppText>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <AppText variant="caption" style={styles.dividerText}>or</AppText>
          <View style={styles.dividerLine} />
        </View>

        <TextInputField
          label="Name"
          placeholder="Your name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          autoComplete="name"
        />
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
          placeholder="Create a password"
          value={password}
          onChangeText={setPassword}
          isPassword
          autoComplete="new-password"
        />

        <PrimaryButton title={Copy.auth.signupButton} onPress={handleSignUp} style={styles.btn} />
      </View>

      <TouchableOpacity onPress={() => router.back()} style={styles.loginLink}>
        <AppText variant="small" color="muted" align="center">
          {Copy.auth.alreadyHaveAccount}
        </AppText>
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  backBtn: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
    padding: Spacing.xs,
    alignSelf: 'flex-start',
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  logo: {
    color: Colors.charcoal,
    letterSpacing: -0.5,
  },
  logoAccent: {
    width: 28,
    height: 3,
    backgroundColor: Colors.primaryBlue,
    borderRadius: 2,
    marginTop: Spacing.xs,
  },
  title: {
    marginBottom: Spacing.xs,
  },
  subtitle: {
    marginBottom: Spacing.xl,
  },
  form: {},
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.card,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: Spacing.base,
  },
  googleText: {
    color: Colors.charcoal,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.base,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    color: Colors.muted,
  },
  btn: {
    marginTop: Spacing.sm,
  },
  loginLink: {
    marginTop: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
});
