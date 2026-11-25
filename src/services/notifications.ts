import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

const CHANNEL_ID = 'reminders';

const REMINDER_CONTENT = {
  title: '♡ cupid-player ♡',
  body: 'What song defines your day? Save it in your music diary.',
};

// Show notifications even when the app is open.
// Without this, a notification that arrives while the app is in use is hidden.
export function configureNotifications() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

// Ask the user for permission. Returns true if notifications are allowed.
export async function requestPermission(): Promise<boolean> {
  // On Android, notifications belong to a "channel" that the user can
  // control in the phone settings. It must exist before asking for permission.
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Daily reminders',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }

  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;

  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

// Schedule one reminder that repeats every day at the given time.
export async function scheduleDailyReminder(hour: number, minute: number) {
  // Remove the old reminder first, so the user never gets two per day.
  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    content: REMINDER_CONTENT,
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
      channelId: CHANNEL_ID,
    },
  });
}

// Turn the daily reminder off.
export async function cancelReminder() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

// Send the reminder once, 5 seconds from now. Useful for testing and demos.
export async function sendTestNotification() {
  await Notifications.scheduleNotificationAsync({
    content: REMINDER_CONTENT,
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 5,
      channelId: CHANNEL_ID,
    },
  });
}