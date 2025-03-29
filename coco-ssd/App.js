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
  const lastProcessTime = useRef(0);

  useEffect(() => {
    const initializeTfAsync = async () => {
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

  const imageToTensor = (rawImageData) => {
    const TO_UINT8ARRAY = true;
    const { width, height, data } = jpeg.decode(rawImageData, { useTArray: TO_UINT8ARRAY });
    
    // Drop the alpha channel info and normalize
    const buffer = new Uint8Array(width * height * 3);
    let offset = 0;
    for (let i = 0; i < buffer.length; i += 3) {
      buffer[i] = data[offset];
      buffer[i + 1] = data[offset + 1];
      buffer[i + 2] = data[offset + 2];
      offset += 4;
    }
    
    return tf.tensor3d(buffer, [height, width, 3]);
  };

  const detectObjectsAsync = async () => {
    if (cameraRef.current && isModelReady && !isProcessing) {
      try {
        // Throttle to no more than 2 frames per second for better performance
        const now = Date.now();
        if (now - lastProcessTime.current < 500) {
          rafId.current = requestAnimationFrame(detectObjectsAsync);
          return;
        }
        
        lastProcessTime.current = now;
        setIsProcessing(true);
        
        const photo = await cameraRef.current.takePictureAsync({
          skipProcessing: true,
          quality: 0.5, // Lower quality for faster processing
          flashMode: 'off', // Disable flash
        });

        // Resize image to improve performance
        const manipResult = await ImageManipulator.manipulateAsync(
          photo.uri,
          [{ resize: { width: 300 } }], // Smaller resize for better performance
          { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
        );

        const response = await fetch(manipResult.uri, {}, { isBinary: true });
        const rawImageData = await response.arrayBuffer();
        
        const imageTensor = imageToTensor(rawImageData);
        
        // Use tf.engine().startScope() to manage memory better
        tf.engine().startScope();
        const newPredictions = await model.current.detect(imageTensor);
        
        setPredictions(newPredictions);
        
        imageTensor.dispose();
        tf.engine().endScope();
        
        setIsProcessing(false);
        
        // Schedule the next frame with a small delay
        setTimeout(() => {
          rafId.current = requestAnimationFrame(detectObjectsAsync);
        }, 100);
        
      } catch (error) {
        console.log("Detection error: ", error);
        setIsProcessing(false);
        // Try again after a longer delay on error
        setTimeout(() => {
          rafId.current = requestAnimationFrame(detectObjectsAsync);
        }, 1000);
      }
    } else if (isModelReady && !isProcessing) {
      rafId.current = requestAnimationFrame(detectObjectsAsync);
    }
  };

  // Start detection when the model and camera are ready
  useEffect(() => {
    if (isModelReady && hasPermission) {
      rafId.current = requestAnimationFrame(detectObjectsAsync);
    }
    
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [isModelReady, hasPermission]);

  // Calculate the scaling factor based on resized image width
  const borderColors = ["blue", "green", "orange", "pink", "purple"];
  const { width: screenWidth } = Dimensions.get("window");
  const cameraContainerWidth = 300;
  const cameraWidth = 280;
  
  // Adjust scaling factor to match the lower resolution images
  const scalingFactor = cameraWidth / 300;

  if (hasPermission === null) {
    return <View style={styles.container}><Text>Requesting camera permission...</Text></View>;
  }
  if (hasPermission === false) {
    return <View style={styles.container}><Text>No access to camera</Text></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.headerText}>COCO-SSD Live Detection</Text>

        <View style={styles.loadingContainer}>
          <View style={styles.loadingTfContainer}>
            <Text style={styles.text}>TensorFlow.js ready?</Text>
            {isTfReady ? (
              <Text style={styles.text}>✅</Text>
            ) : (
              <ActivityIndicator size="small" />
            )}
          </View>

          <View style={styles.loadingModelContainer}>
            <Text style={styles.text}>COCO-SSD model ready? </Text>
            {isModelReady ? (
              <Text style={styles.text}>✅</Text>
            ) : (
              <ActivityIndicator size="small" />
            )}
          </View>
        </View>
        
        <View style={styles.cameraWrapper}>
          <View style={{ position: "relative", width: cameraWidth, height: cameraWidth }}>
            <CameraView
              ref={cameraRef}
              style={{ width: cameraWidth, height: cameraWidth }}
              type={"back"}
              flashMode={"off"}
              onMountError={(error) => console.log("Camera mount error", error)}
            />
            
            {isModelReady &&
              predictions &&
              predictions.map((p, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      zIndex: 1,
                      elevation: 1,
                      left: p.bbox[0] * scalingFactor,
                      top: p.bbox[1] * scalingFactor,
                      width: p.bbox[2] * scalingFactor,
                      height: p.bbox[3] * scalingFactor,
                      borderWidth: 2,
                      borderColor: borderColors[index % 5],
                      backgroundColor: "transparent",
                      position: "absolute",
                    }}
                  />
                );
              })}
          </View>
        </View>
        
        <View style={styles.predictionWrapper}>
          {isModelReady && (
            <Text style={styles.text}>
              Predictions: {isProcessing ? "Processing..." : ""}
            </Text>
          )}
          {isModelReady &&
            predictions &&
            predictions.map((p, index) => {
              return (
                <Text
                  key={index}
                  style={{ ...styles.text, color: borderColors[index % 5] }}
                >
                  {p.class}: {Math.round(p.score * 100)}%
                </Text>
              );
            })}
        </View>
      </View>
    </View>
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
