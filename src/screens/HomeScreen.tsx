import { View, Text, Pressable, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useSongs } from '../context/SongsContext';
import ScreenFrame from '../components/ScreenFrame';
import { styles } from '../styles/styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const { songs } = useSongs();

  // The most recently added song, or undefined if the diary is empty.
  const latestSong = songs[songs.length - 1];

  return (
    <ScreenFrame>
      <View style={styles.homeHeader}>
        <Text style={styles.eyebrow}>A LITTLE PLACE FOR YOUR SONGS</Text>
        <Text style={styles.mainTitle}>my music diary</Text>
        <Text style={styles.subtitle}>your life, your memories, your music ♡</Text>
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
        {latestSong?.artworkUrl ? (
          <Image source={{ uri: latestSong.artworkUrl }} style={styles.albumArtwork} />
        ) : (
          <View style={styles.albumPlaceholder}>
            <Text style={styles.albumHeart}>♥</Text>
          </View>
        )}
        <View style={styles.nowPlayingText}>
          <Text style={styles.nowPlayingLabel}>NOW PLAYING IN YOUR HEART...</Text>
          <Text style={styles.nowPlayingTitle}>
            {latestSong ? latestSong.title : 'your memories'}
          </Text>
          <Text style={styles.nowPlayingArtist}>
            {latestSong ? latestSong.artist : 'one song at a time'}
          </Text>
        </View>
      </View>

      <View style={styles.homeButtons}>
        <Pressable
          style={styles.primaryButton}
          onPress={() => navigation.navigate('AddSong')}
        >
          <Text style={styles.primaryButtonText}>＋  ADD A SONG</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Diary')}
        >
          <Text style={styles.secondaryButtonText}>♡  OPEN MY DIARY  ♡</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.secondaryButtonText}>⏰  DAILY REMINDER</Text>
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
          songs.slice(-3).reverse().map((song) => (
              <View key={song.id} style={styles.recentSong}>
              <Text style={styles.recentSongTitle}>{song.title}</Text>
              <Text style={styles.recentSongArtist}>{song.artist}</Text>
            </View>
          ))
        )}
      </View>
    </ScreenFrame>
  );
}