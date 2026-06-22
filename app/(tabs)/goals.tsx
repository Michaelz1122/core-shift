import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform, UIManager } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '@/store/useStore';
import { Colors, Spacing, Font } from '@/constants/theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function GoalsHub() {
  const { language, goals, darkMode, deleteGoal } = useStore();
  const insets = useSafeAreaInsets();
  const isRTL = language === 'ar';

  const bg = darkMode ? '#000000' : '#FFFFFF';
  const cardBg = darkMode ? '#111111' : '#F9F9F9';
  const borderColor = darkMode ? '#222222' : '#EAEAEA';
  const textColor = darkMode ? '#FFFFFF' : '#000000';
  const textMuted = darkMode ? '#888888' : '#666666';

  const handleDelete = (id: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    deleteGoal(id);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]} edges={['top', 'left', 'right']}>
      {/* TopAppBar */}
      <View style={[styles.topAppBar, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <View style={styles.topBtnPlaceholder} />
        <Text style={[styles.appTitle, { color: textColor }]}>{isRTL ? 'أهدافي' : 'My Goals'}</Text>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push('/edit-goal'); // passing no ID means create new
          }}
          style={styles.addBtn}
        >
          <Ionicons name="add" size={26} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionSubtitle, { color: textMuted, textAlign: isRTL ? 'right' : 'left' }]}>
          {isRTL 
            ? 'الأهداف هي البوصلة الخاصة بك. أضف أهدافك هنا وتتبع المهام المرتبطة بها.' 
            : 'Goals are your compass. Manage your long-term outcomes here.'}
        </Text>

        <View style={styles.list}>
          {goals.filter(g => !g.archived).map((goal) => {
            return (
              <TouchableOpacity
                key={goal.id}
                activeOpacity={0.7}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push(`/goal/${goal.id}` as any);
                }}
                style={[
                  styles.card,
                  {
                    backgroundColor: cardBg,
                    borderColor: borderColor,
                    flexDirection: isRTL ? 'row-reverse' : 'row',
                  },
                ]}
              >
                <View style={[styles.iconBox, { backgroundColor: '#DBEAFE' }]}>
                  <Ionicons name={goal.icon as keyof typeof Ionicons.glyphMap || 'flag'} size={20} color={Colors.primary} />
                </View>

                <View style={styles.flexOne}>
                  <Text style={[styles.title, { color: textColor, textAlign: isRTL ? 'right' : 'left' }]}>
                    {goal.title}
                  </Text>
                </View>

                <View style={[styles.actionRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <TouchableOpacity
                    style={styles.iconBtn}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      router.push({ pathname: '/edit-goal', params: { id: goal.id } });
                    }}
                  >
                    <Ionicons name="pencil" size={20} color={textMuted} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.iconBtn}
                    onPress={() => handleDelete(goal.id)}
                  >
                    <Ionicons name="trash" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
          
          {goals.filter(g => !g.archived).length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="flag-outline" size={48} color={textMuted} />
              <Text style={[styles.emptyText, { color: textMuted }]}>
                {isRTL ? 'لا توجد أهداف حالياً' : 'No active goals'}
              </Text>
            </View>
          )}
        </View>
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
  addBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  scroll: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: 120, // space for tab bar
  },
  sectionSubtitle: {
    fontFamily: Font.medium,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
  list: {
    gap: Spacing.md,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: Spacing.md,
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexOne: { flex: 1 },
  title: {
    fontFamily: Font.semibold,
    fontSize: 16,
  },
  actionRow: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconBtn: {
    padding: Spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: Spacing.md,
  },
  emptyText: {
    fontFamily: Font.medium,
    fontSize: 16,
  }
});
