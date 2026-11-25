import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SongsProvider } from './src/context/SongsContext';
import { RootStackParamList } from './src/navigation/types';
import HomeScreen from './src/screens/HomeScreen';
import AddSongScreen from './src/screens/AddSongScreen';
import DiaryScreen from './src/screens/DiaryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { configureNotifications } from './src/services/notifications';

const Stack = createNativeStackNavigator<RootStackParamList>();
// Must run once, before any notification arrives.
configureNotifications();


export default function App() {
  return (
    <SongsProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="AddSong" component={AddSongScreen} />
          <Stack.Screen name="Diary" component={DiaryScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />          
        </Stack.Navigator>
      </NavigationContainer>
    </SongsProvider>
  );
}