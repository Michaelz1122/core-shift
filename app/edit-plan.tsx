import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AppText from '@/components/ui/AppText';
import Card from '@/components/ui/Card';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { useAppStore } from '@/store/useAppStore';
import { Colors, Spacing, Radii } from '@/constants/theme';
import { useTranslation } from '@/i18n';
import ConfidenceCheckModal from '@/components/onboarding/ConfidenceCheckModal';
import { ACTION_TEMPLATES } from '@/data/actionTemplates';

const MIN_ACTIVE = 3;
const MAX_ACTIVE = 5;

export default function EditPlanScreen() {
  const { t, language, isRTL } = useTranslation();
  const { actions, activeActionIds, setActions } = useAppStore();
  
  const [localSelected, setLocalSelected] = useState<Set<string>>(new Set(activeActionIds));
  const [modalVisible, setModalVisible] = useState(false);
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    const isSelected = localSelected.has(id);
    if (isSelected) {
      if (localSelected.size <= MIN_ACTIVE) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        return;
      }
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setLocalSelected((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } else {
      if (localSelected.size >= MAX_ACTIVE) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        return;
      }
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setPendingActionId(id);
      setModalVisible(true);
    }
  };

  const handleConfirmAction = (version: 'standard' | 'smaller', customData?: { label: string; duration: string }) => {
    if (!pendingActionId) return;

    if (version === 'smaller' && customData) {
      // Modify the action in the store's catalogue so it reflects the smaller version
      const updatedActions = actions.map(a => 
        a.id === pendingActionId ? { ...a, title: customData.label, selectedVersion: 'smaller' as const } : a
      );
      useAppStore.setState({ actions: updatedActions });
    } else if (version === 'standard') {
      // Revert to standard if they had a smaller version before
      const originalTemplate = ACTION_TEMPLATES.find(t => t.id === pendingActionId);
      if (originalTemplate) {
        const updatedActions = actions.map(a => 
          a.id === pendingActionId ? { ...a, title: originalTemplate.label[language], selectedVersion: 'standard' as const } : a
        );
        useAppStore.setState({ actions: updatedActions });
      }
    }

    setLocalSelected(prev => new Set(prev).add(pendingActionId));
    setModalVisible(false);
    setPendingActionId(null);
  };

  const handleSave = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    useAppStore.setState({ activeActionIds: Array.from(localSelected) });
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color={Colors.charcoal} />
        </TouchableOpacity>
        <AppText variant="h3" style={{ fontWeight: '700' }}>
          {language === 'ar' ? 'تعديل الخطة' : 'Edit Plan'}
        </AppText>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <AppText variant="body" color="muted" style={[styles.desc, isRTL && styles.textRight]}>
          {language === 'ar' 
            ? `اختار من ${MIN_ACTIVE} لـ ${MAX_ACTIVE} أفعال تركز عليهم.`
            : `Select ${MIN_ACTIVE}–${MAX_ACTIVE} actions to focus on.`}
        </AppText>

        <Card style={styles.list}>
          {actions.map((action, idx) => {
            const isSelected = localSelected.has(action.id);
            return (
              <View key={action.id}>
                <TouchableOpacity
                  onPress={() => handleToggle(action.id)}
                  style={[styles.row, isSelected && styles.rowSelected]}
                >
                  <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                    {isSelected && <Ionicons name="checkmark" size={14} color={Colors.white} />}
                  </View>
                  <AppText style={{ fontSize: 22 }}>{action.emoji}</AppText>
                  <View style={{ flex: 1 }}>
                    <AppText variant="bodyMedium" style={[styles.title, isSelected && styles.titleSelected, isRTL && styles.textRight]}>
                      {action.title}
                    </AppText>
                    {action.selectedVersion === 'smaller' && (
                      <AppText variant="caption" color="primaryBlue" style={isRTL && styles.textRight}>
                        {language === 'ar' ? 'نسخة أسهل' : 'Easier Version'}
                      </AppText>
                    )}
                  </View>
                </TouchableOpacity>
                {idx < actions.length - 1 && <View style={styles.divider} />}
              </View>
            );
          })}
        </Card>
        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton 
          title={language === 'ar' ? 'حفظ التعديلات' : 'Save Changes'} 
          onPress={handleSave} 
          disabled={localSelected.size < MIN_ACTIVE || localSelected.size > MAX_ACTIVE}
        />
      </View>

      <ConfidenceCheckModal
        visible={modalVisible}
        action={ACTION_TEMPLATES.find(a => a.id === pendingActionId) || null}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirmAction}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
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
  desc: { marginBottom: Spacing.lg },
  textRight: { textAlign: 'right' },
  list: { padding: 0, overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
  },
  rowSelected: { backgroundColor: Colors.blueLight },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: Colors.primaryBlue,
    borderColor: Colors.primaryBlue,
  },
  title: { fontWeight: '600', color: Colors.charcoal },
  titleSelected: { color: Colors.primaryBlue, fontWeight: '700' },
  divider: { height: 1, backgroundColor: Colors.border, marginLeft: 62 },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
