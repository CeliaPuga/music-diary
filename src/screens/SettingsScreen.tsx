import { useEffect, useState } from 'react';
import { View, Text, Pressable, Switch, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { ReminderSettings } from '../types';
import * as storage from '../services/storage';
import * as notifications from '../services/notifications';
import { haptics } from '../services/haptics';
import ScreenFrame from '../components/ScreenFrame';
import { styles } from '../styles/styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

// Times the user can choose for the daily reminder.
const REMINDER_TIMES = [
  { hour: 9, minute: 0 },
  { hour: 13, minute: 0 },
  { hour: 18, minute: 0 },
  { hour: 21, minute: 0 },
];

// Format 9, 0 as "09:00".
const formatTime = (hour: number, minute: number) =>
  `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

export default function SettingsScreen({ navigation }: Props) {
  const [reminder, setReminder] = useState<ReminderSettings>(storage.DEFAULT_REMINDER);

  // Load the saved settings when the screen opens.
  useEffect(() => {
    const init = async () => {
      try {
        setReminder(await storage.loadReminder());
      } catch (error) {
        Alert.alert('Error', 'Could not load your reminder settings.');
      }
    };
    init();
  }, []);

  const showPermissionAlert = () => {
    Alert.alert(
      'Notifications are off',
      'Allow notifications for this app in your phone settings to get reminders.'
    );
  };

  // Schedule or cancel the reminder, then save the new settings.
  const applyReminder = async (next: ReminderSettings) => {
    try {
      if (next.enabled) {
        const allowed = await notifications.requestPermission();
        if (!allowed) {
          showPermissionAlert();
          return;
        }
        await notifications.scheduleDailyReminder(next.hour, next.minute);
      } else {
        await notifications.cancelReminder();
      }

      await storage.saveReminder(next);
      setReminder(next);
      haptics.select();
    } catch (error) {
      Alert.alert('Error', 'Could not update your reminder.');
    }
  };

  // Send one notification in 5 seconds so the user can see how it looks.
  const sendTest = async () => {
    try {
      const allowed = await notifications.requestPermission();
      if (!allowed) {
        showPermissionAlert();
        return;
      }
      await notifications.sendTestNotification();
      haptics.success();
      Alert.alert('Test sent ♡', 'You will get a notification in 5 seconds.');
    } catch (error) {
      Alert.alert('Error', 'Could not send the test notification.');
    }
  };

  return (
    <ScreenFrame>
      <View style={styles.screenContent}>
        <Text style={styles.eyebrow}>A LITTLE NUDGE EACH DAY ♡</Text>
        <Text style={styles.screenTitle}>reminders</Text>
        <Text style={styles.subtitle}>never forget the song of your day.</Text>

        <View style={styles.formCard}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>DAILY REMINDER</Text>
            <Switch
              value={reminder.enabled}
              onValueChange={(enabled) => applyReminder({ ...reminder, enabled })}
              trackColor={{ false: '#E3AAB4', true: '#C8798C' }}
              thumbColor="#FFF5EF"
            />
          </View>

          <Text style={styles.sectionLabel}>REMIND ME AT</Text>
          <View style={[styles.moodGrid, !reminder.enabled && styles.disabled]}>
            {REMINDER_TIMES.map((time) => {
              const isSelected =
                reminder.hour === time.hour && reminder.minute === time.minute;
              return (
                <Pressable
                  key={formatTime(time.hour, time.minute)}
                  style={[styles.moodButton, isSelected && styles.moodButtonSelected]}
                  onPress={() => applyReminder({ ...reminder, ...time })}
                >
                  <Text
                    style={[
                      styles.moodButtonText,
                      isSelected && styles.moodButtonTextSelected,
                    ]}
                  >
                    {formatTime(time.hour, time.minute)}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.reminderStatus}>
            {reminder.enabled
              ? `♡ every day at ${formatTime(reminder.hour, reminder.minute)} ♡`
              : 'reminders are off'}
          </Text>

          <Pressable style={styles.smallPinkButton} onPress={sendTest}>
            <Text style={styles.smallPinkButtonText}>SEND A TEST IN 5 SECONDS  ✧</Text>
          </Pressable>
        </View>

        <Pressable style={styles.primaryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.primaryButtonText}>←  BACK TO HOME  ♡</Text>
        </Pressable>
      </View>
    </ScreenFrame>
  );
}