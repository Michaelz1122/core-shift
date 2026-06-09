import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import AppText from '@/components/ui/AppText';
import Card from '@/components/ui/Card';
import { useAppStore } from '@/store/useAppStore';
import { Colors, Spacing, Radii, Gradients, Shadows } from '@/constants/theme';
import { useTranslation } from '@/i18n';

export default function PreviewScreen() {
  const { t, language, isRTL } = useTranslation();
  const { actions, activeActionIds, addXp, completeOnboarding } = useAppStore();

  const selectedActions = actions.filter((a) => activeActionIds.includes(a.id));

  const handleCommit = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addXp(50);
    completeOnboarding();
    router.replace('/(tabs)/today');
  };

  const enTexts = {
    title: 'Your Action Plan',
    subtitle: 'Here is what to expect.',
    week1: 'Week 1',
    week1Desc: 'Focus on showing up. Missing a day is normal; just try not to miss twice in a row. You will slowly find task initiation gets easier.',
    month1: 'Month 1',
    month1Desc: 'You will start seeing improved consistency and less procrastination. The actions will take less mental effort to start.',
    commit: 'Lock In My Plan',
    bonus: '+50 XP Welcome Bonus',
  };

  const arTexts = {
    title: 'خطة العمل بتاعتك',
    subtitle: 'إيه اللي تتوقعه الفترة الجاية؟',
    week1: 'أول أسبوع',
    week1Desc: 'ركز إنك بس تبدأ. طبيعي تفوت يوم، بس حاول ما تفوتش يومين ورا بعض. البداية في أي مهمة هتبدأ تكون أسهل تدريجياً.',
    month1: 'أول شهر',
    month1Desc: 'هتلاحظ استمراريتك اتحسنت وتسويفك قل كتير. الأفعال دي هتحتاج مجهود ذهني أقل عشان تبدأها.',
    commit: 'تأكيد الخطة',
    bonus: '٥٠ نقطة هدية البداية',
  };

  const text = language === 'ar' ? arTexts : enTexts;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <AppText variant="h1" style={[styles.title, isRTL ? styles.textRight : undefined]}>{text.title}</AppText>
          <AppText variant="body" color="muted" style={[styles.subtitle, isRTL ? styles.textRight : undefined]}>{text.subtitle}</AppText>
        </View>

        <View style={styles.actionsList}>
          {selectedActions.map((action) => (
            <View key={action.id} style={[styles.actionBadge, isRTL && { flexDirection: 'row-reverse' }]}>
              <AppText style={{ fontSize: 18 }}>{action.emoji}</AppText>
              <AppText variant="bodyMedium" style={{ fontWeight: '600', color: Colors.charcoal }}>{action.title}</AppText>
              {action.selectedVersion === 'smaller' && (
                <View style={styles.easierBadge}>
                  <AppText style={styles.easierText}>{language === 'ar' ? 'أسهل' : 'Easier'}</AppText>
                </View>
              )}
            </View>
          ))}
        </View>

        <Card style={styles.timelineCard}>
          <View style={styles.timelineStep}>
            <View style={styles.stepIcon}>
              <Ionicons name="calendar-outline" size={20} color={Colors.primaryBlue} />
            </View>
            <View style={styles.stepText}>
              <AppText variant="label" color="primaryBlue" style={isRTL ? styles.textRight : undefined}>{text.week1}</AppText>
              <AppText variant="body" style={isRTL ? styles.textRight : undefined}>{text.week1Desc}</AppText>
            </View>
          </View>

          <View style={styles.timelineLine} />

          <View style={styles.timelineStep}>
            <View style={styles.stepIcon}>
              <Ionicons name="trending-up" size={20} color={Colors.primaryBlue} />
            </View>
            <View style={styles.stepText}>
              <AppText variant="label" color="primaryBlue" style={isRTL ? styles.textRight : undefined}>{text.month1}</AppText>
              <AppText variant="body" style={isRTL ? styles.textRight : undefined}>{text.month1Desc}</AppText>
            </View>
          </View>
        </Card>
        
        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleCommit}
          activeOpacity={0.9}
          style={styles.ctaWrapper}
        >
          <LinearGradient
            colors={Gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.cta}
          >
            <Ionicons name="lock-closed" size={18} color={Colors.white} />
            <AppText variant="bodyMedium" style={styles.ctaText}>
              {text.commit}
            </AppText>
            <AppText variant="caption" style={styles.ctaXp}>
              {text.bonus}
            </AppText>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Spacing.base, paddingTop: Spacing.xl },
  header: { marginBottom: Spacing.lg },
  title: { fontWeight: '800', color: Colors.charcoal, marginBottom: 4 },
  subtitle: { lineHeight: 22 },
  textRight: { textAlign: 'right' },
  
  actionsList: {
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  actionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  easierBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radii.full,
    marginLeft: 'auto',
  },
  easierText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2E7D32',
  },

  timelineCard: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  timelineStep: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.blueLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepText: {
    flex: 1,
    gap: 4,
  },
  timelineLine: {
    width: 2,
    height: 24,
    backgroundColor: Colors.border,
    marginLeft: 19,
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.md,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  ctaWrapper: { borderRadius: Radii.xl, overflow: 'hidden', ...Shadows.md },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
  },
  ctaText: { color: Colors.white, fontWeight: '700', fontSize: 17 },
  ctaXp: { color: 'rgba(255,255,255,0.75)', fontWeight: '700' },
});
