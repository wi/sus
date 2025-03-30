import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, SafeAreaView, ActivityIndicator, Dimensions, Image } from 'react-native';
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

// Helper function to check if two bounding boxes overlap
const doBoxesOverlap = (box1, box2) => {
  // box format is [x, y, width, height]
  const [x1, y1, w1, h1] = box1;
  const [x2, y2, w2, h2] = box2;
  
  // Calculate box corners
  const x1Right = x1 + w1;
  const y1Bottom = y1 + h1;
  const x2Right = x2 + w2;
  const y2Bottom = y2 + h2;
  
  // Check for overlap
  return !(x1Right < x2 || x2Right < x1 || y1Bottom < y2 || y2Bottom < y1);
};

// Helper function to adjust person bounding box to avoid bottle/cup
const adjustPersonBoundingBox = (personPrediction, itemPrediction) => {
  const personBox = personPrediction.bbox;
  const itemBox = itemPrediction.bbox;
  
  // Item box boundaries
  const itemLeft = itemBox[0];
  const itemTop = itemBox[1];
  const itemRight = itemBox[0] + itemBox[2];
  const itemBottom = itemBox[1] + itemBox[3];
  
  // Person box boundaries
  const personLeft = personBox[0];
  const personTop = personBox[1];
  const personRight = personBox[0] + personBox[2];
  const personBottom = personBox[1] + personBox[3];
  
  // Calculate overlap area percentage
  const overlapWidth = Math.min(personRight, itemRight) - Math.max(personLeft, itemLeft);
  const overlapHeight = Math.min(personBottom, itemBottom) - Math.max(personTop, itemTop);
  const overlapArea = overlapWidth * overlapHeight;
  const personArea = personBox[2] * personBox[3];
  const overlapPercent = overlapArea / personArea;
  
  // If overlap is significant, adjust the person bounding box
  if (overlapPercent > 0.1) {
    // Determine which edge of the person box to adjust
    // We'll pick the edge that requires the smallest adjustment
    
    // Potential adjustments
    const adjustLeft = itemRight - personLeft;
    const adjustRight = personRight - itemLeft;
    const adjustTop = itemBottom - personTop;
    const adjustBottom = personBottom - itemTop;
    
    // Find the smallest adjustment
    const minAdjustment = Math.min(
      Math.abs(adjustLeft), 
      Math.abs(adjustRight),
      Math.abs(adjustTop),
      Math.abs(adjustBottom)
    );
    
    // Apply the smallest adjustment
    if (minAdjustment === Math.abs(adjustLeft)) {
      personBox[0] = itemRight;
      personBox[2] = personRight - itemRight;
    } else if (minAdjustment === Math.abs(adjustRight)) {
      personBox[2] = itemLeft - personLeft;
    } else if (minAdjustment === Math.abs(adjustTop)) {
      personBox[1] = itemBottom;
      personBox[3] = personBottom - itemBottom;
    } else if (minAdjustment === Math.abs(adjustBottom)) {
      personBox[3] = itemTop - personTop;
    }
    
    // Ensure box dimensions are still positive
    if (personBox[2] <= 0) personBox[2] = 1;
    if (personBox[3] <= 0) personBox[3] = 1;
  }
};

