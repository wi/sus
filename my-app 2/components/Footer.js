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
          <Ionicons name="camera-outline" size={32} color="white" />
        </View>
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.footerIcon}
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons 
            name={currentScreen === 'Feed' ? "home" : "home-outline"} 
            size={26} 
            color="#2E7D32" 
          />
        </TouchableOpacity>
        <View style={styles.footerIconPlaceholder} />
        <TouchableOpacity 
          style={styles.footerIcon}
          onPress={() => navigation.navigate('Leaderboard')}
        >
          <Ionicons 
            name={currentScreen === 'Leaderboard' ? "podium" : "podium-outline"} 
            size={26} 
            color="#2E7D32" 
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
    height: 55,
    backgroundColor: '#FAFAFA',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    elevation: 4,
  },
  footerIcon: {
    padding: 6,
  },
  footerIconPlaceholder: {
    width: 60, // space for the floating button
  },
  floatingActionButton: {
    position: 'absolute',
    bottom: 25,
    alignSelf: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  buttonCircle: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
});

export default Footer;
