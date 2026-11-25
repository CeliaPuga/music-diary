import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SongsProvider } from './src/context/SongsContext';
import { RootStackParamList } from './src/navigation/types';
import HomeScreen from './src/screens/HomeScreen';
import AddSongScreen from './src/screens/AddSongScreen';
import DiaryScreen from './src/screens/DiaryScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

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
        </Stack.Navigator>
      </NavigationContainer>
    </SongsProvider>
  );
}