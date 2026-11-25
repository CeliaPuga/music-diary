import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Song } from '../types';
import * as storage from '../services/storage';

// Data needed to create a song. The id and date are added automatically.
export type NewSong = Omit<Song, 'id' | 'createdAt'>;

type SongsContextValue = {
  songs: Song[];
  addSong: (data: NewSong) => Promise<boolean>;
  deleteSong: (id: string) => Promise<void>;
  updateSong: (id: string, data: NewSong) => Promise<boolean>;  
};

const SongsContext = createContext<SongsContextValue | undefined>(undefined);

// Holds the list of songs and shares it with every screen.
export function SongsProvider({ children }: { children: ReactNode }) {
  const [songs, setSongs] = useState<Song[]>([]);

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

  // Add a song and save the new list. Returns true if it was saved.
  const addSong = async (data: NewSong) => {
    const newSong: Song = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updatedSongs = [...songs, newSong];

    try {
      await storage.saveSongs(updatedSongs);
      setSongs(updatedSongs);
      return true;
    } catch (error) {
      Alert.alert('Error', 'Could not save your song.');
      return false;
    }
  };

  // Replace the details of an existing song. Its id and date stay the same.
  const updateSong = async (id: string, data: NewSong) => {
    const updatedSongs = songs.map((song) =>
      song.id === id ? { ...song, ...data } : song
    );

    try {
      await storage.saveSongs(updatedSongs);
      setSongs(updatedSongs);
      return true;
    } catch (error) {
      Alert.alert('Error', 'Could not update your song.');
      return false;
    }
  };

  // Remove a song by id and save the new list.
  const deleteSong = async (id: string) => {
    const updatedSongs = songs.filter((song) => song.id !== id);

    try {
      await storage.saveSongs(updatedSongs);
      setSongs(updatedSongs);
    } catch (error) {
      Alert.alert('Error', 'Could not delete the song.');
    }
  };

  return (
    <SongsContext.Provider value={{ songs, addSong, deleteSong, updateSong }}>
      {children}
    </SongsContext.Provider>
  );
}

// Custom hook so screens can write: const { songs } = useSongs();
export function useSongs() {
  const context = useContext(SongsContext);
  if (!context) {
    throw new Error('useSongs must be used inside SongsProvider');
  }
  return context;
}