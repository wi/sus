import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import logo from '../assets/EkoLenz_logo.png'; // Your local logo

const Header = ({title, navigation }) => {
  return (
    <View style={styles.header}>
      {/* Left: Logo */}
      <Image source={logo} style={styles.logo} />

      {/* Center: Title */}
      <Text style={styles.headerTitle}>{title}</Text>

      {/* Right: Profile Icon */}
      <View style={styles.headerIcons}>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Ionicons name="person-outline" size={26} color="#212121" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    height: 80,
    backgroundColor: '#FAFAFA',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    elevation: 2,
  },
  logo: {
    width: 55,
    height: 55,
    borderRadius: 6,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    fontFamily: 'Georgia',
    color: '#2E7D32',
    textAlign: 'center',
    flex: 1,
    marginLeft: 10,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 6,
  },
});

export default Header;
