import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const requestNotificationPermissions = async (): Promise<boolean> => {
  if (!Device.isDevice) {
    console.warn('Must use physical device for Push Notifications');
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('Failed to get push token for push notification!');
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#2D7FF9',
    });
  }

  return true;
};

export const scheduleDailyReminder = async (hour: number, minute: number, language: 'en' | 'ar') => {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const title = language === 'ar' ? 'وقت CoreShift!' : 'Time for CoreShift!';
  const body = language === 'ar' 
    ? 'خطوتك الصغيرة النهاردة هتبني عادتك بكرة. ادخل سجل يومك.' 
    : 'Your small step today builds your habit tomorrow. Check in now.';

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
    },
    // @ts-ignore
    trigger: {
      hour,
      minute,
      repeats: true,
    },
  });
};

export const cancelAllReminders = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};
