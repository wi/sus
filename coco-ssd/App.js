import React, { useEffect, useRef, useState } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
} from "react-native";

import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";

import * as cocossd from "@tensorflow-models/coco-ssd";

import * as jpeg from "jpeg-js";
import { CameraView, Camera } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";

import { fetch, decodeJpeg } from "@tensorflow/tfjs-react-native";

// Import views
import HomeView from './views/HomeView';
import FeedView from './views/FeedView';
import CameraView from './views/CameraView';
import ProfileView from './views/ProfileView';
import LeaderboardView from './views/LeaderboardView';
import DetectObjectsView from './views/DetectObjectsView';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeView} 
          options={{ title: 'Welcome' }}
        />
        <Stack.Screen 
          name="Feed" 
          component={FeedView} 
          options={{ title: 'For You' }}
        />
        <Stack.Screen 
          name="Camera" 
          component={CameraView} 
          options={{ title: 'Camera' }}
        />
        <Stack.Screen 
          name="Profile" 
          component={ProfileView} 
          options={{ title: 'Profile' }}
        />
        <Stack.Screen 
          name="Leaderboard" 
          component={LeaderboardView} 
          options={{ title: 'Leaderboard' }}
        />
        <Stack.Screen 
          name="ObjectDetection" 
          component={DetectObjectsView} 
          options={{ title: 'Object Detection' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    flex: 1,
  },
  headerText: {
    marginTop: 5,
    fontSize: 20,
    fontWeight: "bold",
  },
  loadingContainer: {
    marginTop: 5,
  },
  text: {
    fontSize: 16,
  },
  loadingTfContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  loadingModelContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  cameraWrapper: {
    width: 300,
    height: 300,
    borderColor: "#66c8cf",
    borderWidth: 3,
    borderStyle: "dashed",
    marginTop: 40,
    marginBottom: 10,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  predictionWrapper: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
  },
});
