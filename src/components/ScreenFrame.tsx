import { ReactNode } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { styles } from '../styles/styles';

type Props = {
  children: ReactNode;
};

// Retro window frame shared by every screen. The screen's content goes inside.
export default function ScreenFrame({ children }: Props) {
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

          {children}

          <View style={styles.windowBottom}>
            <Text style={styles.bottomHearts}>♡  ✧  made with love  ✧  ♡</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}