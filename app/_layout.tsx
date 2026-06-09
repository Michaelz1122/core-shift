import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { Colors } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import GlobalErrorBoundary from '@/components/ui/GlobalErrorBoundary';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  const themeBg = isDarkMode ? '#121214' : Colors.background;

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <GlobalErrorBoundary>
      <SafeAreaProvider>
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: themeBg },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/signup" />
        <Stack.Screen name="onboarding/index" />
        <Stack.Screen name="onboarding/language" />
        <Stack.Screen name="onboarding/challenge" />
        <Stack.Screen name="onboarding/vision" />
        <Stack.Screen name="onboarding/quiz" />
        <Stack.Screen name="onboarding/plan" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="checkin"
          options={{ animation: 'slide_from_bottom', presentation: 'modal' }}
        />
        <Stack.Screen
          name="edit-plan"
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
    </GlobalErrorBoundary>
  );
}
