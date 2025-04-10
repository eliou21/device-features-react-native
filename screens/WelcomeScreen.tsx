import React from 'react';
import {  
  Text, 
  View,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }: any) {

  return (

    <ImageBackground
      source={require('../assets/background with tagline.png')}
      style={styles.background}
      resizeMode="cover"
    >

      <View style={styles.container}>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.replace('Main')}
        >
          <Text style={styles.buttonText}>START DIARY</Text>
        </TouchableOpacity>

      </View>

    </ImageBackground>
    
  );
}

const styles = StyleSheet.create({

  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    backgroundColor: '#C4B1AA',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#847769',
    marginTop: 590,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },

  buttonText: {
    color: 'rgb(237, 237, 237)',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'serif',
    letterSpacing: 1,
  },

});
