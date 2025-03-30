import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeFeedView from './views/HomeFeedView';
import CameraView from './views/CameraView';
import ProfileView from './views/ProfileView';
import LeaderboardView from './views/LeaderboardView';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen 
          name="Home" 
          component={HomeFeedView} 
          options={{ title: 'Welcome' }}
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