export default function CameraView({ navigation }) {
  // Original CameraView state
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  
  // Object detection state from App.js
  const [isTfReady, setIsTfReady] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);
  const [predictions, setPredictions] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Photo capture state
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [isReviewingPhoto, setIsReviewingPhoto] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [capturedPredictions, setCapturedPredictions] = useState(null);
  
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
        rafId.current = null;
      }
    };
  }, []);

  // Process detection only when not reviewing a photo
  useEffect(() => {
    let isActive = true;
    
    const runDetection = async () => {
      if (isModelReady && permission?.granted && !isReviewingPhoto && isActive) {
        if (!rafId.current) {
          rafId.current = requestAnimationFrame(detectObjectsAsync);
        }
      }
    };
    
    runDetection();
    
    return () => {
      isActive = false;
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    };
  }, [isModelReady, permission, isReviewingPhoto]);

  // Take photo function - captures a clean photo and freezes the view
  const takePhoto = async () => {
    if (cameraRef.current && !isReviewingPhoto) {
      try {
        // Pause ongoing detection
        if (rafId.current) {
          cancelAnimationFrame(rafId.current);
          rafId.current = null;
        }
        
        // Take high quality photo for backend (clean version)
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.9,
          base64: false,
        });
        
        // Store current predictions for the frozen view
        setCapturedPredictions(predictions);
        setCapturedPhoto(photo);
        
        // Enter review mode - this will switch to the frozen view
        setIsReviewingPhoto(true);
        
      } catch (error) {
        console.log("Error taking photo:", error);
        // If there's an error, ensure we're not stuck in review mode
        setIsReviewingPhoto(false);
      }
    }
  };

  // Retake photo function
  const retakePhoto = () => {
    console.log("Retake photo pressed");
    setCapturedPhoto(null);
    setCapturedPredictions(null);
    setIsReviewingPhoto(false);
  };

  // Send photo to backend
  const sendPhoto = async () => {
    console.log("Send photo pressed");
    if (!capturedPhoto) {
      console.log("No captured photo to send");
      return;
    }
    
    setIsUploading(true);
    
    try {
      console.log("Uploading photo...");
      // Create form data for the upload - using the clean photo
      const formData = new FormData();
      formData.append('photo', {
        uri: capturedPhoto.uri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });
      
      // Add detected objects data
      if (capturedPredictions && capturedPredictions.length > 0) {
        const objectsDetected = capturedPredictions.map(p => ({
          class: p.class,
          confidence: p.score,
          bbox: p.bbox
        }));
        
        formData.append('detectedObjects', JSON.stringify(objectsDetected));
      }
      
      // For testing - just pretend we sent it
      console.log("Would send to backend:", capturedPhoto.uri);
      alert("Photo would be sent to backend (API endpoint not configured)");
      
      // Uncomment this to actually send to backend
      /*
      // Send to backend - Replace with your actual endpoint URL
      const response = await fetch('https://your-backend-url.com/api/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Upload success:', result);
        alert('Photo uploaded successfully!');
      } else {
        console.log('Upload failed:', response.status);
        alert('Failed to upload photo. Please try again.');
      }
      */
      
      // Reset after upload attempt (success or failure)
      setTimeout(() => {
        retakePhoto();
      }, 1500);
      
    } catch (error) {
      console.log('Upload error:', error);
      alert('Error uploading photo. Please check your connection.');
    } finally {
      setIsUploading(false);
    }
  };

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  // Calculate the scaling factor for bounding boxes
  const borderColors = ["blue", "green", "orange", "pink", "purple"];
  const { width: screenWidth } = Dimensions.get("window");
  const cameraWidth = screenWidth;
  const scalingFactor = cameraWidth / 300;

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
          quality: 0.8,
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
        const rawPredictions = await model.current.detect(imageTensor);
        
        // Process predictions - prioritize bottles and cups, adjust person detection
        const processedPredictions = rawPredictions.map(prediction => {
          // Clone the prediction to avoid modifying the original
          return {...prediction};
        });
        
        // Sort to prioritize bottles and cups first
        processedPredictions.sort((a, b) => {
          // Bottles and cups get priority
          if ((a.class === 'bottle' || a.class === 'cup') && 
              !(b.class === 'bottle' || b.class === 'cup')) {
            return -1;
          }
          if (!(a.class === 'bottle' || a.class === 'cup') && 
              (b.class === 'bottle' || b.class === 'cup')) {
            return 1;
          }
          // Otherwise sort by confidence
          return b.score - a.score;
        });
        
        // Filter predictions - lower threshold for bottles and cups, higher for person
        const filteredPredictions = processedPredictions.filter(prediction => {
          // Apply a lower confidence threshold for bottles and cups
          if (prediction.class === 'bottle' || prediction.class === 'cup') {
            return prediction.score > 0.3; // Lower threshold for bottles and cups
          }
          // Higher threshold for person
          if (prediction.class === 'person') {
            return prediction.score > 0.7; // Higher threshold for people
          }
          // Default threshold for other objects
          return prediction.score > 0.5;
        });
        
        // Check for overlapping bottle/cup and person, shrink person bounding box if needed
        for (let i = 0; i < filteredPredictions.length; i++) {
          // If this is a bottle or cup
          if (filteredPredictions[i].class === 'bottle' || filteredPredictions[i].class === 'cup') {
            const bottleBbox = filteredPredictions[i].bbox;
            
            // Check for any overlapping person
            for (let j = 0; j < filteredPredictions.length; j++) {
              if (filteredPredictions[j].class === 'person') {
                const personBbox = filteredPredictions[j].bbox;
                
                // If they overlap
                if (doBoxesOverlap(bottleBbox, personBbox)) {
                  // Shrink the person bounding box to avoid the bottle
                  adjustPersonBoundingBox(filteredPredictions[j], filteredPredictions[i]);
                }
              }
            }
          }
        }
        
        setPredictions(filteredPredictions);
        
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

  if (!permission) {
    return <View style={styles.container}><Text>Requesting camera permissions...</Text></View>;
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
          {!isReviewingPhoto ? (
            <ExpoCameraView 
              ref={cameraRef}
              style={styles.camera} 
              facing={facing}
              flash='off'
              animateShutter={false}
              mute={true}
            >
              {/* Top controls - Flip camera button */}
              <View style={styles.topControlsContainer}>
                <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
                  <Text style={styles.flipButtonText}>Flip</Text>
                </TouchableOpacity>
              </View>
              
              {/* Object detection boxes overlay */}
              {isModelReady &&
                predictions &&
                predictions.map((p, index) => {
                  // Different border colors for bottles and cups
                  const color = p.class === 'bottle' || p.class === 'cup' 
                    ? '#00ff00' // Bright green for bottles and cups
                    : borderColors[index % 5];
                    
                  return (
                    <View key={index}>
                      {/* Label on top of the bounding box */}
                      <View
                        style={{
                          position: "absolute",
                          zIndex: 2,
                          elevation: 2,
                          left: p.bbox[0] * scalingFactor,
                          top: (p.bbox[1] * scalingFactor) - 22, // Position above the box
                          backgroundColor: color,
                          borderTopLeftRadius: 5,
                          borderTopRightRadius: 5,
                          paddingHorizontal: 8,
                          paddingVertical: 2,
                        }}
                      >
                        <Text style={{
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: 12,
                        }}>
                          {p.class} {Math.round(p.score * 100)}%
                        </Text>
                      </View>
                      {/* Bounding box */}
                      <View
                        style={{
                          zIndex: 1,
                          elevation: 1,
                          left: p.bbox[0] * scalingFactor,
                          top: p.bbox[1] * scalingFactor,
                          width: p.bbox[2] * scalingFactor,
                          height: p.bbox[3] * scalingFactor,
                          borderWidth: 2,
                          borderColor: color,
                          backgroundColor: "transparent",
                          position: "absolute",
                        }}
                      />
                    </View>
                  );
                })}
                
              {/* Bottom controls - Take Photo button */}
              <View style={styles.bottomControlsContainer}>
                <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
                  <View style={styles.captureButtonInner} />
                </TouchableOpacity>
              </View>
            </ExpoCameraView>
          ) : (
            // Frozen camera view with captured image
            <View style={styles.camera}>
              {/* Display the frozen camera image */}
              {capturedPhoto && (
                <Image 
                  source={{ uri: capturedPhoto.uri }} 
                  style={styles.frozenCamera}
                  resizeMode="cover"
                />
              )}
              
              {/* Object detection boxes overlay on frozen image */}
              {capturedPredictions && capturedPredictions.map((p, index) => {
                // Different border colors for bottles and cups
                const color = p.class === 'bottle' || p.class === 'cup' 
                  ? '#00ff00' // Bright green for bottles and cups
                  : borderColors[index % 5];
                  
                return (
                  <View key={index}>
                    {/* Label on top of the bounding box */}
                    <View
                      style={{
                        position: "absolute",
                        zIndex: 2,
                        elevation: 2,
                        left: p.bbox[0] * scalingFactor,
                        top: (p.bbox[1] * scalingFactor) - 22, // Position above the box
                        backgroundColor: color,
                        borderTopLeftRadius: 5,
                        borderTopRightRadius: 5,
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                      }}
                    >
                      <Text style={{
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: 12,
                      }}>
                        {p.class} {Math.round(p.score * 100)}%
                      </Text>
                    </View>
                    {/* Bounding box */}
                    <View
                      style={{
                        zIndex: 1,
                        elevation: 1,
                        left: p.bbox[0] * scalingFactor,
                        top: p.bbox[1] * scalingFactor,
                        width: p.bbox[2] * scalingFactor,
                        height: p.bbox[3] * scalingFactor,
                        borderWidth: 2,
                        borderColor: color,
                        backgroundColor: "transparent",
                        position: "absolute",
                      }}
                    />
                  </View>
                );
              })}
              
              {/* Review controls */}
              <View style={styles.reviewButtonsContainer}>
                <TouchableOpacity 
                  style={[styles.reviewButton, { backgroundColor: '#ff4444' }]} 
                  onPress={() => {
                    console.log("Retake button pressed");
                    retakePhoto();
                  }}
                  disabled={isUploading}
                  activeOpacity={0.7}
                  accessibilityLabel="Retake photo"
                >
                  <Text style={styles.reviewButtonText}>Retake</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.reviewButton, { backgroundColor: '#44bb44' }]} 
                  onPress={() => {
                    console.log("Send button pressed");
                    sendPhoto();
                  }}
                  disabled={isUploading}
                  activeOpacity={0.7}
                  accessibilityLabel="Send photo"
                >
                  <Text style={styles.reviewButtonText}>
                    {isUploading ? 'Sending...' : 'Send'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
        
        {/* Prediction results - removed individual predictions display */}
        <View style={styles.predictionContainer}>
          {isModelReady && (
            <Text style={styles.predictionTitle}>
              {isProcessing ? "Processing..." : "Identified Objects"}
            </Text>
          )}
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
  },
  topControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 15,
  },
  flipButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 20,
  },
  flipButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomControlsContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
  },
  captureButtonInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'white',
  },
  frozenCamera: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  reviewButtonsContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  reviewButton: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginHorizontal: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  reviewButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
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
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a2980',
    padding: 20,
  },
  permissionText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
  },
  permissionButtonText: {
    color: '#1a2980',
    fontSize: 16,
    fontWeight: 'bold',
  },
});