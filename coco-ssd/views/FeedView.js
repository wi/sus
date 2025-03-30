import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/Header';
import Footer from '../components/Footer';

const FeedView = ({ navigation }) => {
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
        <Ionicons name="ellipsis-horizontal" size={20} color="white" style={styles.moreOptions} />
      </View>
      
      <Image source={{ uri: item.image }} style={styles.postImage} />
      
      <View style={styles.postActions}>
        <View style={styles.leftActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="heart-outline" size={28} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="paper-plane-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Ionicons name="bookmark-outline" size={24} color="white" />
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
    <LinearGradient
      colors={['#1a2980', '#004d40']}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <Header title="EcoGram" navigation={navigation} />

        {/* Feed */}
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
        />

        {/* Footer */}
        <Footer navigation={navigation} currentScreen="Feed" />
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
  post: {
    marginBottom: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 10,
    margin: 8,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  profilePic: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  username: {
    flex: 1,
    marginLeft: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  moreOptions: {
    padding: 5,
  },
  postImage: {
    width: '100%',
    height: 375,
    borderRadius: 8,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  leftActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginRight: 15,
  },
  likes: {
    fontWeight: 'bold',
    paddingHorizontal: 10,
    marginBottom: 5,
    color: 'white',
  },
  captionContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  captionUsername: {
    fontWeight: 'bold',
    marginRight: 5,
    color: 'white',
  },
  caption: {
    flex: 1,
    color: '#e0e0e0',
  },
  comments: {
    color: '#b0bec5',
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  time: {
    color: '#b0bec5',
    fontSize: 12,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});

export default FeedView;
