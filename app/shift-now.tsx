import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '@/store/useStore';
import { strings } from '@/constants/strings';
import { Colors, Spacing, Font } from '@/constants/theme';
import type { RecoveryType } from '@/types';

const { height } = Dimensions.get('window');

const OPTIONS: { id: RecoveryType; icon: keyof typeof Ionicons.glyphMap; title: string; subtitle: string; bg: string; color: string }[] = [
  { id: 'focus', icon: 'stopwatch', title: 'Distracted', subtitle: '5m Focus Sprint', bg: '#EFF6FF', color: '#2563EB' },
  { id: 'activation', icon: 'flash', title: 'No Energy', subtitle: '2m Activation', bg: '#FFFBEB', color: '#D97706' },
  { id: 'urge_delay', icon: 'hand-left', title: 'Urge', subtitle: '90s Delay Exercise', bg: '#FEF2F2', color: '#DC2626' },
  { id: 'breathing', icon: 'leaf', title: 'Stressed', subtitle: '1m Box Breathing', bg: '#F0FDF4', color: '#16A34A' },
];

export default function ShiftNow() {
  const { language, darkMode } = useStore();
  const t = strings[language];
  const isRTL = language === 'ar';

  const bg = darkMode ? '#111111' : '#FFFFFF';
  const cardBg = darkMode ? '#000000' : '#F9F9F9';
  const borderColor = darkMode ? '#333333' : '#EAEAEA';
  const textColor = darkMode ? '#FFFFFF' : '#000000';
  const textMuted = darkMode ? '#888888' : '#666666';

  const handleSelect = (id: RecoveryType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.replace({ pathname: '/focus', params: { interventionType: id } });
  };

  return (
    <View style={styles.overlayContainer}>
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={() => router.back()}
      />

      <SafeAreaView style={[styles.bottomSheet, { backgroundColor: bg, borderTopColor: borderColor }]} edges={['bottom']}>
        <View style={[styles.dragHandle, { backgroundColor: borderColor }]} />

        <View style={[styles.headerRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Text style={[styles.sheetTitle, { color: textColor }]}>
            {isRTL ? 'ما هو شعورك الآن؟' : 'What is your current state?'}
          </Text>
          <TouchableOpacity
            style={[styles.closeBtn, { backgroundColor: borderColor }]}
            onPress={() => router.back()}
          >
            <Text style={[styles.closeText, { color: textColor }]}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          <View style={[styles.grid, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            {OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.id}
                style={[styles.feelingCard, { backgroundColor: cardBg, borderColor }]}
                onPress={() => handleSelect(opt.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.cardRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <View style={[styles.emojiCircle, { backgroundColor: darkMode ? '#222' : opt.bg }]}>
                    <Ionicons name={opt.icon} size={24} color={opt.color} />
                  </View>
                  <View style={styles.textColumn}>
                    <Text style={[styles.cardTitle, { color: textColor, textAlign: isRTL ? 'right' : 'left' }]}>
                      {isRTL && opt.id === 'focus' ? 'مشتت' : 
                       isRTL && opt.id === 'activation' ? 'بدون طاقة' :
                       isRTL && opt.id === 'urge_delay' ? 'رغبة ملحة' :
                       isRTL && opt.id === 'breathing' ? 'متوتر' :
                       opt.title}
                    </Text>
                    <Text style={[styles.cardActionLabel, { color: textMuted, textAlign: isRTL ? 'right' : 'left' }]}>
                      {isRTL && opt.id === 'focus' ? '5د تركيز مكثف' : 
                       isRTL && opt.id === 'activation' ? '2د تنشيط' :
                       isRTL && opt.id === 'urge_delay' ? '90ث تأجيل الرغبة' :
                       isRTL && opt.id === 'breathing' ? '1د تنفس' :
                       opt.subtitle}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomSheet: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderTopWidth: 1,
    paddingTop: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  headerRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  sheetTitle: {
    fontFamily: Font.bold,
    fontSize: 18,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 14,
    fontFamily: Font.bold,
  },
  contentContainer: {
    paddingBottom: Spacing.xl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  feelingCard: {
    width: '47%',
    borderRadius: 20,
    borderWidth: 1,
    padding: Spacing.md,
  },
  cardRow: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  emojiCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textColumn: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: Font.bold,
    fontSize: 15,
    marginBottom: 4,
  },
  cardActionLabel: {
    fontFamily: Font.medium,
    fontSize: 11,
  },
});
