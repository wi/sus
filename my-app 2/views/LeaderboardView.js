import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/Header';
import Footer from '../components/Footer';

const LeaderboardView = ({ navigation }) => {
  // Sample data - replace with API calls in a real application
  const [leaderboardData, setLeaderboardData] = useState([
    { id: '1', name: 'John Doe', points: 950, avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { id: '2', name: 'Jane Smith', points: 875, avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
    { id: '3', name: 'Robert Johnson', points: 810, avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
    { id: '4', name: 'Emily Davis', points: 790, avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
    { id: '5', name: 'Michael Brown', points: 760, avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
    { id: '6', name: 'Sarah Wilson', points: 720, avatar: 'https://randomuser.me/api/portraits/women/3.jpg' },
    { id: '7', name: 'David Miller', points: 705, avatar: 'https://randomuser.me/api/portraits/men/4.jpg' },
    { id: '8', name: 'Jessica Taylor', points: 690, avatar: 'https://randomuser.me/api/portraits/women/4.jpg' },
  ]);

  // Sort data in descending order by points
  useEffect(() => {
    const sortedData = [...leaderboardData].sort((a, b) => b.points - a.points);
    setLeaderboardData(sortedData);
  }, []);

  const renderItem = ({ item, index }) => {
    let rankStyle = styles.rankText;
    let containerStyle = styles.itemContainer;

    if (index === 0) {
      rankStyle = [styles.rankText, styles.firstRank];
      containerStyle = [styles.itemContainer, styles.firstContainer];
    } else if (index === 1) {
      rankStyle = [styles.rankText, styles.secondRank];
      containerStyle = [styles.itemContainer, styles.secondContainer];
    } else if (index === 2) {
      rankStyle = [styles.rankText, styles.thirdRank];
      containerStyle = [styles.itemContainer, styles.thirdContainer];
    }

    return (
      <View style={containerStyle}>
        <Text style={rankStyle}>{index + 1}</Text>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.nameText}>{item.name}</Text>
          <View style={styles.pointsContainer}>
            <Text style={styles.pointsLabel}>Sustainability Points:</Text>
            <Text style={styles.pointsText}>{item.points}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Leaderboard" navigation={navigation} />

      <View style={styles.customHeader}>
        <Text style={styles.headerTitle}>Sustainability Leaderboard</Text>
        <Text style={styles.headerSubtitle}>Making a difference together</Text>
      </View>

      <FlatList
        data={leaderboardData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />

      <Footer navigation={navigation} currentScreen="Leaderboard" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  customHeader: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#757575',
  },
  listContent: {
    padding: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  firstContainer: {
    borderWidth: 1,
    borderColor: 'gold',
  },
  secondContainer: {
    borderWidth: 1,
    borderColor: 'silver',
  },
  thirdContainer: {
    borderWidth: 1,
    borderColor: '#CD7F32',
  },
  rankText: {
    fontSize: 18,
    fontWeight: 'bold',
    width: 30,
    textAlign: 'center',
    color: '#424242',
  },
  firstRank: {
    color: 'gold',
  },
  secondRank: {
    color: 'silver',
  },
  thirdRank: {
    color: '#CD7F32',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginHorizontal: 10,
  },
  userInfo: {
    flex: 1,
  },
  nameText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsLabel: {
    fontSize: 12,
    color: '#757575',
    marginRight: 4,
  },
  pointsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
});

export default LeaderboardView;