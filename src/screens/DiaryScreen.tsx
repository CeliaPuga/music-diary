import { View, Text, Pressable, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useSongs } from '../context/SongsContext';
import ScreenFrame from '../components/ScreenFrame';
import SongCard from '../components/SongCard';
import { styles } from '../styles/styles';
import { usePreviewPlayer } from '../hooks/usePreviewPlayer';
import { haptics } from '../services/haptics';
import { useState } from 'react';
import { MOODS } from '../constants/moods';

type Props = NativeStackScreenProps<RootStackParamList, 'Diary'>;

export default function DiaryScreen({ navigation }: Props) {
  const { songs, deleteSong } = useSongs();

  const { playingId, togglePreview } = usePreviewPlayer();

  // Selected mood filter, or null to show every song.
  const [moodFilter, setMoodFilter] = useState<string | null>(null);

  // Newest songs first, then keep only the ones that match the filter.
  const visibleSongs = [...songs]
    .reverse()
    .filter((song) => moodFilter === null || song.mood === moodFilter);

  const chooseFilter = (mood: string | null) => {
    haptics.select();
    setMoodFilter(mood);
  };

  // Ask for confirmation before deleting a song.
  const confirmDelete = (id: string) => {
    Alert.alert(
      'Delete song',
      'Are you sure you want to remove this song from your diary?',
      [
        // Button 1: closes the alert and does nothing.
        { text: 'Keep it', style: 'cancel' },
        // Button 2: deletes the song.
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            haptics.warning();
            deleteSong(id);
          },
        },
      ]
    );
  };

  return (
    <ScreenFrame>
      <View style={styles.screenContent}>
        <Text style={styles.eyebrow}>ALL YOUR LITTLE MEMORIES</Text>
        <Text style={styles.screenTitle}>my diary</Text>
        <Text style={styles.subtitle}>every song has a story to tell ♡</Text>

        <View style={styles.diaryIntro}>
          <Text style={styles.diaryIntroTitle}>♡ THE SOUNDTRACK OF YOU ♡</Text>
          {/* Show how many songs are visible, and how many are in the diary. Uses filters*/}
          <Text style={styles.diaryIntroText}>
            {moodFilter
              ? `${visibleSongs.length} of ${songs.length} songs feel ${moodFilter.toLowerCase()}`
              : `${songs.length} ${songs.length === 1 ? 'special song' : 'special songs'} in your collection`}
          </Text>
        </View>

        {songs.length === 0 ? (
          <View style={styles.emptyDiary}>
            <Text style={styles.emptyDiaryIcon}>♫</Text>
            <Text style={styles.emptyDiaryTitle}>it's a little quiet here...</Text>
            <Text style={styles.emptyMessage}>
              Add your first song and start collecting memories.
            </Text>
            <Pressable
              style={styles.smallPinkButton}
              onPress={() => navigation.navigate('AddSong')}
            >
              <Text style={styles.smallPinkButtonText}>ADD YOUR FIRST SONG  ♡</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.filterRow}>
              <Pressable
                style={[styles.filterChip, moodFilter === null && styles.filterChipSelected]}
                onPress={() => chooseFilter(null)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    moodFilter === null && styles.filterChipTextSelected,
                  ]}
                >
                  ALL
                </Text>
              </Pressable>

              {MOODS.map((mood) => (
                <Pressable
                  key={mood.name}
                  style={[
                    styles.filterChip,
                    moodFilter === mood.name && styles.filterChipSelected,
                  ]}
                  onPress={() => chooseFilter(mood.name)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      moodFilter === mood.name && styles.filterChipTextSelected,
                    ]}
                  >
                    {mood.symbol} {mood.name.toUpperCase()}
                  </Text>
                </Pressable>
              ))}
            </View>

            {visibleSongs.length === 0 ? (
              <Text style={styles.filterEmpty}>
                no {moodFilter?.toLowerCase()} songs yet ♡
              </Text>
            ) : (
              visibleSongs.map((song) => (
                <SongCard
                  key={song.id}
                  song={song}
                  onDelete={confirmDelete}
                  isPlaying={playingId === song.id}
                  onTogglePreview={togglePreview}
                />
              ))
            )}
          </>
        )}

        <Pressable style={styles.primaryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.primaryButtonText}>←  BACK TO HOME  ♡</Text>
        </Pressable>
      </View>
    </ScreenFrame>
  );
}