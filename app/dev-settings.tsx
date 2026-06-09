import React from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Updates from 'expo-updates';
import { Ionicons } from '@expo/vector-icons';
import AppText from '@/components/ui/AppText';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import { useAppStore } from '@/store/useAppStore';
import { Colors, Spacing, Radii } from '@/constants/theme';

export default function DevSettingsScreen() {
  const { isDarkMode, resetAll } = useAppStore();

  const handleResetData = () => {
    Alert.alert('Reset All Data', 'This will wipe everything. Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Wipe',
        style: 'destructive',
        onPress: async () => {
          resetAll();
          await AsyncStorage.clear();
          try {
            await Updates.reloadAsync();
          } catch (e) {
            router.replace('/onboarding');
          }
        },
      },
    ]);
  };

  const handleClearOnboarding = () => {
    useAppStore.setState({ onboardingCompleted: false });
    router.replace('/onboarding');
  };

  const handleResetXP = () => {
    useAppStore.setState({ xp: 0, level: 1 });
    Alert.alert('XP Reset');
  };

  const handleTestMigration = () => {
    Alert.alert('Migration Test', 'You can run scratch-migration-test.ts to verify the mapping logic outside of runtime.');
  };

  const themeBg = isDarkMode ? '#121214' : Colors.background;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: themeBg }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color={isDarkMode ? '#FFFFFF' : Colors.charcoal} />
        </TouchableOpacity>
        <AppText variant="h3" style={{ fontWeight: '700' }}>Developer Settings</AppText>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <AppText variant="caption" color="muted" style={{ marginBottom: Spacing.xl }}>
          These tools are for Beta Testers only. Use with caution as they modify core state.
        </AppText>

        <View style={styles.btnGroup}>
          <PrimaryButton title="Clear Onboarding State" onPress={handleClearOnboarding} />
          <SecondaryButton title="Reset XP & Level to 0" onPress={handleResetXP} />
          <SecondaryButton title="Run Manual Migration Test" onPress={handleTestMigration} />
        </View>

        <View style={{ marginTop: Spacing.xxl }}>
          <SecondaryButton 
            title="Wipe Local Data (Nuke Everything)" 
            onPress={handleResetData} 
            style={{ borderColor: Colors.red }} 
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeBtn: { padding: Spacing.sm },
  scroll: { padding: Spacing.lg },
  btnGroup: { gap: Spacing.md },
});
