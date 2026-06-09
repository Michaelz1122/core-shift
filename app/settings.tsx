import { View, Text, TouchableOpacity, Switch, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useStore } from '@/store/useStore';
import { strings } from '@/constants/strings';
import { Colors, Spacing, Radii, Font } from '@/constants/theme';

export default function Settings() {
  const {
    language, setLanguage, darkMode, toggleDarkMode,
    remindersEnabled, toggleReminders, resetAll,
  } = useStore();
  const t = strings[language];
  const isRTL = language === 'ar';

  const bg = darkMode ? Colors.bgDark : Colors.bg;
  const cardBg = darkMode ? Colors.cardDark : Colors.card;
  const borderColor = darkMode ? Colors.borderDark : Colors.border;
  const textColor = darkMode ? Colors.textDark : Colors.text;

  const handleReset = () => {
    Alert.alert(
      t.resetData,
      t.resetConfirm,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetAll();
            router.replace('/onboarding');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={[styles.backText, { color: textColor }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: textColor }]}>{t.settingsTitle}</Text>
        <View style={styles.backBtn} />
      </View>

      <View style={styles.content}>
        {/* Language */}
        <View style={[styles.row, { backgroundColor: cardBg, borderColor }]}>
          <Text style={[styles.rowLabel, { color: textColor }]}>{t.languageLabel}</Text>
          <View style={styles.langToggle}>
            <TouchableOpacity
              style={[styles.langBtn, language === 'en' && styles.langBtnActive]}
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setLanguage('en'); }}
            >
              <Text style={[styles.langText, language === 'en' && styles.langTextActive]}>EN</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.langBtn, language === 'ar' && styles.langBtnActive]}
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setLanguage('ar'); }}
            >
              <Text style={[styles.langText, language === 'ar' && styles.langTextActive]}>عر</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Theme */}
        <View style={[styles.row, { backgroundColor: cardBg, borderColor }]}>
          <Text style={[styles.rowLabel, { color: textColor }]}>{t.themeLabel}</Text>
          <TouchableOpacity
            style={[styles.themeBtn, { backgroundColor: borderColor }]}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); toggleDarkMode(); }}
          >
            <Text style={[styles.themeText, { color: textColor }]}>
              {darkMode ? t.dark : t.light} {darkMode ? '🌙' : '☀️'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Reminders */}
        <View style={[styles.row, { backgroundColor: cardBg, borderColor }]}>
          <Text style={[styles.rowLabel, { color: textColor }]}>{t.reminders}</Text>
          <Switch
            value={remindersEnabled}
            onValueChange={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); toggleReminders(); }}
            trackColor={{ false: Colors.border, true: Colors.primary }}
            thumbColor={Colors.white}
          />
        </View>

        {/* Reset */}
        <TouchableOpacity
          style={[styles.row, styles.resetRow, { backgroundColor: cardBg, borderColor }]}
          onPress={handleReset}
          activeOpacity={0.7}
        >
          <Text style={[styles.rowLabel, { color: Colors.danger }]}>{t.resetData}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  backBtn: { width: 36 },
  backText: { fontFamily: Font.bold, fontSize: 22 },
  title: { fontFamily: Font.bold, fontSize: 20 },

  content: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.base,
    borderRadius: Radii.lg,
    borderWidth: 1,
  },
  rowLabel: { fontFamily: Font.semibold, fontSize: 15 },
  resetRow: { marginTop: Spacing.xl },

  langToggle: { flexDirection: 'row', gap: Spacing.xs },
  langBtn: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: Radii.sm,
    backgroundColor: 'transparent',
  },
  langBtnActive: { backgroundColor: Colors.primary },
  langText: { fontFamily: Font.semibold, fontSize: 14, color: Colors.muted },
  langTextActive: { color: Colors.white },

  themeBtn: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: Radii.sm,
  },
  themeText: { fontFamily: Font.semibold, fontSize: 14 },
});
