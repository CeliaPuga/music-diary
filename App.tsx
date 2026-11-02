
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScrollView showsVerticalScrollIndicator={false}>

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

        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Your story starts here</Text>
          <Text style={styles.emptyText}>
            You haven't added any songs yet.
            Start building your personal music diary!
          </Text>
        </View>

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
});
