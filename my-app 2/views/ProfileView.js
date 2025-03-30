import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ProfileView({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
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
      <Footer navigation={navigation} currentScreen="Profile" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    width: 80,
    color: '#2E7D32',
  },
  value: {
    fontSize: 16,
    color: '#212121',
    flex: 1,
  },
});
