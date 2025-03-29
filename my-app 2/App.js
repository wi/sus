import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeView from './views/HomeView';
import CameraView from './views/CameraView';
import ProfileView from './views/ProfileView';
import FeedView from './views/FeedView';
import LeaderboardView from './views/LeaderboardView';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeView} 
          options={{ title: 'Welcome' }}
        />
        <Stack.Screen 
          name="Feed" 
          component={FeedView} 
          options={{ title: 'For You' }}
        />
        <Stack.Screen 
          name="Camera" 
          component={CameraView} 
          options={{ title: 'Camera' }}
        />
        <Stack.Screen 
          name="Profile" 
          component={ProfileView} 
          options={{ title: 'Profile' }}
        />
        <Stack.Screen 
          name="Leaderboard" 
          component={LeaderboardView} 
          options={{ title: 'Leaderboard' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
