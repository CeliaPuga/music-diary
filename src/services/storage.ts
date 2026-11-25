import AsyncStorage from '@react-native-async-storage/async-storage';
import { Song } from '../types';

const STORAGE_KEY = 'songs';

// Read all songs from device storage.
export async function loadSongs(): Promise<Song[]> {
  const saved = await AsyncStorage.getItem(STORAGE_KEY);
  if (saved === null) return [];

  const parsed: Partial<Song>[] = JSON.parse(saved);

  // Songs saved with older versions of the app have no id or createdAt,
  // so we fill in the missing fields to keep them working.
  return parsed.map((song, index) => ({
    id: song.id ?? `${Date.now()}-${index}`,
    title: song.title ?? '',
    artist: song.artist ?? '',
    mood: song.mood ?? '',
    note: song.note ?? '',
    createdAt: song.createdAt ?? new Date().toISOString(),
    artworkUrl: song.artworkUrl,
    previewUrl: song.previewUrl,
  }));
}

// Overwrite the stored list with the given songs.
export async function saveSongs(songs: Song[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(songs));
}