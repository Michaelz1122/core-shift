import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useStore, getLocalDateStr } from '@/store/useStore';
import { Colors, Spacing, Font } from '@/constants/theme';

export default function GoalDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { language, goals, actions, darkMode, addAction, deleteAction } = useStore();
  const isRTL = language === 'ar';

  const goal = goals.find(g => g.id === id);
  const todayStr = getLocalDateStr();
  const todayActions = actions[todayStr] || [];
  const goalActions = todayActions.filter(a => a.goalId === id);

  const [newActionTitle, setNewActionTitle] = useState('');

  if (!goal) return null;

  const bg = darkMode ? '#000000' : '#FFFFFF';
  const cardBg = darkMode ? '#111111' : '#F9F9F9';
  const borderColor = darkMode ? '#222222' : '#EAEAEA';
  const textColor = darkMode ? '#FFFFFF' : '#000000';
  const textMuted = darkMode ? '#888888' : '#666666';

  const handleAddAction = () => {
    if (!newActionTitle.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addAction(todayStr, {
      goalId: goal.id,
      title: newActionTitle.trim(),
      order: goalActions.length,
    });
    setNewActionTitle('');
    Keyboard.dismiss();
  };

  const handleDeleteAction = (actionId: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    deleteAction(todayStr, actionId);
  };

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
            <Ionicons name={isRTL ? "chevron-forward" : "chevron-back"} size={28} color={textColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textColor }]}>
            {goal.title}
          </Text>
          <View style={styles.headerBtn} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          
          <Text style={[styles.sectionTitle, { color: textMuted, textAlign: isRTL ? 'right' : 'left' }]}>
            {isRTL ? 'مهام اليوم لهذا الهدف' : 'Today\'s Actions for this Goal'}
          </Text>

          <View style={styles.actionList}>
            {goalActions.map((action) => (
              <View key={action.id} style={[styles.actionCard, { backgroundColor: cardBg, borderColor, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <View style={styles.flexOne}>
                  <Text style={[styles.actionTitle, { color: textColor, textAlign: isRTL ? 'right' : 'left' }]}>
                    {action.title}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => handleDeleteAction(action.id)} style={styles.deleteBtn}>
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))}

            {goalActions.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyText, { color: textMuted }]}>
                  {isRTL ? 'لا توجد مهام مسجلة اليوم.' : 'No actions scheduled for today.'}
                </Text>
              </View>
            )}
          </View>

          <View style={[styles.inputWrapper, { backgroundColor: cardBg, borderColor, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <TextInput
              style={[styles.input, { color: textColor, textAlign: isRTL ? 'right' : 'left' }]}
              placeholder={isRTL ? 'إضافة مهمة جديدة...' : 'Add a new action...'}
              placeholderTextColor={textMuted}
              value={newActionTitle}
              onChangeText={setNewActionTitle}
              onSubmitEditing={handleAddAction}
              returnKeyType="done"
            />
            <TouchableOpacity onPress={handleAddAction} style={styles.addBtn} disabled={!newActionTitle.trim()}>
              <Ionicons name="add-circle" size={28} color={newActionTitle.trim() ? Colors.primary : textMuted} />
            </TouchableOpacity>
          </View>

        </ScrollView>
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
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#22222220',
  },
  headerBtn: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { fontFamily: Font.bold, fontSize: 18 },
  scroll: {
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  sectionTitle: {
    fontFamily: Font.medium,
    fontSize: 14,
  },
  actionList: {
    gap: Spacing.md,
  },
  actionCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: Spacing.md,
    alignItems: 'center',
    gap: Spacing.md,
  },
  flexOne: { flex: 1 },
  actionTitle: {
    fontFamily: Font.semibold,
    fontSize: 16,
  },
  deleteBtn: {
    padding: Spacing.xs,
  },
  emptyState: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: Font.medium,
    fontSize: 14,
  },
  inputWrapper: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    height: 56,
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  input: {
    flex: 1,
    fontFamily: Font.semibold,
    fontSize: 16,
  },
  addBtn: {
    padding: Spacing.xs,
  }
});
