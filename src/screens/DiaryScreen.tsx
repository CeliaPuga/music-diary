import { View, Text, Pressable, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useSongs } from '../context/SongsContext';
import ScreenFrame from '../components/ScreenFrame';
import SongCard from '../components/SongCard';
import { styles } from '../styles/styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Diary'>;

export default function DiaryScreen({ navigation }: Props) {
  const { songs, deleteSong } = useSongs();

  // Ask for confirmation before deleting a song.
  const confirmDelete = (id: string) => {
    Alert.alert(
      'Delete song',
      'Are you sure you want to remove this song from your diary?',
      [
        { text: 'Keep it', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteSong(id) },
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
          <Text style={styles.diaryIntroText}>
            {songs.length} {songs.length === 1 ? 'special song' : 'special songs'} in your collection
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
          songs.map((song) => (
            <SongCard key={song.id} song={song} onDelete={confirmDelete} />
          ))
        )}

        <Pressable style={styles.primaryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.primaryButtonText}>←  BACK TO HOME  ♡</Text>
        </Pressable>
      </View>
    </ScreenFrame>
  );
}