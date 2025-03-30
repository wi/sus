import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, SafeAreaView, ActivityIndicator, Dimensions } from 'react-native';
import { CameraView as ExpoCameraView, useCameraPermissions, Camera } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/Header';
import Footer from '../components/Footer';

// TensorFlow and object detection imports
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";
import * as cocossd from "@tensorflow-models/coco-ssd";
import * as jpeg from "jpeg-js";
import * as ImageManipulator from "expo-image-manipulator";
import { fetch, decodeJpeg } from "@tensorflow/tfjs-react-native";

export default function CameraView({ navigation }) {
  // Original CameraView state
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  
  // Object detection state from App.js
  const [isTfReady, setIsTfReady] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);
  const [predictions, setPredictions] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Object detection refs from App.js
  const model = useRef(null);
  const cameraRef = useRef(null);
  const rafId = useRef(null);
  const lastProcessTime = useRef(0);

  // Initialize TensorFlow and load COCO-SSD model
  useEffect(() => {
    const initializeTfAsync = async () => {
      await tf.ready();
      setIsTfReady(true);
    };

    const initializeModelAsync = async () => {
      model.current = await cocossd.load();
      setIsModelReady(true);
    };

    initializeTfAsync();
    initializeModelAsync();

    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  // Convert image data to tensor
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

  // Object detection function
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
          quality: 0.5,
          flashMode: 'off',
        });

        // Resize image to improve performance
        const manipResult = await ImageManipulator.manipulateAsync(
          photo.uri,
          [{ resize: { width: 300 } }],
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
    if (isModelReady && permission?.granted) {
      rafId.current = requestAnimationFrame(detectObjectsAsync);
    }
    
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [isModelReady, permission]);

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  // Calculate the scaling factor for bounding boxes
  const borderColors = ["blue", "green", "orange", "pink", "purple"];
  const { width: screenWidth } = Dimensions.get("window");
  const cameraWidth = screenWidth;
  const scalingFactor = cameraWidth / 300;

  if (!permission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Requesting camera permissions...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#1a2980', '#004d40']}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <Header title="Object Detection" navigation={navigation} />
        
        {/* TensorFlow status indicators */}
        <View style={styles.statusContainer}>
          <View style={styles.statusItem}>
            <Text style={styles.statusText}>TensorFlow.js:</Text>
            {isTfReady ? (
              <Text style={styles.statusText}>✅</Text>
            ) : (
              <ActivityIndicator size="small" color="white" />
            )}
          </View>

          <View style={styles.statusItem}>
            <Text style={styles.statusText}>COCO-SSD model:</Text>
            {isModelReady ? (
              <Text style={styles.statusText}>✅</Text>
            ) : (
              <ActivityIndicator size="small" color="white" />
            )}
          </View>
        </View>
        
        {/* Camera with object detection overlay */}
        <View style={styles.cameraContainer}>
          <ExpoCameraView 
            ref={cameraRef}
            style={styles.camera} 
            facing={facing}
          >
            {/* Object detection boxes overlay */}
            {isModelReady &&
              predictions &&
              predictions.map((p, index) => (
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
              ))}
              
            {/* Camera controls */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                <Text style={styles.text}>Flip Camera</Text>
              </TouchableOpacity>
            </View>
          </ExpoCameraView>
        </View>
        
        {/* Prediction results */}
        <View style={styles.predictionContainer}>
          {isModelReady && (
            <Text style={styles.predictionTitle}>
              {isProcessing ? "Processing..." : "Detected Objects:"}
            </Text>
          )}
          {isModelReady &&
            predictions &&
            predictions.map((p, index) => (
              <Text
                key={index}
                style={[styles.predictionText, { color: borderColors[index % 5] }]}
              >
                {p.class}: {Math.round(p.score * 100)}%
              </Text>
            ))}
        </View>
        
        {/* Footer */}
        <Footer navigation={navigation} currentScreen="Camera" />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    color: 'white',
    marginHorizontal: 5,
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
    marginHorizontal: 12,
    marginVertical: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  predictionContainer: {
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  predictionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  predictionText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 2,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    padding: 24,
  },
  permissionText: {
    color: '#2E7D32',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  permissionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
