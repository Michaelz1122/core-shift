import { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppText from '@/components/ui/AppText';
import PrimaryButton from '@/components/ui/PrimaryButton';
import MoodChip from '@/components/forms/MoodChip';
import ScaleSelector from '@/components/forms/ScaleSelector';
import { useAppStore } from '@/store/useAppStore';
import { MoodType } from '@/types';
import { Colors, Spacing, Radii } from '@/constants/theme';
import { Copy } from '@/constants/copy';

import * as Haptics from 'expo-haptics';

const MOODS: MoodType[] = ['calm', 'tired', 'focused', 'stressed', 'low', 'motivated'];

export default function CheckInScreen() {
  const { saveCheckIn, isDarkMode } = useAppStore();
  const [mood, setMood] = useState<MoodType | null>(null);
  const [energy, setEnergy] = useState(0);
  const [focus, setFocus] = useState(0);
  const [note, setNote] = useState('');

  const canSave = mood !== null && energy > 0 && focus > 0;

  const handleSave = () => {
    if (!mood) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    saveCheckIn({ mood, energy, focus, note: note.trim() || undefined });
    router.back();
  };

  const themeBg = isDarkMode ? '#121214' : Colors.background;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: themeBg }]} edges={['top', 'bottom']}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color={isDarkMode ? '#FFFFFF' : Colors.charcoal} />
        </TouchableOpacity>
        <AppText variant="h3">{Copy.checkin.title}</AppText>
        <View style={styles.closeBtn} />
      </View>

      <ScrollView
        style={{ backgroundColor: themeBg }}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Mood */}
        <View style={styles.section}>
          <AppText variant="bodyMedium" style={styles.sectionLabel}>
            {Copy.checkin.moodLabel}
          </AppText>
          <View style={styles.moodGrid}>
            {MOODS.map((m) => (
              <MoodChip
                key={m}
                mood={m}
                selected={mood === m}
                onPress={() => setMood(m)}
              />
            ))}
          </View>
        </View>

        {/* Energy */}
        <View style={styles.section}>
          <ScaleSelector
            label={Copy.checkin.energyLabel}
            value={energy}
            onChange={setEnergy}
          />
        </View>

        {/* Focus */}
        <View style={styles.section}>
          <ScaleSelector
            label={Copy.checkin.focusLabel}
            value={focus}
            onChange={setFocus}
          />
        </View>

        {/* Note */}
        <View style={styles.section}>
          <AppText variant="bodyMedium" style={styles.sectionLabel}>
            Note (optional)
          </AppText>
          <TextInput
            style={styles.noteInput}
            placeholder={Copy.checkin.notePlaceholder}
            placeholderTextColor={Colors.muted}
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <PrimaryButton
          title={Copy.checkin.saveButton}
          onPress={handleSave}
          disabled={!canSave}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeBtn: {
    width: 36,
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionLabel: {
    marginBottom: Spacing.sm,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  noteInput: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.md,
    padding: Spacing.base,
    fontSize: 15,
    color: Colors.charcoal,
    minHeight: 100,
  },
});
