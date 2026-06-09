import React, { useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import AppText from '@/components/ui/AppText';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { useAppStore } from '@/store/useAppStore';
import { Colors, Spacing, Radii, Shadows } from '@/constants/theme';
import { useTranslation } from '@/i18n';

type Reason = 'forgot' | 'time' | 'energy' | 'stress' | 'motivation' | null;

export default function RecoveryModal() {
  const { language, isRTL } = useTranslation();
  const { pendingRecoveryCheckIn, clearPendingRecovery, downgradeActiveActionsForToday } = useAppStore();
  const [selectedReason, setSelectedReason] = useState<Reason>(null);
  const [showConsequence, setShowConsequence] = useState(false);

  if (!pendingRecoveryCheckIn) return null;

  const enTexts = {
    title: 'Welcome back.',
    subtitle: 'You missed a day, and that is perfectly normal. Building habits is about returning, not perfection. What got in the way?',
    reasons: {
      forgot: 'I forgot',
      time: 'I had no time',
      energy: 'I had low energy',
      stress: 'I was too stressed',
      motivation: 'I lost motivation',
    },
    consequences: {
      forgot: { title: 'Let\'s fix that.', desc: 'Habits rely on cues. Let\'s set up a stronger daily reminder.', btn: 'Set Reminder', action: () => router.push('/reminders') },
      time: { title: 'Time is tight.', desc: 'When you are busy, perfection is the enemy. I have automatically downgraded your actions to their smaller versions for today. Just do 2 minutes.', btn: 'Accept Smaller Plan', action: () => downgradeActiveActionsForToday() },
      energy: { title: 'Rest is part of the process.', desc: 'You cannot pour from an empty cup. Let\'s make today a low-pressure recovery day. Just do the bare minimum.', btn: 'Start Recovery Day', action: () => downgradeActiveActionsForToday() },
      stress: { title: 'Stress drains willpower.', desc: 'Don\'t force it today. Just try to complete one simple action to keep the chain alive.', btn: 'I\'ll do my best', action: () => {} },
      motivation: { title: 'Motivation is a myth.', desc: 'You don\'t need to feel like doing it. You just need to start. Let\'s use Shift Now to break the resistance.', btn: 'Open Shift Now', action: () => router.push('/(tabs)/rescue') },
    }
  };

  const arTexts = {
    title: 'أهلاً بيك من تاني.',
    subtitle: 'فاتك يوم وده طبيعي جداً. المهم إنك رجعت. إيه اللي عطلك أمس؟',
    reasons: {
      forgot: 'نسيت',
      time: 'ماكانش في وقت',
      energy: 'طاقتي كانت صفر',
      stress: 'كنت مضغوط جداً',
      motivation: 'فقدت الشغف/الحافز',
    },
    consequences: {
      forgot: { title: 'خلينا نصلح ده.', desc: 'العادات محتاجة تنبيه. خلينا نظبط منبه قوي يفكرك.', btn: 'ظبط المنبه', action: () => router.push('/reminders') },
      time: { title: 'الوقت ضيق.', desc: 'الكمال عدو الإنجاز. أنا صغرت لك أهداف النهاردة لنسخ أسهل. جرب بس دقيقتين.', btn: 'موافق على الخطة الأسهل', action: () => downgradeActiveActionsForToday() },
      energy: { title: 'الراحة جزء من الرحلة.', desc: 'خلي النهاردة يوم تعافي بدون ضغط. اعمل بس أقل مجهود ممكن.', btn: 'ابدأ يوم التعافي', action: () => downgradeActiveActionsForToday() },
      stress: { title: 'الضغط بيسحب طاقتك.', desc: 'ماتضغطش على نفسك النهاردة. حاول بس تعمل خطوة واحدة صغيرة عشان تحافظ على العادة.', btn: 'هحاول أعمل اللي أقدر عليه', action: () => {} },
      motivation: { title: 'الشغف مجرد كذبة.', desc: 'مش لازم تكون متحمس عشان تبدأ. خلينا نستخدم Shift Now عشان نكسر الكسل.', btn: 'افتح Shift Now', action: () => router.push('/(tabs)/rescue') },
    }
  };

  const t = language === 'ar' ? arTexts : enTexts;

  const handleReason = (reason: Reason) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedReason(reason);
    setShowConsequence(true);
  };

  const handleContinue = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (selectedReason) {
      t.consequences[selectedReason].action();
    }
    clearPendingRecovery();
  };

  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.iconCircle}>
            <Ionicons name="leaf" size={24} color={Colors.primaryBlue} />
          </View>
          
          {!showConsequence ? (
            <>
              <AppText variant="h2" style={[styles.title, isRTL && styles.textRight]}>{t.title}</AppText>
              <AppText variant="body" color="muted" style={[styles.subtitle, isRTL && styles.textRight]}>{t.subtitle}</AppText>

              <View style={styles.options}>
                {(Object.keys(t.reasons) as Reason[]).map(key => (
                  <TouchableOpacity key={key} style={styles.optionBtn} onPress={() => handleReason(key)}>
                    <AppText style={styles.optionText}>{t.reasons[key!]}</AppText>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          ) : (
            <>
              <AppText variant="h2" style={[styles.title, isRTL && styles.textRight]}>
                {t.consequences[selectedReason!].title}
              </AppText>
              <AppText variant="body" color="muted" style={[styles.subtitle, isRTL && styles.textRight]}>
                {t.consequences[selectedReason!].desc}
              </AppText>

              <View style={{ marginTop: Spacing.lg }}>
                <PrimaryButton title={t.consequences[selectedReason!].btn} onPress={handleContinue} />
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  content: {
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    padding: Spacing.xl,
    ...Shadows.md,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: Radii.full,
    backgroundColor: Colors.blueLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
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
