// worker.js
import * as tf from '@tensorflow/tfjs';
import * as cocossd from '@tensorflow-models/coco-ssd';
import { decode as decodeJpeg } from 'jpeg-js';

let model = null;

// Initialize the model
const initializeModel = async () => {
  if (!model) {
    model = await cocossd.load();
    self.postMessage({ type: 'modelReady' });
  }
};

// Convert image data to tensor
const imageToTensor = (rawImageData) => {
  const { width, height, data } = decodeJpeg(rawImageData, { useTArray: true });
  
  // Drop the alpha channel
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

// Handle messages from main thread
self.onmessage = async (event) => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'initialize':
      await tf.ready();
      initializeModel();
      break;
    
    case 'detect':
      if (!model) {
        self.postMessage({ type: 'error', error: 'Model not initialized' });
        return;
      }
      
      try {
        const imageTensor = imageToTensor(data);
        const predictions = await model.detect(imageTensor);
        imageTensor.dispose();
        
        self.postMessage({ 
          type: 'predictions', 
          predictions 
        });
      } catch (error) {
        self.postMessage({ 
          type: 'error', 
          error: error.message 
        });
      }
      break;
  }
};