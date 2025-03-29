import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Footer = ({ navigation, currentScreen }) => {
  return (
    <>
      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.floatingActionButton}
        onPress={() => navigation.navigate('Camera')}
      >
        <View style={styles.buttonCircle}>
          <Ionicons name="camera-outline" size={40} color="white" />
        </View>
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.footerIcon}
          onPress={() => navigation.navigate('Feed')}
        >
          <Ionicons 
            name={currentScreen === 'Feed' ? "home" : "home-outline"} 
            size={28} 
            color="white" 
          />
        </TouchableOpacity>
        {/* Empty space to balance layout */}
        <View style={styles.footerIconPlaceholder} />
        <TouchableOpacity 
          style={styles.footerIcon}
          onPress={() => navigation.navigate('Leaderboard')}
        >
          <Ionicons 
            name={currentScreen === 'Leaderboard' ? "podium" : "podium-outline"} 
            size={28} 
            color="white" 
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 40,
    borderTopWidth: 0.5,
    borderTopColor: '#3a506b',
  },
  footerIcon: {
    padding: 5,
  },
  footerIconPlaceholder: {
    width: 40, // Space in the middle of footer
  },
  floatingActionButton: {
    position: 'absolute',
    bottom: 40, // Position it to overlap with footer
    alignSelf: 'center',
    zIndex: 1, // Ensure it appears above other elements
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonCircle: {
    width: 65,
    height: 65,
    borderRadius: 33, // Half of width/height for a circle
    backgroundColor: '#00e676', // Bright green button that stands out
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
});

export default Footer;
