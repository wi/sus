import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function HomeFeedView({ navigation }) {
  const [posts, setPosts] = useState([
    {
      id: '1',
      user: {
        name: 'sustainableliving',
        profilePic: 'https://randomuser.me/api/portraits/women/43.jpg',
      },
      image: 'https://images.unsplash.com/photo-1501084817091-a4f3d1d19e07',
      caption: 'Connecting with nature is essential for sustainable living 🌿 #NatureLovers #Sustainability',
      likes: 245,
      comments: 18,
      time: '2 hours ago',
    },
    {
      id: '2',
      user: {
        name: 'eco_warrior',
        profilePic: 'https://randomuser.me/api/portraits/men/32.jpg',
      },
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09',
      caption: 'Home-grown organic vegetables - zero carbon footprint and maximum nutrition! #OrganicGardening #SustainableLiving',
      likes: 578,
      comments: 42,
      time: '5 hours ago',
    },
    {
      id: '3',
      user: {
        name: 'green_planet',
        profilePic: 'https://randomuser.me/api/portraits/women/22.jpg',
      },
      image: 'https://images.unsplash.com/photo-1532408840957-031d8034aeef',
      caption: 'Reusable containers are a simple way to reduce waste. Start small, impact big! 🌎 #ZeroWaste #EcoFriendly',
      likes: 892,
      comments: 67,
      time: '1 day ago',
    },
    {
      id: '4',
      user: {
        name: 'earth_conscious',
        profilePic: 'https://randomuser.me/api/portraits/men/45.jpg',
      },
      image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
      caption: 'Morning hike through the misty mountains. Remember to respect nature and leave no trace. #WildernessEthics #NatureLover',
      likes: 1203,
      comments: 95,
      time: '1 day ago',
    },
    {
      id: '5',
      user: {
        name: 'sustainable_style',
        profilePic: 'https://randomuser.me/api/portraits/women/65.jpg',
      },
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba',
      caption: 'Sustainable fashion doesn\'t mean sacrificing style. This outfit is made from recycled materials! #SustainableFashion #EcoStyle',
      likes: 756,
      comments: 38,
      time: '2 days ago',
    }
  ]);

  const renderPost = ({ item }) => (
    <View style={styles.post}>
      <View style={styles.postHeader}>
        <Image source={{ uri: item.user.profilePic }} style={styles.profilePic} />
        <Text style={styles.username}>{item.user.name}</Text>
        <Ionicons name="ellipsis-horizontal" size={20} color="#424242" />
      </View>

      <Image source={{ uri: item.image }} style={styles.postImage} />

      <View style={styles.postActions}>
        <View style={styles.leftActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="heart-outline" size={28} color="#2E7D32" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={24} color="#2E7D32" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="paper-plane-outline" size={24} color="#2E7D32" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Ionicons name="bookmark-outline" size={24} color="#2E7D32" />
        </TouchableOpacity>
      </View>

      <Text style={styles.likes}>{item.likes} likes</Text>
      <View style={styles.captionContainer}>
        <Text style={styles.captionUsername}>{item.user.name}</Text>
        <Text style={styles.caption}>{item.caption}</Text>
      </View>
      <Text style={styles.comments}>View all {item.comments} comments</Text>
      <Text style={styles.time}>{item.time}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="EcoGram" navigation={navigation} />

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.feedContent}
        ListFooterComponent={
          <View style={styles.actionContainer}>
            <TouchableOpacity 
              style={styles.button}
              onPress={() => navigation.navigate('Camera')}
            >
              <Text style={styles.buttonText}>Scan with AR</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.buttonSecondary}
              onPress={() => navigation.navigate('Leaderboard')}
            >
              <Text style={styles.buttonTextSecondary}>View Leaderboard</Text>
            </TouchableOpacity>
          </View>
        }
      />

      <Footer navigation={navigation} currentScreen="Feed" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  feedContent: {
    padding: 12,
  },
  post: {
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  profilePic: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  username: {
    flex: 1,
    marginLeft: 10,
    fontWeight: '600',
    fontSize: 15,
    color: '#2E7D32',
  },
  postImage: {
    width: '100%',
    height: 360,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  leftActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginRight: 15,
  },
  likes: {
    fontWeight: '600',
    paddingHorizontal: 12,
    marginBottom: 5,
    color: '#212121',
  },
  captionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  captionUsername: {
    fontWeight: '600',
    marginRight: 5,
    color: '#2E7D32',
  },
  caption: {
    flex: 1,
    color: '#424242',
  },
  comments: {
    color: '#616161',
    paddingHorizontal: 12,
    marginBottom: 4,
    fontSize: 13,
  },
  time: {
    color: '#9e9e9e',
    fontSize: 12,
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  actionContainer: {
    paddingTop: 10,
    paddingHorizontal: 12,
    paddingBottom: 30,
  },
  button: {
    backgroundColor: '#2E7D32',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    width: '100%',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonSecondary: {
    backgroundColor: '#C5E1A5',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    width: '100%',
  },
  buttonTextSecondary: {
    color: '#2E7D32',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});