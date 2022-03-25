import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';
import DayScreen from "./DayScreen"
import GalleryScreen from "./GalleryScreen"
import WeekScreen from './WeekScreen';

 
const GalleryStack = createStackNavigator()

const GalleryNav = () => {
    return (
    <GalleryStack.Navigator initialRouteName='Gallery' screenOptions={{ headerShown: false}}>
        <GalleryStack.Screen name="Gallery" component={GalleryScreen}/>
        <GalleryStack.Screen name="DayView" component={DayScreen}/>
        <GalleryStack.Screen name="WeekView" component={WeekScreen}/>
    </GalleryStack.Navigator>
    );
}

const styles = StyleSheet.create({})

export default GalleryNav;
