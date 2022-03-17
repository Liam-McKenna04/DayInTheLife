import * as React from 'react';
import { useState } from 'react';
import Tabs from "./components/NavbarComponent"
import { StyleSheet, Text, View, SafeAreaView, ScrollView, StatusBar, useColorScheme } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import GallaryScreen from './screens/GalleryScreens/GalleryScreen'
import ProfileScreen from './screens/ProfileScreens/ProfileScreen'
// import { Font, AppLoading } from "expo";
// import { useFonts } from '@use-expo/font';
import AppLoading from 'expo-app-loading';
import {useFonts, Sora_400Regular, Sora_600SemiBold } from '@expo-google-fonts/sora'
import { createStackNavigator } from '@react-navigation/stack';
import CameraNav from './screens/CreationScreens/CameraNav';

const RootStack = createStackNavigator()
const RootNavigator = () => {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false, presentation: 'modal', animationEnabled: false, headerMode: 'screen' }}>
        <RootStack.Screen name="BottomTabNavigatorScreen" component={Tabs}/>
        <RootStack.Screen name="CameraNav" component={CameraNav} options={{ ananimationEnabled: true}} />
    </RootStack.Navigator>
  )
}


export default function App() {
    let [fontsLoaded] = useFonts({
      Sora_400Regular,
      Sora_600SemiBold
    })

    if (!fontsLoaded) {
      return <AppLoading/>
    }



  // const [todayDay, SetTodayDay] = useState(DayObject);
  



  return (
    <NavigationContainer>
      <RootNavigator/>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
});

