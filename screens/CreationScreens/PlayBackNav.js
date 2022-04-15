import { StyleSheet, Text, View, Keyboard } from 'react-native'
import React, {useRef} from 'react'
import CameraPlaybackScreen from './CameraPlaybackScreen'
import DayScreen from '../GalleryScreens/DayScreen'
import { createStackNavigator } from '@react-navigation/stack';

const playbackStack = createStackNavigator();

const PlayBackNav = () => {
    
  return (
      <playbackStack.Navigator initialRouteName='Playback' screenOptions={{headerShown: false, animationEnabled: true, gestureEnabled: true,  gestureDirection: 'vertical'}}>
          <playbackStack.Screen name="Playback" component={CameraPlaybackScreen}/>
          <playbackStack.Screen name="Preview" component={DayScreen}/>
      </playbackStack.Navigator>
  )
}

export default PlayBackNav

