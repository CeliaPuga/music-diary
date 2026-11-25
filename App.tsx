import { useState, useEffect } from 'react';
import { Text, View, Pressable, TextInput, Alert, } from 'react-native';
import { styles, placeholderColor } from './src/styles/styles';
import { Song, SearchResult } from './src/types';
import SongCard from './src/components/SongCard';
import ScreenFrame from './src/components/ScreenFrame';
import * as storage from './src/services/storage';
import * as itunes from './src/services/itunes';
// useState: nos permitirá guardar información temporalmente mientras utilizamos la aplicación. Por ejemplo, recordar qué pantalla estamos viendo.
// Pressable: nos permitirá crear botones que el usuario pueda pulsar.
// TextInput: nos permitirá escribir texto, como el título de una canción o el nombre de un artista.


export default function App() {
  //save the name of the screen we're using and set for changing it
  //use for opening it at first instance
  const [currentScreen, setCurrentScreen] = useState('home');
  const [songTitle, setSongTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [songs, setSongs] = useState<Song[]>([]);
  //guarda el texto que escribes para buscar una canción.
  //guarda las canciones que nos devuelve iTunes.
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedMood, setSelectedMood] = useState('');
  const [personalNote, setPersonalNote] = useState('');

  // Load the songs saved on the device when the app opens.
  useEffect(() => {
    const init = async () => {
      try {
        setSongs(await storage.loadSongs());
      } catch (error) {
        Alert.alert('Error', 'Could not load your saved songs.');
      }
    };
    init();
  }, []);

  // Save a new song and keep it in the device storage.
  const saveSong = async () => {
    if (songTitle.trim() === '' || artist.trim() === '') {
      Alert.alert(
        'Missing information',
        'Please choose a song or enter both its title and artist.'
      );
      return;
    }

    const newSong: Song = {
      id: Date.now().toString(),
      title: songTitle.trim(),
      artist: artist.trim(),
      mood: selectedMood,
      note: personalNote.trim(),
      createdAt: new Date().toISOString(),
    };

    // Update the songs state and save to AsyncStorage
    const updatedSongs = [...songs, newSong];

    try {
      await storage.saveSongs(updatedSongs);
      setSongs(updatedSongs);
    } catch (error) {
      Alert.alert('Error', 'Could not save your song.');
      return;
    }

    setSongTitle('');
    setArtist('');
    setSelectedMood('');
    setPersonalNote('');
    setSearchText('');
    setSearchResults([]);
    setCurrentScreen('home');
  };

  // Ask for confirmation before deleting a song.
  const deleteSong = (id: string) => {
    Alert.alert(
      'Delete song',
      'Are you sure you want to remove this song from your diary?',
      [
        { text: 'Keep it', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedSongs = songs.filter((song) => song.id !== id);
            try {
              await storage.saveSongs(updatedSongs);
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
  // Search the iTunes catalogue for real songs.
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

  const chooseSong = (song: SearchResult) => {
    setSongTitle(song.trackName);
    setArtist(song.artistName);
    setSearchText('');
    setSearchResults([]);
  };


  return (
    <ScreenFrame>
      {currentScreen === 'home' && (
        <>
          <View style={styles.homeHeader}>
            <Text style={styles.eyebrow}>A LITTLE PLACE FOR YOUR SONGS</Text>
            <Text style={styles.mainTitle}>my music diary</Text>
            <Text style={styles.subtitle}>
              your life, your memories, your music ♡
            </Text>
          </View>

          <View style={styles.sceneCard}>
            <View style={styles.sceneWindow}>
              <View style={styles.sceneCurtainLeft} />
              <View style={styles.sceneCurtainRight} />
              <Text style={styles.moon}>☾</Text>
              <Text style={styles.stars}>✦   ·   ✧     ·   ✦</Text>
              <Text style={styles.sceneCaption}>tonight's soundtrack</Text>
            </View>

            <View style={styles.turntable}>
              <View style={styles.turntableTop}>
                <View style={styles.vinyl}>
                  <View style={styles.vinylRing}>
                    <View style={styles.vinylCentre}>
                      <View style={styles.vinylDot} />
                    </View>
                  </View>
                </View>
                <View style={styles.toneArm}>
                  <View style={styles.toneArmHead} />
                </View>
              </View>
              <View style={styles.turntableFront}>
                <Text style={styles.turntableBrand}>♡  C U P I D  ♡</Text>
                <View style={styles.turntableLight} />
              </View>
            </View>
            <Text style={styles.sceneHearts}>♡       ✿       ♡</Text>
          </View>

          <View style={styles.nowPlayingCard}>
            <View style={styles.albumPlaceholder}>
              <Text style={styles.albumHeart}>♥</Text>
            </View>
            <View style={styles.nowPlayingText}>
              <Text style={styles.nowPlayingLabel}>NOW PLAYING IN YOUR HEART...</Text>
              <Text style={styles.nowPlayingTitle}>your memories</Text>
              <Text style={styles.nowPlayingArtist}>one song at a time</Text>
            </View>
          </View>

          <View style={styles.homeButtons}>
            <Pressable //creates a button
              style={styles.primaryButton}
              onPress={() => setCurrentScreen('add')}
            >
              <Text style={styles.primaryButtonText}>＋  ADD A SONG</Text>
            </Pressable>

            <Pressable
              style={styles.secondaryButton}
              onPress={() => setCurrentScreen('diary')}
            >
              <Text style={styles.secondaryButtonText}>♡  OPEN MY DIARY  ♡</Text>
            </Pressable>
          </View>

          <View style={styles.homeFooterCard}>
            <Text style={styles.footerHeading}>YOUR LITTLE COLLECTION</Text>
            <Text style={styles.songCount}>
              {songs.length} {songs.length === 1 ? 'song' : 'songs'} saved
            </Text>
            {songs.length === 0 ? (
              <Text style={styles.emptyMessage}>
                Your story starts here. Save the songs that feel like you.
              </Text>
            ) : (
              songs.slice(0, 3).map((song) => (
                <View key={song.id} style={styles.recentSong}>
                  <Text style={styles.recentSongTitle}>{song.title}</Text>
                  <Text style={styles.recentSongArtist}>{song.artist}</Text>
                </View>
              ))
            )}
          </View>
        </>
      )}

      {/* if is add, it shows the new screen */}
      {currentScreen === 'add' && (
        <View style={styles.screenContent}>
          <Text style={styles.eyebrow}>A NEW MEMORY ♡</Text>
          <Text style={styles.screenTitle}>add a song</Text>
          <Text style={styles.subtitle}>
            choose a song and keep the feeling.
          </Text>

          <View style={styles.formCard}>
            <Text style={styles.sectionLabel}>01 / FIND YOUR SONG</Text>
            <TextInput
              style={styles.input}
              placeholder="Search song or artist..."
              placeholderTextColor="#A77C86"
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
                <Text style={styles.searchResultTitle}>{song.trackName}</Text>
                <Text style={styles.searchResultArtist}>{song.artistName}</Text>
                <Text style={styles.searchResultChoose}>TAP TO CHOOSE  ♡</Text>
              </Pressable>
            ))}

            <View style={styles.formDivider}>
              <Text style={styles.formDividerText}>✧  YOUR SELECTED SONG  ✧</Text>
            </View>

            <Text style={styles.sectionLabel}>SONG TITLE</Text>
            <TextInput
              style={styles.input}
              placeholder="Song title"
              placeholderTextColor="#A77C86"
              value={songTitle}
              onChangeText={setSongTitle}
            />

            <Text style={styles.sectionLabel}>ARTIST</Text>
            <TextInput
              style={styles.input}
              placeholder="Artist name"
              placeholderTextColor="#A77C86"
              value={artist}
              onChangeText={setArtist}
            />

            <Text style={styles.sectionLabel}>02 / HOW DOES IT FEEL?</Text>
            <View style={styles.moodGrid}>
              {[
                { name: 'Happy', symbol: '☀' },
                { name: 'Sad', symbol: '☂' },
                { name: 'Relaxed', symbol: '☾' },
                { name: 'Energetic', symbol: '✧' },
              ].map((mood) => (
                <Pressable
                  key={mood.name}
                  style={[
                    styles.moodButton,
                    selectedMood === mood.name && styles.moodButtonSelected,
                  ]}
                  onPress={() => setSelectedMood(mood.name)}
                >
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
              placeholderTextColor="#A77C86"
              value={personalNote}
              onChangeText={setPersonalNote}
              multiline={true}
            />
          </View>

          <Pressable style={styles.primaryButton} onPress={saveSong}>
            <Text style={styles.primaryButtonText}>♡  SAVE TO MY DIARY  ♡</Text>
          </Pressable>

          <Pressable
            style={styles.textButton}
            onPress={() => setCurrentScreen('home')}
          >
            <Text style={styles.textButtonText}>← BACK HOME</Text>
          </Pressable>
        </View>
      )}

      {/*creates the diary screen, which shows the saved songs and their details*/}
      {currentScreen === 'diary' && (
        <View style={styles.screenContent}>
          <Text style={styles.eyebrow}>ALL YOUR LITTLE MEMORIES</Text>
          <Text style={styles.screenTitle}>my diary</Text>
          <Text style={styles.subtitle}>
            every song has a story to tell ♡
          </Text>

          <View style={styles.diaryIntro}>
            <Text style={styles.diaryIntroTitle}>♡ THE SOUNDTRACK OF YOU ♡</Text>
            <Text style={styles.diaryIntroText}>
              {songs.length} {songs.length === 1 ? 'special song' : 'special songs'} in your collection
            </Text>
          </View>

          {/*if there are no songs, it shows a message. If there are songs, it maps through them and displays their details*/}
          {songs.length === 0 ? (
            <View style={styles.emptyDiary}>
              <Text style={styles.emptyDiaryIcon}>♫</Text>
              <Text style={styles.emptyDiaryTitle}>it's a little quiet here...</Text>
              <Text style={styles.emptyMessage}>
                Add your first song and start collecting memories.
              </Text>
              <Pressable
                style={styles.smallPinkButton}
                onPress={() => setCurrentScreen('add')}
              >
                <Text style={styles.smallPinkButtonText}>ADD YOUR FIRST SONG  ♡</Text>
              </Pressable>
            </View>
          ) : (
            songs.map((song) => (
              <SongCard key={song.id} song={song} onDelete={deleteSong} />
            ))
          )}

          <Pressable
            style={styles.primaryButton}
            onPress={() => setCurrentScreen('home')}
          >
            <Text style={styles.primaryButtonText}>←  BACK TO HOME  ♡</Text>
          </Pressable>
        </View>
      )}
    </ScreenFrame>
  );
}
