import React, { useEffect, useRef, useState } from "react";

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

export default function DetectObjectsScreen() {
  const [isTfReady, setIsTfReady] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);
  const [predictions, setPredictions] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const model = useRef(null);
  const cameraRef = useRef(null);
  const rafId = useRef(null);

  useEffect(() => {
    const initializeTfAsync = async () => {
      // Enable async non-max suppression before tf.ready() is called
      tf.env().set('WEBGL_USE_ASYNC_NON_MAX_SUPPRESSION', true);
      await tf.ready();
      setIsTfReady(true);
    };

    const initializeModelAsync = async () => {
      model.current = await cocossd.load(); // preparing COCO-SSD model
      setIsModelReady(true);
    };

    const getPermissionAsync = async () => {
      if (Platform.OS !== "web") {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === "granted");
        if (status !== "granted") {
          alert("Sorry, we need camera permissions to make this work!");
        }
      }
    };

    initializeTfAsync();
    initializeModelAsync();
    getPermissionAsync();

    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  const detectObjectsAsync = async () => {
    if (cameraRef.current && isModelReady && !isProcessing) {
      try {
        setIsProcessing(true);
        const photo = await cameraRef.current.takePictureAsync({
          skipProcessing: true,
        });
        console.log("Photo taken: ", photo.uri);
        // Resize image to avoid out of memory crashes
        const manipResult = await ImageManipulator.manipulateAsync(
          photo.uri,
          [{ resize: { width: 900 } }],
          { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
        );

        console.log("XD");

        const response = await fetch(manipResult.uri, {}, { isBinary: true });
        const rawImageData = await response.arrayBuffer();
        console.log("GOTS DINOSAURS")
        const imageTensor = imageToTensor(rawImageData);
        
        // Make sure async NonMaxSuppression is enabled for each detection
        tf.env().set('WEBGL_USE_ASYNC_NON_MAX_SUPPRESSION', true);
        const newPredictions = await model.current.detect(imageTensor);
        setPredictions(newPredictions);
        
        imageTensor.dispose();
        setIsProcessing(false);
        
        // Schedule the next frame
        rafId.current = requestAnimationFrame(detectObjectsAsync);
      } catch (error) {
        console.log("Exception Error: ", error);
        setIsProcessing(false);
        // Try again after a short delay
        setTimeout(() => {
          rafId.current = requestAnimationFrame(detectObjectsAsync);
        }, 1000);
      }
    } else if (isModelReady && !isProcessing) {
      // If we're not processing but model is ready, try again
      rafId.current = requestAnimationFrame(detectObjectsAsync);
    }
  };

  // ... existing code ...
} 