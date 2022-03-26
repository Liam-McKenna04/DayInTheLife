import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import CameraScreen from './CameraScreen';
import NoteTakingScreen from './NoteTakingScreen'
import CameraPlaybackScreen from './CameraPlaybackScreen'
import { createStackNavigator } from '@react-navigation/stack';

import { CardStyleInterpolators } from '@react-navigation/stack';
const CameraStack = createStackNavigator();



const CameraNav = ({Recording, setRecording}) => {
    return (
    <CameraStack.Navigator initialRouteName='Camera'  screenOptions={{ presentation: 'card', headerMode: 'none', headerShown: false, animationEnabled: true, gestureEnabled: true,  gestureDirection: 'vertical-inverted'}}>
        <CameraStack.Screen name="Camera" children={() => <CameraScreen Recording={Recording} setRecording={setRecording} />}/>
        <CameraStack.Screen name="CameraPlayback" component={CameraPlaybackScreen} options={{cardStyleInterpolator: ({current, inverted, layouts}) => CardStyleInterpolators.forHorizontalIOS({current: current, inverted: 1, layouts: layouts})}}/>
        <CameraStack.Screen name="Notes" component={NoteTakingScreen} options={{cardStyleInterpolator: ({current, inverted, layouts}) => CardStyleInterpolators.forVerticalIOS({current: current, inverted: 1, layouts: layouts})
}}/>
    </CameraStack.Navigator>
    );
}

const styles = StyleSheet.create({})

export default CameraNav;
