import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useStore, getLocalDateStr } from '@/store/useStore';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function useNotifications() {
  const { onboarded, history, language } = useStore();
  const isRTL = language === 'ar';

  useEffect(() => {
    if (!onboarded) return;

    const setupNotifications = async () => {
      // 1. Request Permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        return;
      }

      // 2. Configure Android Channel
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('coreshift-reminders', {
          name: 'CoreShift Reminders',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#059669',
        });
      }

      // 3. Clear and Reschedule to avoid duplicates
      await Notifications.cancelAllScheduledNotificationsAsync();

      // Morning Reminder (Daily 09:00 AM)
      await Notifications.scheduleNotificationAsync({
        content: {
          title: isRTL ? 'صباح الخير! ☀️' : 'Good Morning! ☀️',
          body: isRTL ? 'هل أنت مستعد لتنفيذ أهدافك اليوم؟' : 'Ready to execute your goals today?',
          sound: true,
        },
        trigger: {
          hour: 9,
          minute: 0,
          repeats: true,
          type: 'daily',
        } as any,
      });

      // Evening Review Reminder (Daily 05:00 PM / 17:00)
      await Notifications.scheduleNotificationAsync({
        content: {
          title: isRTL ? 'المراجعة المسائية 🌙' : 'Evening Review 🌙',
          body: isRTL ? 'حان الوقت لمراجعة إنجازات اليوم والتحضير لغدٍ أفضل.' : 'Time to review today\'s progress and prepare for tomorrow.',
          sound: true,
        },
        trigger: {
          hour: 17,
          minute: 0,
          repeats: true,
          type: 'daily',
        } as any,
      });

      // Streak Protection (Daily 08:00 PM / 20:00)
      const todayStr = getLocalDateStr();
      const todayStats = history[todayStr];
      const hasCompletedActionToday = todayStats && todayStats.completedActions > 0;
      
      if (!hasCompletedActionToday) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: isRTL ? 'احمِ استمراريتك! 🔥' : 'Protect your streak! 🔥',
            body: isRTL ? 'لم تقم بتسجيل أي إنجاز اليوم. مهمة واحدة تكفي للحفاظ على الاستمرارية.' : 'You haven\'t logged any actions today. One action is all it takes to keep your streak alive.',
            sound: true,
          },
          trigger: {
            hour: 20,
            minute: 0,
            repeats: true,
            type: 'daily',
          } as any,
        });
      }
    };

    setupNotifications();
  }, [onboarded, history, language]);
}
