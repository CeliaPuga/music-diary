import { View, Text, Pressable, Image } from 'react-native';
import { Song } from '../types';
import { styles } from '../styles/styles';
import { MOODS } from '../constants/moods';

type Props = {
  song: Song;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  isPlaying: boolean;
  onTogglePreview: (song: Song) => void;
};



// One saved song in the diary, with its mood, note and a delete button.
export default function SongCard({ song, onDelete, onEdit, isPlaying, onTogglePreview }: Props) {
  // Find the symbol for this song's mood (e.g. ☀ for Happy), if it has one.
  const moodInfo = MOODS.find((mood) => mood.name === song.mood);

  // Turn the ISO date into something readable, e.g. "25 NOV 2026".
  const savedDate = new Date(song.createdAt)
    .toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    .toUpperCase();

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
        <Text style={styles.songMetaText}>
          {moodInfo ? `${moodInfo.symbol} ${moodInfo.name.toUpperCase()}` : 'NO MOOD'}  ·  {savedDate}
        </Text>
      </View>

      {/* Solo aparece si la canción tiene previewUrl. Las antiguas y las escritas a mano no tendrán botón. */}
      {song.previewUrl && (
        <Pressable
          style={[styles.previewButton, isPlaying && styles.previewButtonActive]}
          onPress={() => onTogglePreview(song)}
        >
          <Text style={styles.previewButtonText}>
            {isPlaying ? '■  STOP PREVIEW' : '▶  PLAY PREVIEW'}
          </Text>
        </Pressable>
      )}

      {song.note !== '' && <Text style={styles.songNote}>“{song.note}”</Text>}

      <View style={styles.cardActions}>
        <Pressable onPress={() => onEdit(song.id)}>
          <Text style={styles.deleteButtonText}>✎  EDIT</Text>
        </Pressable>
        <Pressable onPress={() => onDelete(song.id)}>
          <Text style={styles.deleteButtonText}>♥  REMOVE FROM DIARY</Text>
        </Pressable>
      </View>
      
    </View>
  );
}