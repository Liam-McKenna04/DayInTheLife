import React from "react";
import { View, StyleSheet, Text } from "react-native";

import { createStackNavigator } from "@react-navigation/stack";
// import Swiper from 'react-native-swiper'
import CreationNav from "./CreationNav";
import { CardStyleInterpolators } from "@react-navigation/stack";
import PlayBackNav from "./PlayBackNav";
const CameraStack = createStackNavigator();

const CameraNav = ({
  Recording,
  setRecording,
  EditorStatus,
  setEditorStatus,
}) => {
  return (
    <CameraStack.Navigator
      initialRouteName="Nav"
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
        gestureEnabled: true,
        cardStyleInterpolator: ({ current: { progress } }) => {
          return { cardStyle: { opacity: progress } };
        },
      }}
    >
      <CameraStack.Screen
        name="Nav"
        children={() => (
          <CreationNav Recording={Recording} setRecording={setRecording} />
        )}
      />
      <CameraStack.Screen
        name="PlaybackNav"
        children={() => (
          <PlayBackNav
            EditorStatus={EditorStatus}
            setEditorStatus={setEditorStatus}
          />
        )}
      />
    </CameraStack.Navigator>
  );
};

const styles = StyleSheet.create({});

export default CameraNav;
