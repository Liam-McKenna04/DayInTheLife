import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import VisionCameraScreen from './VisionCameraScreen'
import NoteTakingScreen from './NoteTakingScreen'
import CameraPlaybackScreen from './CameraPlaybackScreen'
import { createStackNavigator } from '@react-navigation/stack';

import { CardStyleInterpolators } from '@react-navigation/stack';
const CameraStack = createStackNavigator();



const CameraNav = ({Recording, setRecording}) => {
    return (
    <CameraStack.Navigator initialRouteName='Camera'   screenOptions={{headerShown: false, animationEnabled: true, gestureEnabled: true,  gestureDirection: 'vertical'}}>
        <CameraStack.Screen name="Camera" children={() => <VisionCameraScreen Recording={Recording} setRecording={setRecording} />}/>
        <CameraStack.Screen name="CameraPlayback"  component={CameraPlaybackScreen} options={{cardStyleInterpolator: ({current, inverted, layouts}) => CardStyleInterpolators.forHorizontalIOS({current: current, inverted: 1, layouts: layouts})}}/>
        <CameraStack.Screen name="Notes" component={NoteTakingScreen} options={{cardStyleInterpolator: ({current, inverted, layouts}) => CardStyleInterpolators.forVerticalIOS({current: current, inverted: 1, layouts: layouts})
}}/>
    </CameraStack.Navigator>
    );
}

const styles = StyleSheet.create({})

export default CameraNav;
