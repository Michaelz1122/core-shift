import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useStore, getLocalDateStr } from '@/store/useStore';
import { strings } from '@/constants/strings';
import { Colors, Spacing, Font } from '@/constants/theme';

export default function Progress() {
  const { language, streak, history, darkMode } = useStore();
  const isRTL = language === 'ar';

  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const bg = darkMode ? '#000000' : '#FFFFFF';
  const cardBg = darkMode ? '#111111' : '#F9F9F9';
  const borderColor = darkMode ? '#222222' : '#EAEAEA';
  const textColor = darkMode ? '#FFFFFF' : '#000000';
  const textMuted = darkMode ? '#888888' : '#666666';

  // Overall completion rate
  const trackedDays = Object.values(history).filter(s => s.totalActions > 0);
  const totalTracked = trackedDays.length;
  const avgCompletionRate = totalTracked > 0 
    ? Math.round((trackedDays.reduce((sum, d) => sum + d.completionRate, 0) / totalTracked) * 100) 
    : 0;

  // Calendar Logic
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const monthNamesEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthNamesAr = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  const monthName = isRTL ? monthNamesAr[month] : monthNamesEn[month];

  const handlePrevMonth = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedDate(new Date(year, month + 1, 1));
  };

  const [tappedDateStr, setTappedDateStr] = useState(getLocalDateStr(new Date()));
  const tappedStats = history[tappedDateStr];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]} edges={['top', 'left', 'right']}>
      <View style={[styles.topAppBar, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <View style={styles.topBtnPlaceholder} />
        <Text style={[styles.appTitle, { color: textColor }]}>CoreShift</Text>
        <View style={styles.topBtnPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Screen Title */}
        <View style={styles.titleSection}>
          <Text style={[styles.screenTitle, { color: textColor, textAlign: isRTL ? 'right' : 'left' }]}>
            {isRTL ? 'التقدم' : 'Progress'}
          </Text>
          <Text style={[styles.screenSub, { color: textMuted, textAlign: isRTL ? 'right' : 'left' }]}>
            {isRTL ? 'تتبع استمراريتك ومعدل إنجازك.' : 'Track your consistency and completion.'}
          </Text>
        </View>

        {/* Stats Bento Grid */}
        <View style={styles.bentoContainer}>
          <View style={[styles.bentoCardSmall, { backgroundColor: cardBg, borderColor }]}>
            <View style={[styles.bentoHeaderRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Text style={[styles.bentoLabel, { color: textMuted }]}>{isRTL ? 'الاستمرارية' : 'Current Streak'}</Text>
              <Ionicons name="flame" size={20} color="#F59E0B" />
            </View>
            <Text style={[styles.bentoValue, { color: textColor, textAlign: isRTL ? 'right' : 'left' }]}>
              {streak} <Text style={{ fontSize: 14, color: textMuted, fontFamily: Font.medium }}>{isRTL ? 'أيام' : 'days'}</Text>
            </Text>
          </View>

          <View style={[styles.bentoCardSmall, { backgroundColor: cardBg, borderColor }]}>
            <View style={[styles.bentoHeaderRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Text style={[styles.bentoLabel, { color: textMuted }]}>{isRTL ? 'متوسط الإنجاز' : 'Avg Completion'}</Text>
              <Ionicons name="analytics" size={20} color={Colors.primary} />
            </View>
            <Text style={[styles.bentoValue, { color: textColor, textAlign: isRTL ? 'right' : 'left' }]}>
              {avgCompletionRate}%
            </Text>
          </View>
        </View>

        {/* Monthly Calendar */}
        <View style={[styles.calendarCard, { backgroundColor: cardBg, borderColor }]}>
          <View style={[styles.calHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <TouchableOpacity onPress={handlePrevMonth} style={styles.calBtn}>
              <Ionicons name={isRTL ? 'chevron-forward' : 'chevron-back'} size={24} color={textColor} />
            </TouchableOpacity>
            <Text style={[styles.calMonthText, { color: textColor }]}>{monthName} {year}</Text>
            <TouchableOpacity onPress={handleNextMonth} style={styles.calBtn}>
              <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={24} color={textColor} />
            </TouchableOpacity>
          </View>

          <View style={[styles.calGrid, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <Text key={`wd-${i}`} style={[styles.calWeekday, { color: textMuted }]}>{d}</Text>
            ))}
            
            {Array.from({ length: firstDay }).map((_, i) => (
              <View key={`empty-${i}`} style={styles.calDayCell} />
            ))}
            
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const stats = history[dateStr];
              const isActive = stats && stats.completedActions > 0;
              const isSelected = dateStr === tappedDateStr;

              return (
                <TouchableOpacity
                  key={`day-${dayNum}`}
                  style={[
                    styles.calDayCell,
                    isSelected && { backgroundColor: Colors.primary },
                    isActive && !isSelected && { backgroundColor: darkMode ? '#1E3A8A' : '#DBEAFE' }
                  ]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setTappedDateStr(dateStr);
                  }}
                >
                  <Text style={[
                    styles.calDayText,
                    { color: isSelected ? '#FFFFFF' : (isActive && !isSelected && !darkMode ? '#1E3A8A' : textColor) }
                  ]}>
                    {dayNum}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Selected Day Stats */}
        {tappedStats && (tappedStats.totalActions > 0 || tappedStats.recoveriesUsed > 0) ? (
          <View style={[styles.dayDetailsCard, { backgroundColor: cardBg, borderColor }]}>
            <Text style={[styles.detailsTitle, { color: textColor, textAlign: isRTL ? 'right' : 'left' }]}>
              {tappedDateStr}
            </Text>
            
            <View style={[styles.detailRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Text style={[styles.detailLabel, { color: textMuted }]}>{isRTL ? 'معدل الإنجاز' : 'Completion'}</Text>
              <Text style={[styles.detailValue, { color: textColor }]}>{Math.round(tappedStats.completionRate * 100)}% ({tappedStats.completedActions}/{tappedStats.totalActions})</Text>
            </View>
            <View style={[styles.detailRow, { flexDirection: isRTL ? 'row-reverse' : 'row', marginTop: Spacing.md }]}>
              <Text style={[styles.detailLabel, { color: textMuted }]}>{isRTL ? 'تدخلات التعافي' : 'Recoveries Used'}</Text>
              <Text style={[styles.detailValue, { color: '#F59E0B' }]}>{tappedStats.recoveriesUsed}</Text>
            </View>
          </View>
        ) : (
          <View style={[styles.dayDetailsCard, { backgroundColor: 'transparent', borderWidth: 0, alignItems: 'center' }]}>
            <Text style={{ color: textMuted, fontFamily: Font.medium }}>{isRTL ? 'لا يوجد نشاط مسجل.' : 'No activity recorded.'}</Text>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topAppBar: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
  },
  topBtnPlaceholder: { width: 40 },
  appTitle: {
    fontFamily: Font.bold,
    fontSize: 18,
    letterSpacing: -0.5,
  },
  scroll: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: 120,
  },
  titleSection: {
    marginBottom: Spacing.xl,
    gap: 4,
  },
  screenTitle: {
    fontFamily: Font.bold,
    fontSize: 26,
    letterSpacing: -0.5,
  },
  screenSub: {
    fontFamily: Font.medium,
    fontSize: 14,
  },
  bentoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  bentoCardSmall: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    padding: Spacing.md,
    justifyContent: 'space-between',
    minHeight: 100,
  },
  bentoHeaderRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  bentoLabel: {
    fontFamily: Font.bold,
    fontSize: 13,
  },
  bentoValue: {
    fontFamily: Font.bold,
    fontSize: 32,
  },
  calendarCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  calHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  calBtn: {
    padding: Spacing.sm,
  },
  calMonthText: {
    fontFamily: Font.bold,
    fontSize: 16,
  },
  calGrid: {
    flexWrap: 'wrap',
  },
  calWeekday: {
    width: `${100 / 7}%`,
    textAlign: 'center',
    fontFamily: Font.bold,
    fontSize: 12,
    marginBottom: Spacing.md,
  },
  calDayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginBottom: 4,
  },
  calDayText: {
    fontFamily: Font.bold,
    fontSize: 14,
  },
  dayDetailsCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: Spacing.lg,
  },
  detailsTitle: {
    fontFamily: Font.bold,
    fontSize: 16,
    marginBottom: Spacing.md,
  },
  detailRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontFamily: Font.medium,
    fontSize: 14,
  },
  detailValue: {
    fontFamily: Font.bold,
    fontSize: 16,
  },
});
