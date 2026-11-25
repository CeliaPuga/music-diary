import { useState } from 'react';
import { View, Text, Pressable, TextInput, Alert, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { SearchResult } from '../types';
import * as itunes from '../services/itunes';
import { useSongs } from '../context/SongsContext';
import ScreenFrame from '../components/ScreenFrame';
import { MOODS } from '../constants/moods';
import { styles, placeholderColor } from '../styles/styles';
import { haptics } from '../services/haptics';

type Props = NativeStackScreenProps<RootStackParamList, 'AddSong'>;

export default function AddSongScreen({ navigation, route }: Props) {
    const { songs, addSong, updateSong } = useSongs();

  // If we came here with a songId, we are editing that song.
  const songToEdit = songs.find((song) => song.id === route.params?.songId);
  const isEditing = !!songToEdit;

  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  // When editing, the form starts with the saved values.
  const [songTitle, setSongTitle] = useState(songToEdit?.title ?? '');
  const [artist, setArtist] = useState(songToEdit?.artist ?? '');
  const [selectedMood, setSelectedMood] = useState(songToEdit?.mood ?? '');
  const [personalNote, setPersonalNote] = useState(songToEdit?.note ?? '');
  // The iTunes result the user picked, so we can keep its artwork and preview.
  const [selectedSong, setSelectedSong] = useState<SearchResult | null>(null);


  // Search the iTunes catalogue and show the results.
  const searchSongs = async () => {
    if (searchText.trim() === '') {
      Alert.alert('Song search', 'Please enter a song or artist name.');
      return;
    }

    try {
      const results = await itunes.searchSongs(searchText);
      setSearchResults(results);

      if (results.length === 0) {
        Alert.alert('No songs found', 'Try another song or artist.');
      }
    } catch (error) {
      Alert.alert('Search error', 'Could not search for songs. Please try again.');
    }
  };

  // Fill the form with the song the user tapped.
  const chooseSong = (song: SearchResult) => {
    haptics.select();
    setSelectedSong(song);
    setSongTitle(song.trackName);
    setArtist(song.artistName);
    setSearchText('');
    setSearchResults([]);
  };

  // Validate the form, save the song and go back to the previous screen.
  const saveSong = async () => {
    if (songTitle.trim() === '' || artist.trim() === '') {
      Alert.alert(
        'Missing information',
        'Please choose a song or enter both its title and artist.'
      );
      return;
    }

    const data = {
      title: songTitle.trim(),
      artist: artist.trim(),
      mood: selectedMood,
      note: personalNote.trim(),
      // Use the new iTunes song if one was picked, otherwise keep the old artwork/preview.
      artworkUrl: selectedSong?.artworkUrl100 ?? songToEdit?.artworkUrl,
      previewUrl: selectedSong?.previewUrl ?? songToEdit?.previewUrl,
    };

    const saved = songToEdit
      ? await updateSong(songToEdit.id, data)
      : await addSong(data);

    if (saved) {
      haptics.success();
      navigation.goBack();
    }
  };

  return (
    <ScreenFrame>
      <View style={styles.screenContent}>
        <Text style={styles.eyebrow}>{isEditing ? 'EDIT A MEMORY ♡' : 'A NEW MEMORY ♡'}</Text>
        <Text style={styles.screenTitle}>{isEditing ? 'edit song' : 'add a song'}</Text>
        <Text style={styles.subtitle}>
          {isEditing ? 'change how this song feels to you.' : 'choose a song and keep the feeling.'}
        </Text>

        <View style={styles.formCard}>
          <Text style={styles.sectionLabel}>
            {isEditing ? '01 / CHANGE THE SONG (OPTIONAL)' : '01 / FIND YOUR SONG'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Search song or artist..."
            placeholderTextColor={placeholderColor}
            value={searchText}
            onChangeText={setSearchText}
          />

          <Pressable style={styles.smallPinkButton} onPress={searchSongs}>
            <Text style={styles.smallPinkButtonText}>SEARCH THE MUSIC BOX  →</Text>
          </Pressable>

          {searchResults.map((song) => (
            <Pressable
              key={song.trackId}
              style={styles.searchResult}
              onPress={() => chooseSong(song)}
            >
              {song.artworkUrl100 && (
                <Image source={{ uri: song.artworkUrl100 }} style={styles.searchArtwork} />
              )}
              <View style={styles.searchResultText}>
                <Text style={styles.searchResultTitle}>{song.trackName}</Text>
                <Text style={styles.searchResultArtist}>{song.artistName}</Text>
                <Text style={styles.searchResultChoose}>TAP TO CHOOSE  ♡</Text>
              </View>
            </Pressable>
          ))}

          <View style={styles.formDivider}>
            <Text style={styles.formDividerText}>✧  YOUR SELECTED SONG  ✧</Text>
          </View>

          <Text style={styles.sectionLabel}>SONG TITLE</Text>
          <TextInput
            style={styles.input}
            placeholder="Song title"
            placeholderTextColor={placeholderColor}
            value={songTitle}
            onChangeText={setSongTitle}
          />

          <Text style={styles.sectionLabel}>ARTIST</Text>
          <TextInput
            style={styles.input}
            placeholder="Artist name"
            placeholderTextColor={placeholderColor}
            value={artist}
            onChangeText={setArtist}
          />

          <Text style={styles.sectionLabel}>02 / HOW DOES IT FEEL?</Text>
          <View style={styles.moodGrid}>
            {MOODS.map((mood) => (
              <Pressable
                key={mood.name}
                style={[
                  styles.moodButton,
                  selectedMood === mood.name && styles.moodButtonSelected,
                ]}
                onPress={() => {
                  haptics.select();
                  setSelectedMood(mood.name);
                }}              >
                <Text
                  style={[
                    styles.moodButtonText,
                    selectedMood === mood.name && styles.moodButtonTextSelected,
                  ]}
                >
                  {mood.symbol}  {mood.name}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.sectionLabel}>03 / LEAVE A LITTLE NOTE</Text>
          <TextInput
            style={[styles.input, styles.noteInput]}
            placeholder="Write a memory or thought about this song..."
            placeholderTextColor={placeholderColor}
            value={personalNote}
            onChangeText={setPersonalNote}
            multiline={true}
          />
        </View>

        <Pressable style={styles.primaryButton} onPress={saveSong}>
          <Text style={styles.primaryButtonText}>
            {isEditing ? '♡  SAVE CHANGES  ♡' : '♡  SAVE TO MY DIARY  ♡'}
          </Text>
        </Pressable>

        <Pressable style={styles.textButton} onPress={() => navigation.goBack()}>
          <Text style={styles.textButtonText}>← BACK</Text>
        </Pressable>
      </View>
    </ScreenFrame>
  );
}