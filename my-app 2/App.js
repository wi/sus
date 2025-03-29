import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeView from './views/HomeView';
import CameraView from './views/CameraView';
import ProfileView from './views/ProfileView';

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
          name="Camera" 
          component={CameraView} 
          options={{ title: 'Camera' }}
        />
        <Stack.Screen 
          name="Profile" 
          component={ProfileView} 
          options={{ title: 'Profile' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
