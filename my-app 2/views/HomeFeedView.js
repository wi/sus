import React, { useState, useEffect } from 'react';  // Add useEffect import
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import Footer from '../components/Footer';

import { ip } from '../config';

export default function HomeFeedView({ navigation }) {
    const [posts, setPosts] = useState([
        {
          id: '1',
          user: {
            name: 'leaflord22',
            profilePic: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
          },
          image: 'https://media.istockphoto.com/id/1328234510/photo/young-man-in-a-walk-with-mobile-phone-is-heading-to-the-work-in-city-street-and-taking-a.jpg?s=612x612&w=0&k=20&c=0UP0pt14jLGmT11QgBJ_pGTORD41WN76OLIg497wW94=',
          caption: "Walked 20 minutes to class in Crocs. Feet = crying, Earth = thriving. #CarbonWho? #AllForThePoints",
          likes: 372,
          comments: 12,
          time: '15 minutes ago',
        },
        {
          id: '2',
          user: {
            name: 'eco.kween',
            profilePic: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
          },
          image: 'https://lionstale.org/wp-content/uploads/2019/09/hydroflask-photo-900x675.jpg',
          caption: "Hydrated all day without using plastic. My Hydro Flask and I are in a committed relationship 💧 #SippySip #TryAndBeatMyStreak",
          likes: 510,
          comments: 27,
          time: '1 hour ago',
        },
        {
          id: '3',
          user: {
            name: 'dormplantdad',
            profilePic: 'https://images.peopleimages.com/picture/202301/2597283-plastic-bag-park-and-black-man-cleaning-for-earth-day-eco-friendly-or-community-service-in-volunteering-portrait.-recycle-trash-or-garbage-of-happy-ngo-person-in-nature-or-forest-for-pollution-fit_400_400.jpg',
          },
          image: 'https://s.yimg.com/ny/api/res/1.2/QYC9.i54Rc6GqGEvg8jWEA--/YXBwaWQ9aGlnaGxhbmRlcjt3PTY0MDtoPTQyNw--/https://media-mbst-pub-ue1.s3.amazonaws.com/creatr-images/2019-08/bf599800-b9e5-11e9-befa-c64b98dcf531',
          caption: "Sorted recyclables like a pro today — bin accuracy: 100%. Someone give me my medal 🥇♻️ #RecycleKing #LeaderboardsNotReady",
          likes: 430,
          comments: 19,
          time: '2 hours ago',
        },
        {
          id: '4',
          user: {
            name: 'paperstrugs',
            profilePic: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg',
          },
          image: 'https://mike-lukas.com/wp-content/uploads/2021/06/Sitting-on-the-Bus-2.png',
          caption: "Took the bus today even though it smelled like ramen and regret. Saved 3kg of CO₂ tho. #ShuttleSquad #StillWinning",
          likes: 621,
          comments: 32,
          time: '5 hours ago',
        },
        {
          id: '5',
          user: {
            name: 'greenchick69',
            profilePic: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg',
          },
          image: 'https://www.shutterstock.com/image-photo/close-young-strong-sportswoman-woman-600nw-2021148989.jpg',
          caption: "Y’all out here sipping from plastic while I stack leaderboard points 💅 #StayHydrated #EcoAndElite",
          likes: 700,
          comments: 44,
          time: '1 day ago',
        },
      ]);
      

  useEffect(() => {
    fetchLatestPost();
  }, []);

  const fetchLatestPost = async () => {
    try {
      const response = await fetch(ip + '/latest_post');
      const data = await response.json();

      console.log(data);
      
      if (data && data.image_url) {
        // Create a new post object with the received data
        const newPost = {
          id: Date.now().toString(), // temporary ID
          user: {
            name: 'rumi',  // You might want to fetch user details separately
            profilePic: 'https://randomuser.me/api/portraits/men/1.jpg',
          },
          image: `${ip}/${data.image_url}`,
          caption: 'New sustainable post!',
          likes: 0,
          comments: 0,
          time: 'Just now'
        };

        // Add the new post to the beginning of the posts array
        setPosts(prevPosts => [newPost, ...prevPosts]);
      }
    } catch (error) {
      console.error('Error fetching latest post:', error);
    }
  };

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
        <Text style={styles.captionCombined}>
            <Text style={styles.captionUsername}>{item.user.name} </Text>
            <Text style={styles.caption}>{item.caption}</Text>
        </Text>
        </View>

        <Text style={styles.comments}>View all {item.comments} comments</Text>
        <Text style={styles.time}>{item.time}</Text>

    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="EkoLens" navigation={navigation} />

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
  captionCombined: {
    paddingHorizontal: 0,
    marginBottom: 4,
    flexWrap: 'wrap',
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