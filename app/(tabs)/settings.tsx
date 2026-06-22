import { View, Text, TouchableOpacity, Switch, StyleSheet, Alert, ScrollView, Linking } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import * as StoreReview from 'expo-store-review';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '@/store/useStore';
import { strings } from '@/constants/strings';
import { Colors, Spacing, Font } from '@/constants/theme';

export default function Settings() {
  const {
    language, setLanguage, darkMode, toggleDarkMode, resetAll
  } = useStore();
  const insets = useSafeAreaInsets();
  const t = strings[language];
  const isRTL = language === 'ar';

  const bg = darkMode ? '#000000' : '#FFFFFF';
  const cardBg = darkMode ? '#111111' : '#F9F9F9';
  const borderColor = darkMode ? '#222222' : '#EAEAEA';
  const textColor = darkMode ? '#FFFFFF' : '#000000';
  const textMuted = darkMode ? '#888888' : '#666666';

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
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]} edges={['top', 'left', 'right']}>
      {/* TopAppBar */}
      <View style={[styles.topAppBar, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <View style={styles.topBtnPlaceholder} />
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
          <View style={[styles.settingRow, { flexDirection: isRTL ? 'row-reverse' : 'row', borderBottomWidth: 0 }]}>
            <View style={[styles.rowLabelGroup, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Ionicons name={darkMode ? "moon" : "sunny"} size={24} color={textColor} />
              <Text style={[styles.rowLabel, { color: textColor }]}>{t.themeLabel}</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                toggleDarkMode();
              }}
              trackColor={{ false: borderColor, true: '#2563EB' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Section: Support */}
        <Text style={[styles.sectionTitle, { color: textColor, textAlign: isRTL ? 'right' : 'left', marginTop: Spacing.md }]}>
          {t.supportTitle}
        </Text>

        <View style={[styles.settingsCard, { backgroundColor: cardBg, borderColor }]}>
          {/* Rate App */}
          <TouchableOpacity
            style={[styles.settingRow, { flexDirection: isRTL ? 'row-reverse' : 'row', borderBottomColor: borderColor }]}
            onPress={async () => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              try {
                if (await StoreReview.hasAction()) {
                  await StoreReview.requestReview();
                } else {
                  // Fallback to Play Store link
                  Linking.openURL('market://details?id=com.coreshift.app');
                }
              } catch (e) {
                Linking.openURL('https://play.google.com/store/apps/details?id=com.coreshift.app');
              }
            }}
          >
            <View style={[styles.rowLabelGroup, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Ionicons name="star" size={24} color="#F59E0B" />
              <Text style={[styles.rowLabel, { color: textColor }]}>{t.rateApp}</Text>
            </View>
            <Text style={[styles.chevron, { color: textMuted }]}>{isRTL ? '←' : '→'}</Text>
          </TouchableOpacity>

          {/* Report Bug */}
          <TouchableOpacity
            style={[styles.settingRow, { flexDirection: isRTL ? 'row-reverse' : 'row', borderBottomColor: borderColor }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              Linking.openURL('mailto:mzapps.support@gmail.com?subject=CoreShift%20Bug%20Report');
            }}
          >
            <View style={[styles.rowLabelGroup, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Ionicons name="bug-outline" size={24} color={textColor} />
              <Text style={[styles.rowLabel, { color: textColor }]}>{t.reportBug}</Text>
            </View>
            <Text style={[styles.chevron, { color: textMuted }]}>{isRTL ? '←' : '→'}</Text>
          </TouchableOpacity>

          {/* Suggest Feature */}
          <TouchableOpacity
            style={[styles.settingRow, { flexDirection: isRTL ? 'row-reverse' : 'row', borderBottomColor: borderColor }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              Linking.openURL('mailto:mzapps.support@gmail.com?subject=CoreShift%20Feature%20Suggestion');
            }}
          >
            <View style={[styles.rowLabelGroup, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Ionicons name="bulb-outline" size={24} color={textColor} />
              <Text style={[styles.rowLabel, { color: textColor }]}>{t.suggestFeature}</Text>
            </View>
            <Text style={[styles.chevron, { color: textMuted }]}>{isRTL ? '←' : '→'}</Text>
          </TouchableOpacity>

          {/* Contact Support */}
          <TouchableOpacity
            style={[styles.settingRow, { flexDirection: isRTL ? 'row-reverse' : 'row', borderBottomColor: borderColor }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              Linking.openURL('mailto:mzapps.support@gmail.com?subject=CoreShift%20Support%20Request');
            }}
          >
            <View style={[styles.rowLabelGroup, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Ionicons name="mail-outline" size={24} color={textColor} />
              <Text style={[styles.rowLabel, { color: textColor }]}>{t.contactSupport}</Text>
            </View>
            <Text style={[styles.chevron, { color: textMuted }]}>{isRTL ? '←' : '→'}</Text>
          </TouchableOpacity>

          {/* Privacy Policy */}
          <TouchableOpacity
            style={[styles.settingRow, { flexDirection: isRTL ? 'row-reverse' : 'row', borderBottomColor: borderColor }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              Linking.openURL('https://coreshift-web.vercel.app/privacy');
            }}
          >
            <View style={[styles.rowLabelGroup, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Ionicons name="shield-checkmark-outline" size={24} color={textColor} />
              <Text style={[styles.rowLabel, { color: textColor }]}>{t.privacyPolicy}</Text>
            </View>
            <Text style={[styles.chevron, { color: textMuted }]}>{isRTL ? '←' : '→'}</Text>
          </TouchableOpacity>

          {/* Terms of Use */}
          <TouchableOpacity
            style={[styles.settingRow, { flexDirection: isRTL ? 'row-reverse' : 'row', borderBottomWidth: 0 }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              Linking.openURL('https://coreshift-web.vercel.app/terms');
            }}
          >
            <View style={[styles.rowLabelGroup, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Ionicons name="document-text-outline" size={24} color={textColor} />
              <Text style={[styles.rowLabel, { color: textColor }]}>{t.termsOfUse}</Text>
            </View>
            <Text style={[styles.chevron, { color: textMuted }]}>{isRTL ? '←' : '→'}</Text>
          </TouchableOpacity>
        </View>

        {/* Section: Reset Data */}
        <TouchableOpacity
          style={[styles.resetCard, { backgroundColor: cardBg, borderColor, flexDirection: isRTL ? 'row-reverse' : 'row' }]}
          onPress={handleReset}
          activeOpacity={0.7}
        >
          <View style={[styles.rowLabelGroup, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Ionicons name="trash-outline" size={24} color="#EF4444" />
            <Text style={[styles.rowLabel, { color: '#EF4444' }]}>{t.resetData}</Text>
          </View>
          <Text style={[styles.chevron, { color: textMuted }]}>{isRTL ? '←' : '→'}</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={[styles.appVersion, { color: textMuted }]}>
          {t.appVersion} {Constants.expoConfig?.version || '1.0.0'}
        </Text>
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
  appTitle: {
    fontFamily: Font.bold,
    fontSize: 18,
    letterSpacing: -0.5,
  },
  topBtnPlaceholder: {
    width: 40,
  },
  scroll: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: 120, // Tab bar padding
  },
  sectionTitle: {
    fontFamily: Font.bold,
    fontSize: 18,
    letterSpacing: -0.3,
    marginBottom: Spacing.md,
  },
  settingsCard: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
  },
  rowLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  rowLabel: {
    fontFamily: Font.bold,
    fontSize: 15,
  },
  langCapsule: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 4,
    alignItems: 'center',
    width: 100,
  },
  langOption: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  langOptionActive: {
    backgroundColor: '#2563EB',
  },
  langText: {
    fontFamily: Font.bold,
    fontSize: 12,
    color: '#888888',
  },
  langTextActive: {
    color: '#FFFFFF',
  },
  resetCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chevron: {
    fontSize: 16,
    fontFamily: Font.bold,
  },
  appVersion: {
    textAlign: 'center',
    fontFamily: Font.medium,
    fontSize: 12,
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
  },
});
