import React, { useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AppText from '@/components/ui/AppText';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import { Colors, Spacing, Radii, Shadows } from '@/constants/theme';
import { useTranslation } from '@/i18n';
import type { ActionTemplate } from '@/data/actionTemplates';
import { getSmallerVersionFallback } from '@/utils/actionPlanEngine';

interface ConfidenceCheckModalProps {
  visible: boolean;
  action: ActionTemplate | null;
  onClose: () => void;
  onConfirm: (version: 'standard' | 'smaller', customData?: { label: string; duration: string }) => void;
}

export default function ConfidenceCheckModal({
  visible,
  action,
  onClose,
  onConfirm,
}: ConfidenceCheckModalProps) {
  const { language, isRTL } = useTranslation();
  const [showDowngrade, setShowDowngrade] = useState(false);

  // Reset state when modal opens/closes
  React.useEffect(() => {
    if (visible) {
      setShowDowngrade(false);
    }
  }, [visible]);

  if (!action) return null;

  // English texts
  const enTexts = {
    title: 'How confident are you?',
    subtitle: 'Can you do this every single day?',
    opt100: '100% (Definitely)',
    opt75: '75% (Probably)',
    opt50: '50% (Not sure)',
    opt25: '25% (Too hard right now)',
    downgradeTitle: 'Let\'s start smaller.',
    downgradeSubtitle: 'It\'s better to guarantee success than to risk failure. How about this easier version?',
    acceptSmaller: 'Accept easier version',
    keepOriginal: 'No, I can do the original',
  };

  // Arabic texts as requested
  const arTexts = {
    title: 'واثق بنسبة كام؟',
    subtitle: 'تقدر تعمل دي كل يوم؟',
    opt100: 'أكيد أقدر',
    opt75: 'غالباً أقدر',
    opt50: 'مش متأكد',
    opt25: 'صعب عليا حالياً',
    downgradeTitle: 'خلينا نبدأ بحاجة أبسط.',
    downgradeSubtitle: 'ضمان النجاح أهم من المخاطرة. إيه رأيك في النسخة الأسهل دي؟',
    acceptSmaller: 'موافق على النسخة الأسهل',
    keepOriginal: 'لا، هقدر أعمل الأصلية',
  };

  const t = language === 'ar' ? arTexts : enTexts;

  const handleConfidence = (level: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (level >= 75) {
      onConfirm('standard');
    } else {
      setShowDowngrade(true);
    }
  };

  const smallerVersion = action.smallerVersion || getSmallerVersionFallback(action);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.content}>
              <View style={styles.header}>
                <View style={styles.iconCircle}>
                  <AppText style={{ fontSize: 24 }}>{action.emoji}</AppText>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <Ionicons name="close" size={24} color={Colors.muted} />
                </TouchableOpacity>
              </View>

              {!showDowngrade ? (
                <>
                  <AppText variant="h2" style={[styles.title, isRTL && styles.textRight]}>
                    {t.title}
                  </AppText>
                  <AppText variant="body" color="muted" style={[styles.subtitle, isRTL && styles.textRight]}>
                    {t.subtitle}
                  </AppText>
                  
                  <View style={styles.actionCard}>
                    <AppText variant="bodyMedium" style={{ fontWeight: '600', color: Colors.charcoal }}>
                      {action.label[language]}
                    </AppText>
                    <AppText variant="caption" color="primaryBlue">
                      {action.duration[language]}
                    </AppText>
                  </View>

                  <View style={styles.options}>
                    <TouchableOpacity style={styles.optionBtn} onPress={() => handleConfidence(100)}>
                      <AppText style={styles.optionText}>{t.opt100}</AppText>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionBtn} onPress={() => handleConfidence(75)}>
                      <AppText style={styles.optionText}>{t.opt75}</AppText>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionBtn} onPress={() => handleConfidence(50)}>
                      <AppText style={styles.optionText}>{t.opt50}</AppText>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionBtn} onPress={() => handleConfidence(25)}>
                      <AppText style={styles.optionText}>{t.opt25}</AppText>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <>
                  <AppText variant="h2" style={[styles.title, isRTL && styles.textRight]}>
                    {t.downgradeTitle}
                  </AppText>
                  <AppText variant="body" color="muted" style={[styles.subtitle, isRTL && styles.textRight]}>
                    {t.downgradeSubtitle}
                  </AppText>

                  <View style={[styles.actionCard, styles.smallerCard]}>
                    <AppText variant="bodyMedium" style={{ fontWeight: '600', color: Colors.charcoal }}>
                      {smallerVersion.label[language]}
                    </AppText>
                    <AppText variant="caption" color="primaryBlue">
                      {smallerVersion.duration[language]}
                    </AppText>
                  </View>

                  <View style={{ gap: Spacing.sm, marginTop: Spacing.lg }}>
                    <PrimaryButton
                      title={t.acceptSmaller}
                      onPress={() => onConfirm('smaller', { 
                        label: smallerVersion.label[language], 
                        duration: smallerVersion.duration[language] 
                      })}
                    />
                    <SecondaryButton
                      title={t.keepOriginal}
                      onPress={() => onConfirm('standard')}
                    />
                  </View>
                </>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radii.xl,
    borderTopRightRadius: Radii.xl,
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
    ...Shadows.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: Radii.full,
    backgroundColor: Colors.blueLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtn: {
    padding: Spacing.xs,
  },
  title: {
    fontWeight: '800',
    color: Colors.charcoal,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  textRight: {
    textAlign: 'right',
  },
  actionCard: {
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
    gap: 4,
  },
  smallerCard: {
    backgroundColor: '#E8F5E9',
    borderColor: '#A5D6A7',
  },
  options: {
    gap: Spacing.sm,
  },
  optionBtn: {
    backgroundColor: Colors.background,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  optionText: {
    fontWeight: '600',
    color: Colors.charcoal,
  },
});
