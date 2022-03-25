import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import CameraScreen from './CameraScreen';
import NoteTakingScreen from './NoteTakingScreen'
import CameraPlaybackScreen from './CameraPlaybackScreen'
import { createStackNavigator } from '@react-navigation/stack';


const CameraStack = createStackNavigator()



const CameraNav = () => {
    return (
    <CameraStack.Navigator screenOptions={{ headerShown: false}}>
        <CameraStack.Screen name="Camera" component={CameraScreen}/>
        <CameraStack.Screen name="CameraPlayback" component={CameraPlaybackScreen} options={{
        animationEnabled: true,
      }}/>
        <CameraStack.Screen name="Notes" component={NoteTakingScreen} options={{
        animationEnabled: true,
      }}/>
    </CameraStack.Navigator>
    );
}

const styles = StyleSheet.create({})

export default CameraNav;
