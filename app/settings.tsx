import { View, Text, TouchableOpacity, Switch, StyleSheet, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '@/store/useStore';
import { strings } from '@/constants/strings';
import { Colors, Spacing, Radii, Font } from '@/constants/theme';

export default function Settings() {
  const {
    language, setLanguage, darkMode, toggleDarkMode,
    remindersEnabled, toggleReminders, resetAll,
  } = useStore();
  const insets = useSafeAreaInsets();
  const t = strings[language];
  const isRTL = language === 'ar';

  const bg = darkMode ? Colors.bgDark : Colors.bg;
  const cardBg = darkMode ? Colors.cardDark : Colors.card;
  const borderColor = darkMode ? Colors.borderDark : Colors.border;
  const textColor = darkMode ? Colors.textDark : Colors.text;
  const textMuted = darkMode ? Colors.mutedDark : Colors.muted;

  const handleReset = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      t.resetData,
      t.resetConfirm,
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: t.reset,
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            resetAll();
            router.replace('/onboarding');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      {/* TopAppBar */}
      <View style={[styles.topAppBar, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.replace('/today');
          }}
          style={styles.backBtn}
        >
          <Text style={[styles.backText, { color: textColor }]}>{isRTL ? '→' : '←'}</Text>
        </TouchableOpacity>
        <Text style={[styles.appTitle, { color: textColor }]}>{t.settingsTitle}</Text>
        <View style={styles.topBtnPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Section: Preferences */}
        <Text style={[styles.sectionTitle, { color: textColor, textAlign: isRTL ? 'right' : 'left' }]}>
          {t.preferences}
        </Text>

        <View style={[styles.settingsCard, { backgroundColor: cardBg, borderColor }]}>
          {/* Row 1: Language */}
          <View style={[styles.settingRow, { flexDirection: isRTL ? 'row-reverse' : 'row', borderBottomColor: borderColor }]}>
            <View style={[styles.rowLabelGroup, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Ionicons name="globe-outline" size={24} color={textColor} />
              <Text style={[styles.rowLabel, { color: textColor }]}>{t.languageLabel}</Text>
            </View>
            <View style={[styles.langCapsule, { backgroundColor: borderColor, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <TouchableOpacity
                style={[styles.langOption, language === 'en' && styles.langOptionActive]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setLanguage('en');
                }}
              >
                <Text style={[styles.langText, language === 'en' && styles.langTextActive]}>EN</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.langOption, language === 'ar' && styles.langOptionActive]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setLanguage('ar');
                }}
              >
                <Text style={[styles.langText, language === 'ar' && styles.langTextActive]}>عر</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Row 2: Dark Mode */}
          <View style={[styles.settingRow, { flexDirection: isRTL ? 'row-reverse' : 'row', borderBottomColor: borderColor }]}>
            <View style={[styles.rowLabelGroup, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Ionicons name={darkMode ? "moon-outline" : "sunny-outline"} size={24} color={textColor} />
              <Text style={[styles.rowLabel, { color: textColor }]}>{t.themeLabel}</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                toggleDarkMode();
              }}
              trackColor={{ false: borderColor, true: Colors.primary }}
              thumbColor={Colors.white}
            />
          </View>

          {/* Row 3: Reminders */}
          <View style={[styles.settingRow, { flexDirection: isRTL ? 'row-reverse' : 'row', borderBottomWidth: 0 }]}>
            <View style={[styles.rowLabelGroup, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Ionicons name="notifications-outline" size={24} color={textColor} />
              <Text style={[styles.rowLabel, { color: textColor }]}>{t.reminders}</Text>
            </View>
            <Switch
              value={remindersEnabled}
              onValueChange={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                toggleReminders();
              }}
              trackColor={{ false: borderColor, true: Colors.primary }}
              thumbColor={Colors.white}
            />
          </View>
        </View>

        {/* Section: Reset Data */}
        <TouchableOpacity
          style={[styles.resetCard, { backgroundColor: cardBg, borderColor, flexDirection: isRTL ? 'row-reverse' : 'row' }]}
          onPress={handleReset}
          activeOpacity={0.7}
        >
          <View style={[styles.rowLabelGroup, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Ionicons name="trash-outline" size={24} color={Colors.danger} />
            <Text style={[styles.rowLabel, { color: Colors.danger }]}>{t.resetData}</Text>
          </View>
          <Text style={[styles.chevron, { color: textMuted }]}>{isRTL ? '←' : '→'}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={[styles.bottomBar, { backgroundColor: bg, borderTopColor: borderColor, paddingBottom: Math.max(insets.bottom, Spacing.xs), height: 72 + insets.bottom }]}>
        <TouchableOpacity
          style={styles.navTab}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.replace('/today');
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="calendar-outline" size={22} color={textMuted} style={styles.navIcon} />
          <Text style={[styles.navText, { color: textMuted }]}>Today</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navTab}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.replace('/progress');
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="stats-chart-outline" size={22} color={textMuted} style={styles.navIcon} />
          <Text style={[styles.navText, { color: textMuted }]}>Progress</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navTab, styles.navTabActive, { backgroundColor: darkMode ? '#1E293B' : '#ECEDF8' }]}
          onPress={() => {}}
          activeOpacity={0.7}
        >
          <Ionicons name="settings" size={22} color={textColor} style={styles.navIcon} />
          <Text style={[styles.navText, { color: textColor }]}>Settings</Text>
        </TouchableOpacity>
      </View>
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
  backBtn: {
    width: 40,
    justifyContent: 'center',
  },
  backText: {
    fontFamily: Font.bold,
    fontSize: 22,
  },
  appTitle: {
    fontFamily: Font.bold,
    fontSize: 20,
    letterSpacing: -0.5,
  },
  topBtnPlaceholder: {
    width: 40,
  },

  scroll: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: 120,
  },

  sectionTitle: {
    fontFamily: Font.bold,
    fontSize: 18,
    letterSpacing: -0.3,
    marginBottom: Spacing.md,
  },

  /* Cards */
  settingsCard: {
    borderWidth: 1.5,
    borderRadius: 24,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xl,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1.5,
  },
  rowLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  rowIcon: {
    fontSize: 20,
  },
  rowLabel: {
    fontFamily: Font.bold,
    fontSize: 15,
  },

  /* Language Capsule Toggle */
  langCapsule: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 2,
    alignItems: 'center',
    minWidth: 80,
  },
  langOption: {
    flex: 1,
    paddingVertical: 4,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  langOptionActive: {
    backgroundColor: Colors.primary,
  },
  langText: {
    fontFamily: Font.bold,
    fontSize: 12,
    color: '#9DA3AE',
  },
  langTextActive: {
    color: '#FFFFFF',
  },

  /* Reset Card */
  resetCard: {
    borderWidth: 1.5,
    borderRadius: 16,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  chevron: {
    fontSize: 16,
    fontFamily: Font.bold,
  },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  navTab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: 20,
    minWidth: 70,
  },
  navTabActive: {},
  navIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  navText: {
    fontFamily: Font.bold,
    fontSize: 11,
  },
});
