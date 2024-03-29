import { StyleSheet, Text, View, Keyboard } from "react-native";
import React, { useRef } from "react";
import CameraPlaybackScreen from "../features/Creation/pages/CameraPlaybackScreen";
import { createStackNavigator } from "@react-navigation/stack";

const playbackStack = createStackNavigator();

const PlayBackNav = ({ EditorStatus, setEditorStatus }) => {
  return (
    <playbackStack.Navigator
      initialRouteName="Playback"
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
        gestureEnabled: true,
        gestureDirection: "vertical",
      }}
    >
      <playbackStack.Screen
        name="Playback"
        children={() => {
          return (
            <CameraPlaybackScreen
              EditorStatus={EditorStatus}
              setEditorStatus={setEditorStatus}
            />
          );
        }}
      />
    </playbackStack.Navigator>
  );
};

export default PlayBackNav;
