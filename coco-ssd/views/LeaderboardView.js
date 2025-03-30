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

  // Render each leaderboard item
  const renderItem = ({ item, index }) => {
    // Determine rank styling
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
    <LinearGradient
      colors={['#1a2980', '#004d40']}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
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
        
        {/* Footer */}
        <Footer navigation={navigation} currentScreen="Leaderboard" />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  customHeader: {
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  listContent: {
    padding: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 16,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  firstContainer: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.5)',
  },
  secondContainer: {
    backgroundColor: 'rgba(192, 192, 192, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(192, 192, 192, 0.5)',
  },
  thirdContainer: {
    backgroundColor: 'rgba(205, 127, 50, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(205, 127, 50, 0.5)',
  },
  rankText: {
    fontSize: 18,
    fontWeight: 'bold',
    width: 30,
    textAlign: 'center',
    color: 'white',
  },
  firstRank: {
    color: 'gold',
  },
  secondRank: {
    color: 'silver',
  },
  thirdRank: {
    color: '#CD7F32', // bronze
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  userInfo: {
    flex: 1,
  },
  nameText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
    color: 'white',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsLabel: {
    fontSize: 12,
    color: '#b0bec5',
    marginRight: 5,
  },
  pointsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00e676',
  },
});

export default LeaderboardView;
