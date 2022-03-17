import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import CameraScreen from './CameraScreen';
import NoteTakingScreen from './NoteTakingScreen'
import { createStackNavigator } from '@react-navigation/stack';


const CameraStack = createStackNavigator()

const CameraNav = () => {
    return (
    <CameraStack.Navigator screenOptions={{ headerShown: true}}>
        <CameraStack.Screen name="Camera" component={CameraScreen}/>
        <CameraStack.Screen name="Notes" component={NoteTakingScreen}/>
    </CameraStack.Navigator>
    );
}

const styles = StyleSheet.create({})

export default CameraNav;
