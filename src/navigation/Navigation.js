import { Platform, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import CameraNav from "./CameraNav";
import ProfileNavHub from "./ProfileNavHub";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import DayScreen from "../features/Gallery/pages/DayScreen";
import GalleryScreen from "../features/Gallery/pages/GalleryScreen";

const RootStack = createMaterialTopTabNavigator();
const GalleryStack = createSharedElementStackNavigator();

const GalleryNav = () => {
  return (
    <GalleryStack.Navigator
      initialRouteName="Gallery"
      screenOptions={{
        cardStyleInterpolator: ({ current: { progress } }) => {
          return { cardStyle: { opacity: progress } };
        },
        transitionSpec: {
          open: { animation: "timing", config: { duration: 200 } },
          close: { animation: "timing", config: { duration: 200 } },
        },

        headerShown: false,
        cardStyle: { backgroundColor: "transparent" },
      }}
    >
      <GalleryStack.Screen name="DayView" component={DayScreen} />
      <GalleryStack.Screen
        name="Gallery"
        component={GalleryScreen}
        sharedElements={(route, otherRoute, showing) => {
          const { dayObject } = otherRoute.params;
          console.log(showing);
          if (Platform.OS === "android") {
            return;
          }
          return [dayObject.id];
        }}
      />
    </GalleryStack.Navigator>
  );
};

const Navigation = () => {
  const [Recording, setRecording] = useState(false);

  return (
    <RootStack.Navigator
      initialRouteName="GalleryNav"
      screenOptions={{
        swipeEnabled: !Recording,
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
          <CameraNav Recording={Recording} setRecording={setRecording} />
        )}
        options={{ gestureDirection: "horizontal" }}
      />
    </RootStack.Navigator>
  );
};

export default Navigation;
