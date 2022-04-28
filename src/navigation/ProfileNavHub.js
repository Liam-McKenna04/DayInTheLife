import React from 'react';
import {View, StyleSheet} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
// import ProfileScreen from '../features/Profile/pages/ProfileScreen';
// import SettingsScreen from '../features/Profile/pages/SettingsScreen';
 
const Stack = createStackNavigator();
const ProfileNavHub = () => {
    return (
        <Stack.Navigator screenOptions={
            {tabBarShowLabel: false, 
             headerShown: false,
             tabBarStyle: {
                 position: 'absolute'
                 
             }}
            }>
            // <Stack.Screen name="Profile" component={ProfileScreen} />
            // <Stack.Screen name="Settings" component={SettingsScreen} />
            

        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({})

export default ProfileNavHub;
