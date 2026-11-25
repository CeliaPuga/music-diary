import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import {StyleSheet, Text, View, ScrollView, Pressable, TextInput, Alert, } from 'react-native';
import { Song, SearchResult } from './src/types';
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

  const renderSongCard = (song: Song) => (
    <View key={song.id} style={styles.songCard}>
      <View style={styles.songCardTop}>
        <View style={styles.miniRecord}>
          <View style={styles.miniRecordCentre} />
        </View>
        <View style={styles.songDetails}>
          <Text style={styles.songTitle}>{song.title}</Text>
          <Text style={styles.songArtist}>by {song.artist}</Text>
        </View>
      </View>

      <View style={styles.songMeta}>
        <Text style={styles.songMetaText}>MOOD: {song.mood || 'NOT SET'}</Text>
      </View>

      {song.note !== '' && (
        <Text style={styles.songNote}>“{song.note}”</Text>
      )}

      <Pressable
        style={styles.deleteButton}
        onPress={() => deleteSong(song.id)}
      >
        <Text style={styles.deleteButtonText}>♥  REMOVE FROM DIARY</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.appWindow}>
          <View style={styles.windowTop}>
            <Text style={styles.windowTitle}>♡ cupid-player ♡</Text>
            <Text style={styles.windowControls}>✿  ▢  ×</Text>
          </View>

          <View style={styles.decorativeLine}>
            <Text style={styles.decorativeText}>♡  ✧  ♡  ✧  ♡  ✧  ♡</Text>
          </View>

          {/* if currentScreen is home, it shows homescreen */}
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
                songs.map((song) => renderSongCard(song))
              )}

              <Pressable
                style={styles.primaryButton}
                onPress={() => setCurrentScreen('home')}
              >
                <Text style={styles.primaryButtonText}>←  BACK TO HOME  ♡</Text>
              </Pressable>
            </View>
          )}

          <View style={styles.windowBottom}>
            <Text style={styles.bottomHearts}>♡  ✧  made with love  ✧  ♡</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E9B8C1',
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingVertical: 28,
    alignItems: 'center',
  },
  appWindow: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#FBE8E5',
    borderWidth: 4,
    borderColor: '#C8798C',
    borderRadius: 18,
    padding: 10,
    shadowColor: '#713C50',
    shadowOffset: { width: 5, height: 7 },
    shadowOpacity: 0.22,
    shadowRadius: 0,
    elevation: 8,
  },
  windowTop: {
    minHeight: 48,
    backgroundColor: '#F5C9CD',
    borderWidth: 2,
    borderColor: '#D995A3',
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  windowTitle: {
    color: '#713F50',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 1,
    fontFamily: 'monospace',
  },
  windowControls: {
    color: '#8E4F61',
    fontSize: 17,
    fontWeight: 'bold',
  },
  decorativeLine: {
    alignItems: 'center',
    paddingVertical: 9,
  },
  decorativeText: {
    color: '#C8798C',
    fontSize: 14,
    letterSpacing: 5,
  },
  homeHeader: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 18,
  },
  eyebrow: {
    color: '#A45D70',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 2,
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  mainTitle: {
    color: '#713F50',
    fontSize: 27,
    fontWeight: 'bold',
    marginTop: 9,
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  subtitle: {
    color: '#9A6572',
    fontSize: 11,
    marginTop: 7,
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  sceneCard: {
    backgroundColor: '#C8798C',
    borderWidth: 3,
    borderColor: '#A85D73',
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
  },
  sceneWindow: {
    height: 175,
    backgroundColor: '#39304D',
    borderWidth: 3,
    borderColor: '#F2C2C9',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sceneCurtainLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '19%',
    backgroundColor: '#854B65',
    borderRightWidth: 3,
    borderColor: '#B8758C',
  },
  sceneCurtainRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '19%',
    backgroundColor: '#854B65',
    borderLeftWidth: 3,
    borderColor: '#B8758C',
  },
  moon: {
    color: '#F6D68D',
    fontSize: 48,
    position: 'absolute',
    top: 12,
    right: 44,
  },
  stars: {
    color: '#F8DFA9',
    fontSize: 18,
    position: 'absolute',
    top: 27,
    left: 38,
    letterSpacing: 4,
  },
  sceneCaption: {
    color: '#F9DDE0',
    fontSize: 11,
    letterSpacing: 2,
    fontFamily: 'monospace',
    marginTop: 62,
  },
  turntable: {
    backgroundColor: '#F1C2C2',
    borderWidth: 3,
    borderColor: '#A95F74',
    borderRadius: 9,
    marginTop: -4,
    marginHorizontal: 22,
    padding: 9,
    shadowColor: '#60354B',
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 0,
    elevation: 4,
  },
  turntableTop: {
    height: 112,
    backgroundColor: '#E7AEB8',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vinyl: {
    width: 105,
    height: 105,
    borderRadius: 53,
    backgroundColor: '#211C2B',
    borderWidth: 4,
    borderColor: '#33283B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vinylRing: {
    width: 83,
    height: 83,
    borderRadius: 42,
    borderWidth: 2,
    borderColor: '#514052',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vinylCentre: {
    width: 31,
    height: 31,
    borderRadius: 16,
    backgroundColor: '#D9899B',
    borderWidth: 3,
    borderColor: '#F4C5C8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vinylDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#6D4051',
  },
  toneArm: {
    position: 'absolute',
    width: 5,
    height: 66,
    backgroundColor: '#F8E1D2',
    top: 9,
    right: 34,
    transform: [{ rotate: '34deg' }],
    borderWidth: 1,
    borderColor: '#9A6572',
  },
  toneArmHead: {
    position: 'absolute',
    bottom: -4,
    left: -4,
    width: 13,
    height: 13,
    backgroundColor: '#B95F79',
    borderRadius: 3,
  },
  turntableFront: {
    height: 28,
    marginTop: 6,
    backgroundColor: '#E7AAB6',
    borderTopWidth: 2,
    borderColor: '#C8798C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  turntableBrand: {
    color: '#81495D',
    fontSize: 9,
    letterSpacing: 2,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  turntableLight: {
    position: 'absolute',
    right: 12,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#A34D68',
  },
  sceneHearts: {
    textAlign: 'center',
    color: '#FFE8E5',
    fontSize: 15,
    letterSpacing: 12,
    marginTop: 7,
  },
  nowPlayingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5EF',
    borderWidth: 2,
    borderColor: '#E2A6B1',
    padding: 12,
    marginBottom: 14,
  },
  albumPlaceholder: {
    width: 54,
    height: 54,
    backgroundColor: '#A94F69',
    borderWidth: 3,
    borderColor: '#E8AEB8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  albumHeart: {
    color: '#F9D6D6',
    fontSize: 28,
  },
  nowPlayingText: {
    flex: 1,
    paddingLeft: 12,
  },
  nowPlayingLabel: {
    color: '#A45D70',
    fontSize: 8,
    letterSpacing: 1,
    fontFamily: 'monospace',
  },
  nowPlayingTitle: {
    color: '#633B4B',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
    fontFamily: 'monospace',
  },
  nowPlayingArtist: {
    color: '#A47780',
    fontSize: 10,
    marginTop: 3,
    fontFamily: 'monospace',
  },
  homeButtons: {
    gap: 9,
    marginBottom: 14,
  },
  primaryButton: {
    backgroundColor: '#C8798C',
    borderWidth: 2,
    borderColor: '#9E526B',
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#8D4A60',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 0,
    elevation: 3,
  },
  primaryButtonText: {
    color: '#FFF2ED',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
    fontFamily: 'monospace',
  },
  secondaryButton: {
    backgroundColor: '#F8D9D9',
    borderWidth: 2,
    borderColor: '#D995A3',
    paddingVertical: 13,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#884E62',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    fontFamily: 'monospace',
  },
  homeFooterCard: {
    backgroundColor: '#FFF5EF',
    borderWidth: 2,
    borderColor: '#E2A6B1',
    padding: 13,
    marginBottom: 8,
  },
  footerHeading: {
    color: '#A45D70',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1,
    fontFamily: 'monospace',
  },
  songCount: {
    color: '#704254',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 6,
    fontFamily: 'monospace',
  },
  emptyMessage: {
    color: '#A47780',
    fontSize: 11,
    lineHeight: 18,
    marginTop: 8,
    fontFamily: 'monospace',
  },
  recentSong: {
    borderTopWidth: 1,
    borderTopColor: '#EAC3C8',
    paddingTop: 8,
    marginTop: 8,
  },
  recentSongTitle: {
    color: '#704254',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  recentSongArtist: {
    color: '#A47780',
    fontSize: 10,
    marginTop: 3,
    fontFamily: 'monospace',
  },
  screenContent: {
    paddingHorizontal: 5,
    paddingTop: 9,
    paddingBottom: 14,
  },
  screenTitle: {
    color: '#713F50',
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
    fontFamily: 'monospace',
  },
  formCard: {
    backgroundColor: '#FFF5EF',
    borderWidth: 2,
    borderColor: '#E2A6B1',
    padding: 13,
    marginTop: 18,
  },
  sectionLabel: {
    color: '#A45D70',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginTop: 15,
    marginBottom: 8,
    fontFamily: 'monospace',
  },
  input: {
    backgroundColor: '#FCE7E3',
    borderWidth: 2,
    borderColor: '#E3AAB4',
    color: '#633B4B',
    paddingHorizontal: 11,
    paddingVertical: 11,
    fontSize: 12,
    fontFamily: 'monospace',
  },
  smallPinkButton: {
    backgroundColor: '#E9B8C1',
    borderWidth: 2,
    borderColor: '#C8798C',
    padding: 11,
    alignItems: 'center',
    marginTop: 9,
  },
  smallPinkButtonText: {
    color: '#713F50',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1,
    fontFamily: 'monospace',
  },
  searchResult: {
    backgroundColor: '#FCE7E3',
    borderWidth: 1,
    borderColor: '#D995A3',
    padding: 10,
    marginTop: 8,
  },
  searchResultTitle: {
    color: '#704254',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  searchResultArtist: {
    color: '#A47780',
    fontSize: 10,
    marginTop: 4,
    fontFamily: 'monospace',
  },
  searchResultChoose: {
    color: '#A45D70',
    fontSize: 8,
    marginTop: 7,
    letterSpacing: 1,
    fontFamily: 'monospace',
  },
  formDivider: {
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#EAC3C8',
    marginTop: 18,
    paddingTop: 14,
  },
  formDividerText: {
    color: '#B56E80',
    fontSize: 9,
    letterSpacing: 1,
    fontFamily: 'monospace',
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  moodButton: {
    width: '48%',
    backgroundColor: '#FCE7E3',
    borderWidth: 2,
    borderColor: '#E3AAB4',
    paddingVertical: 11,
    alignItems: 'center',
  },
  moodButtonSelected: {
    backgroundColor: '#C8798C',
    borderColor: '#9E526B',
  },
  moodButtonText: {
    color: '#884E62',
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  moodButtonTextSelected: {
    color: '#FFF5EF',
  },
  noteInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  textButton: {
    alignItems: 'center',
    padding: 14,
  },
  textButtonText: {
    color: '#A45D70',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    fontFamily: 'monospace',
  },
  diaryIntro: {
    backgroundColor: '#F5C9CD',
    borderWidth: 2,
    borderColor: '#D995A3',
    padding: 13,
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 12,
  },
  diaryIntroTitle: {
    color: '#884E62',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    fontFamily: 'monospace',
  },
  diaryIntroText: {
    color: '#9A6572',
    fontSize: 10,
    marginTop: 6,
    fontFamily: 'monospace',
  },
  emptyDiary: {
    backgroundColor: '#FFF5EF',
    borderWidth: 2,
    borderColor: '#E2A6B1',
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyDiaryIcon: {
    color: '#C8798C',
    fontSize: 38,
  },
  emptyDiaryTitle: {
    color: '#704254',
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 8,
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  songCard: {
    backgroundColor: '#FFF5EF',
    borderWidth: 2,
    borderColor: '#E2A6B1',
    padding: 12,
    marginBottom: 11,
  },
  songCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniRecord: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: '#28212F',
    borderWidth: 3,
    borderColor: '#574050',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniRecordCentre: {
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: '#D9899B',
    borderWidth: 2,
    borderColor: '#F7D8D7',
  },
  songDetails: {
    flex: 1,
    paddingLeft: 11,
  },
  songTitle: {
    color: '#704254',
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  songArtist: {
    color: '#A47780',
    fontSize: 10,
    marginTop: 4,
    fontFamily: 'monospace',
  },
  songMeta: {
    alignSelf: 'flex-start',
    backgroundColor: '#F5D5D7',
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginTop: 10,
  },
  songMetaText: {
    color: '#884E62',
    fontSize: 8,
    letterSpacing: 1,
    fontFamily: 'monospace',
  },
  songNote: {
    color: '#8F626D',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 10,
    fontStyle: 'italic',
  },
  deleteButton: {
    borderTopWidth: 1,
    borderColor: '#EAC3C8',
    marginTop: 10,
    paddingTop: 10,
    alignItems: 'flex-end',
  },
  deleteButtonText: {
    color: '#A45D70',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1,
    fontFamily: 'monospace',
  },
  windowBottom: {
    borderTopWidth: 2,
    borderColor: '#E2A6B1',
    paddingTop: 10,
    paddingBottom: 3,
    alignItems: 'center',
    marginTop: 8,
  },
  bottomHearts: {
    color: '#B56E80',
    fontSize: 9,
    letterSpacing: 1,
    fontFamily: 'monospace',
  },
});
