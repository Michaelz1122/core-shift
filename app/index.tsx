import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useStore } from '@/store/useStore';
import { Colors } from '@/constants/theme';

export default function Index() {
  const onboarded = useStore((s) => s.onboarded);
  const darkMode = useStore((s) => s.darkMode);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onboarded) {
        router.replace('/today');
      } else {
        router.replace('/onboarding');
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [onboarded]);

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? Colors.bgDark : Colors.bg }]}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
