
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
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
  const [songs, setSongs] = useState<{ title: string; artist: string; mood: string }[]>([]);
  const [selectedMood, setSelectedMood] = useState('');

  const saveSong = () => {
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
};

  setSongs([...songs, newSong]);

  setSongTitle('');
  setArtist('');
  setCurrentScreen('home');
  setSelectedMood('');
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
  
});
