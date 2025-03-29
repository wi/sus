import { StyleSheet, Text, TouchableOpacity, View, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function HomeView({ navigation }) {
  return (
    <LinearGradient
      colors={['#1a2980', '#004d40']}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <Header title="Welcome" navigation={navigation} />
        
        <View style={styles.content}>
          <Text style={styles.title}>Welcome to the App</Text>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('Feed')}
          >
            <Text style={styles.buttonText}>For You</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('Camera')}
          >
            <Text style={styles.buttonText}>Open Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.buttonText}>View Profile</Text>
          </TouchableOpacity>
        </View>
        
        {/* Footer */}
        <Footer navigation={navigation} currentScreen="Home" />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: 'white',
  },
  button: {
    backgroundColor: '#00e676',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'white',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});