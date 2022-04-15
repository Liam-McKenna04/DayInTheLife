import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';

import { createStackNavigator } from '@react-navigation/stack';
import DayScreen from "./DayScreen"
import GalleryScreen from "./GalleryScreen"
import WeekScreen from './WeekScreen';

import { Easing } from 'react-native';
const GalleryStack = createSharedElementStackNavigator()
// const GalleryStack = createStackNavigator()

const GalleryNav = () => {
    return (
    <GalleryStack.Navigator initialRouteName='Gallery'   screenOptions={{ cardStyleInterpolator: ({current: {progress}}) => {
        
        return {cardStyle: {opacity: progress}}

    },transitionSpec: {
        open: {animation: 'timing', config: {duration: 200}},
        close: {animation: 'timing', config: {duration: 200}},

    },
    
    
    
    headerShown: false, cardStyle: {backgroundColor: 'transparent'}}}>
        <GalleryStack.Screen name="DayView" component={DayScreen}/> 
        <GalleryStack.Screen name="Gallery" component={GalleryScreen} sharedElements={(route, otherRoute, showing)=>{
            const {dayObject} = otherRoute.params
            console.log(showing)
            
            return [dayObject.id]}
        }/>
       
    </GalleryStack.Navigator>
    );
}

const styles = StyleSheet.create({}) 

export default GalleryNav;
