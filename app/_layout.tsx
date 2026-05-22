import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { Colors } from '@/constants/theme';

// Keep the native splash visible until we're ready
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Hide native splash as soon as layout mounts — the custom splash
    // screen (app/index.tsx) takes over from here.
    SplashScreen.hideAsync();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/signup" />
        <Stack.Screen name="onboarding/index" />
        <Stack.Screen name="onboarding/goals" />
        <Stack.Screen name="onboarding/habits" />
        <Stack.Screen name="onboarding/confirm" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="checkin"
          options={{ animation: 'slide_from_bottom', presentation: 'modal' }}
        />
        <Stack.Screen name="habit-detail" />
        <Stack.Screen
          name="note-new"
          options={{ animation: 'slide_from_bottom', presentation: 'modal' }}
        />
        <Stack.Screen name="rescue-response" />
        <Stack.Screen name="weekly-review" />
        <Stack.Screen name="reminders" />
      </Stack>
    </SafeAreaProvider>
  );
}
