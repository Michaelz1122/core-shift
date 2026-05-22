import { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppText from '@/components/ui/AppText';
import { useAppStore } from '@/store/useAppStore';
import { Colors, Spacing, Radii } from '@/constants/theme';
import { Copy } from '@/constants/copy';
import { formatDate, getTodayString } from '@/utils/dates';

export default function NewNoteScreen() {
  const { addNote } = useAppStore();
  const [content, setContent] = useState('');

  const handleSave = () => {
    if (!content.trim()) return;
    addNote(content.trim());
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.btn}>
            <Ionicons name="close" size={24} color={Colors.charcoal} />
          </TouchableOpacity>
          <AppText variant="small" color="muted">
            {formatDate(getTodayString())}
          </AppText>
          <TouchableOpacity
            onPress={handleSave}
            disabled={!content.trim()}
            style={styles.btn}
          >
            <AppText
              variant="bodyMedium"
              style={content.trim() ? styles.saveActive : styles.saveDisabled}
            >
              Save
            </AppText>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.editor}
          placeholder={Copy.notes.prompt}
          placeholderTextColor={Colors.muted}
          value={content}
          onChangeText={setContent}
          multiline
          autoFocus
          textAlignVertical="top"
          textBreakStrategy="simple"
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.card },
  flex: { flex: 1 },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  btn: {
    width: 56,
    alignItems: 'center',
  },
  saveActive: {
    color: Colors.primaryBlue,
    fontWeight: '600',
  },
  saveDisabled: {
    color: Colors.muted,
    fontWeight: '600',
  },
  editor: {
    flex: 1,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.lg,
    fontSize: 17,
    lineHeight: 26,
    color: Colors.charcoal,
    textAlignVertical: 'top',
  },
});
