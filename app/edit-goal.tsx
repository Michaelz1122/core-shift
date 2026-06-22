import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '@/store/useStore';
import { Colors, Spacing, Font } from '@/constants/theme';

export default function EditGoal() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { language, goals, darkMode, addGoal, updateGoal } = useStore();
  const isRTL = language === 'ar';

  const existingGoal = id ? goals.find(g => g.id === id) : null;
  const isEditing = !!existingGoal;

  const [title, setTitle] = useState(existingGoal?.title || '');
  const [icon, setIcon] = useState(existingGoal?.icon || 'flag');

  const bg = darkMode ? '#000000' : '#FFFFFF';
  const cardBg = darkMode ? '#111111' : '#F9F9F9';
  const borderColor = darkMode ? '#222222' : '#EAEAEA';
  const textColor = darkMode ? '#FFFFFF' : '#000000';
  const textMuted = darkMode ? '#888888' : '#666666';

  const handleSave = () => {
    if (!title.trim()) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    if (isEditing && id) {
      updateGoal(id, { title: title.trim(), icon });
    } else {
      addGoal({ title: title.trim(), icon, order: goals.length });
    }

    Keyboard.dismiss();
    router.back();
  };

  const ICONS = ['flag', 'star', 'leaf', 'briefcase', 'book', 'fitness', 'home', 'heart', 'bulb', 'cash', 'barbell', 'rocket'];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        
        {/* Header */}
        <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
          >
            <Text style={[styles.cancelText, { color: textMuted }]}>{isRTL ? 'إلغاء' : 'Cancel'}</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textColor }]}>
            {isEditing ? (isRTL ? 'تعديل الهدف' : 'Edit Goal') : (isRTL ? 'هدف جديد' : 'New Goal')}
          </Text>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={handleSave}
            disabled={!title.trim()}
          >
            <Text style={[styles.saveText, { color: title.trim() ? Colors.primary : textMuted, opacity: title.trim() ? 1 : 0.5 }]}>
              {isRTL ? 'حفظ' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <Text style={[styles.label, { color: textMuted, textAlign: isRTL ? 'right' : 'left' }]}>
            {isRTL ? 'اسم الهدف' : 'Goal Name'}
          </Text>
          <View style={[styles.inputWrapper, { backgroundColor: cardBg, borderColor }]}>
            <TextInput
              style={[styles.input, { color: textColor, textAlign: isRTL ? 'right' : 'left' }]}
              placeholder={isRTL ? 'مثال: خسارة وزن' : 'e.g. Lose Weight'}
              placeholderTextColor={textMuted}
              value={title}
              onChangeText={setTitle}
              autoFocus={!isEditing}
            />
          </View>

          <Text style={[styles.label, { color: textMuted, textAlign: isRTL ? 'right' : 'left', marginTop: Spacing.xl }]}>
            {isRTL ? 'اختر أيقونة' : 'Choose Icon'}
          </Text>
          <View style={styles.iconGrid}>
            {ICONS.map((i) => (
              <TouchableOpacity
                key={i}
                onPress={() => setIcon(i)}
                style={[
                  styles.iconSelectBtn,
                  { 
                    backgroundColor: icon === i ? Colors.primary : cardBg,
                    borderColor: icon === i ? Colors.primary : borderColor
                  }
                ]}
              >
                <Ionicons name={i as any} size={24} color={icon === i ? '#FFFFFF' : textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: '#22222220',
  },
  headerBtn: {
    justifyContent: 'center',
  },
  cancelText: { fontFamily: Font.medium, fontSize: 16 },
  saveText: { fontFamily: Font.bold, fontSize: 16 },
  headerTitle: { fontFamily: Font.bold, fontSize: 18 },
  form: {
    padding: Spacing.xl,
    gap: Spacing.sm,
  },
  label: {
    fontFamily: Font.medium,
    fontSize: 14,
    marginBottom: Spacing.xs,
  },
  inputWrapper: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    height: 56,
    justifyContent: 'center',
  },
  input: {
    fontFamily: Font.semibold,
    fontSize: 16,
    padding: 0,
    margin: 0,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  iconSelectBtn: {
    width: 56,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
