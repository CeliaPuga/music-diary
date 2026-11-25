
import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, View, ScrollView, Pressable, TextInput, Alert } from 'react-native';

// useState: nos permitirá guardar información temporalmente mientras utilizamos la aplicación. Por ejemplo, recordar qué pantalla estamos viendo.
// Pressable: nos permitirá crear botones que el usuario pueda pulsar.
// TextInput: nos permitirá escribir texto, como el título de una canción o el nombre de un artista.
export default function App() {

  //save the name of the screen we're using and set for changing it
  //use for opening it at first instance
  const [currentScreen, setCurrentScreen] = useState('home');
  const [songTitle, setSongTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [songs, setSongs] = useState<{ title: string; artist: string; mood: string; note: string }[]>([]);
  //guarda el texto que escribes para buscar una canción.
  //guarda las canciones que nos devuelve iTunes.
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedMood, setSelectedMood] = useState('');
  const [personalNote, setPersonalNote] = useState('');



  {/* Load saved songs when the app starts */}
  const loadSongs = async () => {
    try {
      const savedSongs = await AsyncStorage.getItem('songs');

      if (savedSongs !== null) {
        setSongs(JSON.parse(savedSongs));
      }
    } catch (error) {
      Alert.alert('Error', 'Could not load your saved songs.');
    }
  };

  {/* Save songs to AsyncStorage whenever the songs state changes */}
  useEffect(() => {
    loadSongs();
  }, []);

  const saveSong = async () => {
  if (songTitle.trim() === '' || artist.trim() === '') {
    Alert.alert(
      'Missing information',
      'Please enter both the song title and artist.'
    );
    return;
  }

  const newSong = {
    title: songTitle,
    artist: artist,
    mood: selectedMood,
    note: personalNote,
  };

  {/* Update the songs state and save to AsyncStorage */}
  const updatedSongs = [...songs, newSong];

  try {
    await AsyncStorage.setItem('songs', JSON.stringify(updatedSongs));
    setSongs(updatedSongs);
  } catch (error) {
    Alert.alert('Error', 'Could not save your song.');
    return;
  }

  setSongTitle('');
  setArtist('');
  setCurrentScreen('home');
  setSelectedMood('');
  setPersonalNote('');
};

  const deleteSong = (index: number) => {
    Alert.alert(
      'Delete song',
      'Are you sure you want to delete this song?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedSongs = songs.filter(
              (song, songIndex) => songIndex !== index
            );

            try {
              await AsyncStorage.setItem('songs', JSON.stringify(updatedSongs));
              setSongs(updatedSongs);
            } catch (error) {
              Alert.alert('Error', 'Could not delete the song.');
            }
          },
        },
      ]
    );
  };

  // Search for real songs using the iTunes API
  // Esta función hace una petición a iTunes y guarda los resultados en searchResults.
  const searchSongs = async () => {
    if (searchText.trim() === '') {
      Alert.alert('Search', 'Please enter a song or artist name.');
      return;
    }

    try {
      const response = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(searchText)}&entity=song&limit=10`
      );

      const data = await response.json();

      setSearchResults(data.results);
    } catch (error) {
      Alert.alert('Error', 'Could not search for songs. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScrollView showsVerticalScrollIndicator={false}>

        {currentScreen === 'home' && (
          <>
            <View style={styles.header}>
              <Text style={styles.logo}>MY MUSIC DIARY</Text>
              <Text style={styles.greeting}>Hello, music lover!</Text>
              <Text style={styles.subtitle}>
                Your life, your memories, your music.
              </Text>
            </View>

            <View style={styles.highlight}>
              <Text style={styles.highlightLabel}>YOUR PERSONAL SPACE</Text>
              <Text style={styles.highlightTitle}>
                Every song tells a story.
              </Text>
              <Text style={styles.highlightText}>
                Keep your favourite songs and the memories
                that come with them.
              </Text>
            </View>

            <Text style={styles.sectionTitle}>How are you feeling today?</Text>

            <View style={styles.moods}>
              <Text style={styles.mood}>Happy</Text>
              <Text style={styles.mood}>Sad</Text>
              <Text style={styles.mood}>Relaxed</Text>
              <Text style={styles.mood}>Energetic</Text>
            </View>

            <Text style={styles.sectionTitle}>Your music diary</Text>

            <Pressable
              style={styles.addButton}
              onPress={() => setCurrentScreen('diary')}
            >
              <Text style={styles.addButtonText}>My Diary</Text>
            </Pressable>


            <Pressable                                                  //creates a button
              style={styles.addButton}
              onPress={() => setCurrentScreen('add')}
            >
              <Text style={styles.addButtonText}>+ Add a song</Text>
            </Pressable>

            {songs.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>Your story starts here</Text>
              <Text style={styles.emptyText}>
                You haven't added any songs yet.
                Start building your personal music diary!
              </Text>
            </View>
            ) : (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>Your saved songs</Text>

                {songs.map((song, index) => (
                  <View key={index} style={styles.songItem}>
                    <Text style={styles.emptyTitle}>{song.title}</Text>
                    <Text style={styles.emptyText}>{song.artist}</Text>
                    <Text style={styles.emptyText}>Mood: {song.mood}</Text>
                    <Text style={styles.emptyText}>Note: {song.note}</Text>
                    <Pressable
                      onPress={() => deleteSong(index)}
                    >
                      <Text style={styles.cancelButtonText}>🗑️ Delete song</Text>
                    </Pressable>
                  </View>
                ))}
              </View>
            )}
          </>
        )}
        {/* if currentScreen is home, it shows homescreen */}
        {/* if is add, it shows the new screen */}
        {currentScreen === 'add' && (
          <View style={styles.header}>

            <Text style={styles.logo}>MY MUSIC DIARY</Text>

            <Text style={styles.greeting}>Add a new song</Text>

            <Text style={styles.subtitle}>
              Save a song and the memories behind it.
            </Text>

            <Text style={styles.inputLabel}>How does this song make you feel?</Text>

            <View style={styles.moods}>
              <Pressable
                style={styles.mood}
                onPress={() => setSelectedMood('Happy')}
              >
                <Text style={styles.moodText}>😊 Happy</Text>
              </Pressable>

              <Pressable
                style={styles.mood}
                onPress={() => setSelectedMood('Sad')}
              >
                <Text style={styles.moodText}>😢 Sad</Text>
              </Pressable>

              <Pressable
                style={styles.mood}
                onPress={() => setSelectedMood('Relaxed')}
              >
                <Text style={styles.moodText}>😌 Relaxed</Text>
              </Pressable>

              <Pressable
                style={styles.mood}
                onPress={() => setSelectedMood('Energetic')}
              >
                <Text style={styles.moodText}>⚡ Energetic</Text>
              </Pressable>
            </View>


            <Text style={styles.subtitle}>
              Selected mood: {selectedMood || 'None'}
            </Text>

            <Text style={styles.inputLabel}>Find a real song</Text>

            <TextInput
              style={styles.input}
              placeholder="Search for a song or artist..."
              placeholderTextColor="#9992AA"
              value={searchText}
              onChangeText={setSearchText}
            />

            <Pressable
              style={styles.addButton}
              onPress={searchSongs}
            >
              <Text style={styles.addButtonText}>Search</Text>
            </Pressable>


            {searchResults.map((song, index) => (
              <Pressable
                key={song.trackId}
                style={styles.songItem}
                onPress={() => {
                  setSongTitle(song.trackName);
                  setArtist(song.artistName);
                  setSearchText('');
                  setSearchResults([]);
                }}
              >
                <Text style={styles.emptyTitle}>
                  {song.trackName}
                </Text>

                <Text style={styles.emptyText}>
                  {song.artistName}
                </Text>
              </Pressable>
            ))}


            <Text style={styles.inputLabel}>Song title</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter the song title"
              placeholderTextColor="#9992AA"
              value={songTitle}
              onChangeText={setSongTitle}
            />

            <Text style={styles.inputLabel}>Artist</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter the artist name"
              placeholderTextColor="#9992AA"
              value={artist}
              onChangeText={setArtist}
            />

          <Text style={styles.inputLabel}>Personal note</Text>

          <TextInput
            style={styles.noteInput}
            placeholder="Write a memory or thought about this song..."
            placeholderTextColor="#9992AA"
            value={personalNote}
            onChangeText={setPersonalNote}
            multiline={true}
          />

            <Pressable
              style={styles.addButton}
              onPress={saveSong}
            >
              <Text style={styles.addButtonText}>Save song</Text>
            </Pressable>

            <Pressable
              style={styles.cancelButton}
              onPress={() => setCurrentScreen('home')}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>

          </View>
        )}

        {/*creates the diary screen, which shows the saved songs and their details*/}
        {currentScreen === 'diary' && (
          <View style={styles.header}>
            <Text style={styles.logo}>MY MUSIC DIARY</Text>

            <Text style={styles.greeting}>My Diary</Text>

            <Text style={styles.subtitle}>
              All your songs and memories in one place.
            </Text>

            {/*if there are no songs, it shows a message. If there are songs, it maps through them and displays their details*/}
            {songs.length === 0 ? (
              <Text style={styles.emptyText}>
                You haven't added any songs yet.
              </Text>
            ) : (
              songs.map((song, index) => (
                <View key={index} style={styles.songItem}>
                  <Text style={styles.emptyTitle}>{song.title}</Text>
                  <Text style={styles.emptyText}>{song.artist}</Text>
                  <Text style={styles.emptyText}>Mood: {song.mood}</Text>
                  <Text style={styles.emptyText}>Note: {song.note}</Text>
                  <Pressable
                    onPress={() => deleteSong(index)}
                  >
                    <Text style={styles.cancelButtonText}>🗑️ Delete song</Text>
                  </Pressable>
                </View>
              ))
            )}

            <Pressable
              style={styles.cancelButton}
              onPress={() => setCurrentScreen('home')}
            >
              <Text style={styles.cancelButtonText}>Back to Home</Text>
            </Pressable>
          </View>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171326',
  },

  header: {
    paddingTop: 65,
    paddingHorizontal: 25,
    paddingBottom: 25,
  },

  logo: {
    color: '#B9A3FF',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 3,
    marginBottom: 30,
  },

  greeting: {
    color: '#FFFFFF',
    fontSize: 29,
    fontWeight: 'bold',
  },

  subtitle: {
    color: '#B7B2C9',
    fontSize: 15,
    marginTop: 8,
  },

  highlight: {
    backgroundColor: '#49356E',
    marginHorizontal: 20,
    padding: 25,
    borderRadius: 22,
    marginBottom: 30,
  },

  highlightLabel: {
    color: '#D5C5FF',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 2,
  },

  highlightTitle: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: 'bold',
    marginTop: 15,
  },

  highlightText: {
    color: '#E0D9F0',
    fontSize: 14,
    lineHeight: 22,
    marginTop: 10,
  },

  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginBottom: 15,
  },

  moods: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 15,
    marginBottom: 30,
  },

  mood: {
    color: '#E6DCFF',
    backgroundColor: '#302844',
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 20,
    margin: 5,
    overflow: 'hidden',
  },

  emptyCard: {
    backgroundColor: '#252037',
    marginHorizontal: 20,
    padding: 25,
    borderRadius: 20,
    marginBottom: 30,
  },

  addButton: {
    backgroundColor: '#9B7BDF',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 25,
    marginTop: 25,
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  cancelButton: {
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 5,
  },

  cancelButtonText: {
    color: '#B9A3FF',
    fontSize: 15,
    fontWeight: 'bold',
  },

  songItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#49356E',
    paddingVertical: 15,
  },
  
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },

  emptyText: {
    color: '#B7B2C9',
    fontSize: 14,
    lineHeight: 22,
    marginTop: 10,
  },

    inputLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 10,
  },

  input: {
    backgroundColor: '#252037',
    color: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    fontSize: 15,
  },

  moodText: {
    color: '#E6DCFF',
    fontSize: 14,
    fontWeight: 'bold',
  },

  noteInput: {
    backgroundColor: '#252037',
    color: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    fontSize: 15,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  
});
