import * as Haptics from 'expo-haptics';

// Small vibrations that give physical feedback to the user's actions.
// Each one has a clear meaning, so the same action always feels the same.
export const haptics = {
  // Light tap: choosing an option (mood, search result).
  select: () => Haptics.selectionAsync(),

  // Soft knock: pressing play or stop on a preview.
  tap: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),

  // Success pattern: a song was saved.
  success: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),

  // Warning pattern: a song was deleted.
  warning: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
};