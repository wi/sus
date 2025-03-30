import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/Header';
import Footer from '../components/Footer';

function getRandomInt() {
  return Math.floor(Math.random() * 10 + 1);
}

const LeaderboardView = ({ navigation }) => {
  // We start with an empty array
  const [leaderboardData, setLeaderboardData] = useState([]);

  // Fetch data from your Flask API on component mount
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // adjust to your ip address
        const response = await fetch(process.env.BACKEND_URL);
        const data = await response.json();

        console.log(data);

        // data should be an array of user objects: 
        //   [{ id, username, sustainability_score, email }, ...]
        // Map them to the structure your leaderboard expects
        const mappedData = data.map((user) => ({
          id: user.id,
          name: user.username,
          points: user.sustainability_score,
          // If you don't have an avatar URL in your DB,
          // you can provide a fallback or generate one
          avatar: user.avatar || 'https://randomuser.me/api/portraits/men/' + getRandomInt() + '.jpg',
        }));

        // If the backend isn't already returning them sorted,
        // sort them here in descending order by points
        //mappedData.sort((a, b) => b.points - a.points);

        setLeaderboardData(mappedData);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };

    fetchLeaderboard();
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