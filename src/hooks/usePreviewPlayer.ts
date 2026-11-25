import { useEffect, useState } from 'react';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { Song } from '../types';
import { haptics } from '../services/haptics';

// Plays the 30-second iTunes preview of one song at a time.
export function usePreviewPlayer() {
  // One player for the whole screen. It starts empty (null)
  // and is released automatically when the screen closes.
  const player = useAudioPlayer(null);
  const status = useAudioPlayerStatus(player);

  // Id of the song that is playing now, or null if nothing is playing.
  const [playingId, setPlayingId] = useState<string | null>(null);

  // When the preview reaches the end, mark that nothing is playing.
  useEffect(() => {
    if (status.didJustFinish) {
      setPlayingId(null);
    }
  }, [status.didJustFinish]);

  // Start the song's preview, or stop it if it is already playing.
  const togglePreview = (song: Song) => {
    if (!song.previewUrl) return;
    haptics.tap();

    if (playingId === song.id) {
      player.pause();
      setPlayingId(null);
      return;
    }

    player.replace({ uri: song.previewUrl });
    player.play();
    setPlayingId(song.id);
  };

  return { playingId, togglePreview };
}