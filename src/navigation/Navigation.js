import { Platform, StyleSheet, Text, View, Animated } from "react-native";
import React, { useState, useContext } from "react";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import CameraNav from "./CameraNav";
import ProfileNavHub from "./ProfileNavHub";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import DayScreen from "../features/Gallery/pages/DayScreen";
import GalleryScreen from "../features/Gallery/pages/GalleryScreen";
import { useNavigation } from "@react-navigation/native";
import AppContext from "../../AppContext";
import MonthScreeen from "../features/Gallery/pages/MonthScreen";
import WeekScreen from "../features/Gallery/pages/WeekScreen";
import { TransitionSpecs } from "@react-navigation/stack";
const { add, multiply } = Animated;

const RootStack = createMaterialTopTabNavigator();
const GalleryStack = createStackNavigator();

const GalleryNav = () => {
  return (
    <GalleryStack.Navigator
      initialRouteName="Gallery"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: "transparent" },
        gestureEnabled: false,
        cardOverlayEnabled: true,
        presentation: "transparentModal",
        animationEnabled: true,
        detachPreviousScreen: false,
        headerMode: "screen",

        cardStyle: { flex: 1, backgroundColor: "transparent" },
        // animationTypeForReplace: "push",
      }}
      // cardStyle={{ flex: 1 }}
      // mode="modal"
    >
      <GalleryStack.Screen
        name="DayView"
        component={DayScreen}
        options={{
          transitionSpec: {
            open: { animation: "timing", config: { duration: 320 } },
            close: { animation: "timing", config: { duration: 320 } },
          },
          cardStyleInterpolator: ({
            current,
            inverted,
            layouts: { screen },
          }) => {
            const translateY = multiply(
              current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [screen.height, 0],
                extrapolate: "clamp",
              }),
              inverted
            );

            return {
              cardStyle: {
                transform: [{ translateY }],
              },
            };
          },
        }}
      />
      <GalleryStack.Screen
        name="MonthView"
        component={MonthScreeen}
        options={{
          transitionSpec: {
            open: { animation: "timing", config: { duration: 200 } },
            close: { animation: "timing", config: { duration: 200 } },
          },
          cardStyleInterpolator: ({
            current,
            inverted,
            layouts: { screen },
          }) => {
            const translateY = multiply(
              current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [screen.height, 0],
                extrapolate: "clamp",
              }),
              inverted
            );

            return {
              cardStyle: {
                transform: [{ translateY }],
              },
            };
          },
        }}
      />
      <GalleryStack.Screen
        name="WeekView"
        component={WeekScreen}
        options={{
          transitionSpec: {
            open: { animation: "timing", config: { duration: 320 } },
            close: { animation: "timing", config: { duration: 200 } },
          },
          cardStyleInterpolator: ({
            current,
            inverted,
            layouts: { screen },
          }) => {
            const translateY = multiply(
              current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [screen.height, 0],
                extrapolate: "clamp",
              }),
              inverted
            );

            return {
              cardStyle: {
                transform: [{ translateY }],
              },
            };
          },
        }}
      />

      <GalleryStack.Screen name="Gallery" component={GalleryScreen} />
    </GalleryStack.Navigator>
  );
};

const Navigation = () => {
  const [Recording, setRecording] = useState(false);
  const navigation = useNavigation();
  const { SelectedDayObject } = useContext(AppContext);
  const [EditorStatus, setEditorStatus] = useState("none");

  return (
    <RootStack.Navigator
      initialRouteName="GalleryNav"
      screenOptions={{
        swipeEnabled:
          !Recording && !SelectedDayObject && EditorStatus === "none",
        tabBarStyle: { display: "none" },
        headerShown: false,
        gestureDirection: "horizontal",
      }}
    >
      {/* <RootStack.Screen name="ProfileNav" component={ProfileNavHub} options={{gestureDirection: 'horizontal-inverted'}}/> */}

      <RootStack.Screen
        name="GalleryNav"
        options={{ gestureDirection: "horizontal" }}
        component={GalleryNav}
      />
      <RootStack.Screen
        name="CameraNav"
        children={() => (
          <CameraNav
            Recording={Recording}
            setRecording={setRecording}
            EditorStatus={EditorStatus}
            setEditorStatus={setEditorStatus}
          />
        )}
        options={{ gestureDirection: "horizontal" }}
      />
    </RootStack.Navigator>
  );
};

export default Navigation;
