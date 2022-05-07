import { StyleSheet, Text, View, Keyboard, Appearance } from "react-native";
import React, { useRef, useState } from "react";
import VisionCameraScreen from "../features/Creation/pages/VisionCameraScreen";
import NoteTakingScreen from "../features/Creation/pages/NoteTakingScreen";
import Swiper from "react-native-swiper";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar, setStatusBarStyle } from "expo-status-bar";
import { colorScheme } from "../utils/colors";
const CreationNav = ({ Recording, setRecording }) => {
  const [currentScreen, setCurrentScreen] = useState(0);

  const navigation = useNavigation();
  const swiperRef = useRef();
  const [Focused, setFocused] = useState(false);
  useFocusEffect(
    React.useCallback(() => {
      setFocused(true);
      return () => {
        setFocused(false);
      };
    })
  );
  const StatusBarHandler = () => {
    if (
      (Focused && currentScreen === 0) ||
      Appearance.getColorScheme() === "dark"
    ) {
      setStatusBarStyle("light");
    } else {
      setStatusBarStyle("dark");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style={StatusBarHandler()}></StatusBar>

      <Swiper
        onIndexChanged={(index) => {
          setCurrentScreen(index);
        }}
        scrollEnabled={!Recording}
        ref={swiperRef}
        showsButtons={false}
        horizontal={false}
        loop={false}
        showsPagination={false}
        // onTouchStartCapture={() => {
        //   Keyboard.dismiss();
        // }}
        onMomentumScrollBegin={() => {
          Keyboard.dismiss();
        }}
        keyboardShouldPersistTaps={"always"}
      >
        <VisionCameraScreen
          Recording={Recording}
          setRecording={setRecording}
          swiperRef={swiperRef}
          currentScreen={currentScreen}
        />

        <NoteTakingScreen swiperRef={swiperRef} />
      </Swiper>
    </View>
  );
};

export default CreationNav;

const styles = StyleSheet.create({});
