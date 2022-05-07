import React from "react";
import { View, StyleSheet, Text } from "react-native";

import { createStackNavigator } from "@react-navigation/stack";
// import Swiper from 'react-native-swiper'
import CreationNav from "./CreationNav";
import { CardStyleInterpolators } from "@react-navigation/stack";
import PlayBackNav from "./PlayBackNav";
const CameraStack = createStackNavigator();

const CameraNav = ({ Recording, setRecording }) => {
  return (
    <CameraStack.Navigator
      initialRouteName="Nav"
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
        gestureEnabled: true,
        gestureDirection: "vertical",
      }}
    >
      <CameraStack.Screen
        name="Nav"
        children={() => (
          <CreationNav Recording={Recording} setRecording={setRecording} />
        )}
      />
      <CameraStack.Screen name="PlaybackNav" component={PlayBackNav} />
    </CameraStack.Navigator>
  );
};

const styles = StyleSheet.create({});

export default CameraNav;
