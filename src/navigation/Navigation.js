import { Platform, StyleSheet, Text, View } from "react-native";
import React, { useState, useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
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
const RootStack = createMaterialTopTabNavigator();
const GalleryStack = createSharedElementStackNavigator();

const GalleryNav = () => {
  return (
    <GalleryStack.Navigator
      initialRouteName="Gallery"
      screenOptions={{
        transitionSpec: {
          open: { animation: "timing", config: { duration: 200 } },
          close: { animation: "timing", config: { duration: 200 } },
        },

        headerShown: false,
        cardStyle: { backgroundColor: "transparent" },
      }}
    >
      <GalleryStack.Screen
        name="DayView"
        component={DayScreen}
        options={{
          cardStyleInterpolator: ({ current: { progress } }) => {
            return { cardStyle: { opacity: progress } };
          },
        }}
      />
      <GalleryStack.Screen name="MonthView" component={MonthScreeen} />
      <GalleryStack.Screen name="WeekView" component={WeekScreen} />

      <GalleryStack.Screen
        name="Gallery"
        component={GalleryScreen}
        sharedElements={(route, otherRoute, showing) => {
          const { dayObject } = otherRoute.params;
          if (dayObject.id && otherRoute.name == "DayView") {
            return [dayObject.id];
          } else {
            // console.log("ERR");
            return;
          }
        }}
      />
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
