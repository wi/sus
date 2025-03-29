import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ProfileView({ navigation }) {
  return (
    <LinearGradient
      colors={['#1a2980', '#004d40']}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <Header title="Profile" navigation={navigation} />
        
        <View style={styles.content}>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>John Doe</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>john.doe@example.com</Text>
          </View>
        </View>
        
        {/* Footer */}
        <Footer navigation={navigation} currentScreen="Profile" />
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
    padding: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#3a506b',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    width: 100,
    color: 'white',
  },
  value: {
    fontSize: 16,
    flex: 1,
    color: '#e0e0e0',
  },
});