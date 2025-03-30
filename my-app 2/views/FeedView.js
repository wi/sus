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
        name: 'leaflord22',
        profilePic: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg', // guy with glasses
      },
      image: 'https://images.unsplash.com/photo-1558981403-c5f9891d6edb', // bike on campus
      caption: "Biked to class today. Knees hurt, but the planet's happy 😤🌍 #LegDayEveryDay #EcoWheels",
      likes: 412,
      comments: 23,
      time: '25 minutes ago',
    },
    {
      id: '2',
      user: {
        name: 'eco.kween',
        profilePic: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg', // girl in yellow
      },
      image: 'https://images.unsplash.com/photo-1602524207890-bd4d5e4f7a63', // tote bag
      caption: "Brought my tote bag to Target and felt morally superior for 5 mins 💅♻️ #ToteLife #NoPlasticNovember",
      likes: 603,
      comments: 51,
      time: '2 hours ago',
    },
    {
      id: '3',
      user: {
        name: 'dormplantdad',
        profilePic: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg', // dude w/ beard
      },
      image: 'https://images.unsplash.com/photo-1571934811375-d0d0f6a4f6f8', // indoor garden
      caption: "Turned my dorm into a jungle. Oxygen levels at 300%. RA hasn’t noticed 🌿🌱 #PlantDad #O2Boost",
      likes: 729,
      comments: 39,
      time: '4 hours ago',
    },
    {
      id: '4',
      user: {
        name: 'paperstrugs',
        profilePic: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg', // student w/ glasses
      },
      image: 'https://images.unsplash.com/photo-1569078449082-c7b0f016a9d2', // paper straw in iced coffee
      caption: "Used a paper straw. It dissolved in 3 minutes. I persevered. Planet saved. 🥲 #PaperStrawPain",
      likes: 489,
      comments: 60,
      time: '6 hours ago',
    },
    {
      id: '5',
      user: {
        name: 'greenchick69',
        profilePic: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg', // fun girl pic
      },
      image: 'https://images.unsplash.com/photo-1610878180933-e01f6607b8ab', // thrift haul
      caption: "Thrift haul >> fast fashion. This whole outfit cost less than a venti iced oat milk latte 😌✨ #SustainableFitCheck",
      likes: 893,
      comments: 71,
      time: '1 day ago',
    },
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
