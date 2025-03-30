import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ProgressBar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Icons library (make sure it's installed)

export default function ProfileView({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Profile" navigation={navigation} />
      <View style={styles.content}>

        {/* User Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>Rumi Khamidov</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>rumi.Khamidov@gmail.com</Text>
        </View>

        {/* Sustainability Impact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Sustainability Impact</Text>

          {/* Stat Cards */}
          <View style={styles.cardRow}>
            <View style={styles.statCard}>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons name="leaf" size={24} color="#2E7D32" />
              </View>
              <Text style={styles.cardLabel}>CO₂ Saved</Text>
              <Text style={styles.cardValue}>18.4 kg</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons name="water" size={24} color="#0288D1" />
              </View>
              <Text style={styles.cardLabel}>Water Saved</Text>
              <Text style={styles.cardValue}>124.5 gal</Text>
            </View>
          </View>

          <View style={styles.cardRow}>
            <View style={styles.statCard}>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons name="flag-checkered" size={24} color="#FF8F00" />
              </View>
              <Text style={styles.cardLabel}>Challenges</Text>
              <Text style={styles.cardValue}>7</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons name="target" size={24} color="#C62828" />
              </View>
              <Text style={styles.cardLabel}>2030 Impact</Text>
              <Text style={styles.cardValue}>~0.003%</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <Text style={styles.progressTitle}>Goal Completion</Text>
          <View style={styles.progressBarContainer}>
            <ProgressBar progress={0.45} color="#66BB6A" style={styles.progressBar} />
          </View>
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
  section: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 18,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statCard: {
    flex: 0.48,
    backgroundColor: '#F1F8E9',
    borderRadius: 14,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 1,
  },
  iconCircle: {
    backgroundColor: '#ffffff',
    padding: 8,
    borderRadius: 50,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cardLabel: {
    fontSize: 14,
    color: '#4CAF50',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
  },
  progressTitle: {
    marginTop: 10,
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
    marginBottom: 6,
  },
  progressBarContainer: {
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: 10,
    borderRadius: 10,
  },
});
