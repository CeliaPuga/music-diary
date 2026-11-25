import { View, Text, Pressable, Image } from 'react-native';
import { Song } from '../types';
import { styles } from '../styles/styles';

type Props = {
  song: Song;
  onDelete: (id: string) => void;
};

// One saved song in the diary, with its mood, note and a delete button.
export default function SongCard({ song, onDelete }: Props) {
  return (
    <View style={styles.songCard}>
      <View style={styles.songCardTop}>
        {song.artworkUrl ? (
          <Image source={{ uri: song.artworkUrl }} style={styles.songArtwork} />
        ) : (
          <View style={styles.miniRecord}>
            <View style={styles.miniRecordCentre} />
          </View>
        )}
        <View style={styles.songDetails}>
          <Text style={styles.songTitle}>{song.title}</Text>
          <Text style={styles.songArtist}>by {song.artist}</Text>
        </View>
      </View>

      <View style={styles.songMeta}>
        <Text style={styles.songMetaText}>MOOD: {song.mood || 'NOT SET'}</Text>
      </View>

      {song.note !== '' && <Text style={styles.songNote}>“{song.note}”</Text>}

      <Pressable style={styles.deleteButton} onPress={() => onDelete(song.id)}>
        <Text style={styles.deleteButtonText}>♥  REMOVE FROM DIARY</Text>
      </Pressable>
    </View>
  );
}