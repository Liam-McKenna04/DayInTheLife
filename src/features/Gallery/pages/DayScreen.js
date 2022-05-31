import React, { useState, useContext, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  ScrollView,
  useColorScheme,
  Dimensions,
} from "react-native";
import DateHeader from "../../../components/DateHeader";
import DayScrollViewComponent from "../components/dayView/DayScrollViewComponent";
import { OpenFunc } from "../components/dayView/ShareMenu";
import { DateTime } from "luxon";
import { SharedElement } from "react-navigation-shared-element";
import AppContext from "../../../../AppContext";
import { text1, surfaceColor } from "../../../utils/colors";
import { useFocusEffect } from "@react-navigation/native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { snapPoint } from "react-native-redash";

const DayScreen = ({ route, navigation }) => {
  const { dayObject } = route.params;
  const [ShareVisable, setShareVisable] = useState(false);
  const { setSelectedDayObject } = useContext(AppContext);
  const { height } = Dimensions.get("window");
  const colorScheme = useColorScheme();
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const translationYY = useSharedValue(0);
  const translationXX = useSharedValue(0);

  const scrollViewRef = useRef(null);

  const [ScrollEnabled, setScrollEnabled] = useState(true);
  const onGestureEvent = useAnimatedGestureHandler({
    onActive: ({ translationX, translationY, velocityY, velocityX }) => {
      translateX.value = translationX;
      translateY.value = translationY;
      // console.log(translationY);
      // scrollViewRef?.current?.scrollTo({
      //   y: translateY.value,
      //   animated: true,
      // });

      // console.log(velocityY);
    },
    onEnd: ({ velocityX, velocityY, translationY }) => {
      const goBack =
        snapPoint(translateY.value, velocityY, [0, height]) === height;
      if (goBack) {
        runOnJS(navigation.goBack)();
      } else {
        translateX.value = withSpring(0, { velocity: velocityX, damping: 20 });
        translateY.value = withSpring(0, {
          velocity: velocityY,
          damping: 20,
        });
      }
    },
  });
  useFocusEffect(
    React.useCallback(() => {
      setSelectedDayObject(true);

      const unsubscribe = () => {
        setSelectedDayObject(false);
      };

      return () => unsubscribe();
    }, [])
  );
  const aniStyle = useAnimatedStyle(() => {
    return {
      flex: 1,
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });
  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <Animated.View
        style={[
          { flex: 1, backgroundColor: surfaceColor(colorScheme) },
          aniStyle,
        ]}
      >
        <DateHeader
          setShareVisable={setShareVisable}
          navigation={navigation}
          headerContent={DateTime.fromISO(dayObject.day).toFormat(
            "cccc', ' LLL d"
          )}
          dayObject={dayObject}
        />

        <DayScrollViewComponent
          dayObject={dayObject}
          colorScheme={colorScheme}
          ScrollEnabled={ScrollEnabled}
          setScrollEnabled={setScrollEnabled}
          translationY={translationYY}
          translationX={translationXX}
          newTranslateY={translateY}
          newTranslateX={translateX}
          scrollViewRef={scrollViewRef}
          navigation={navigation}
        />

        {/* <ShareMenu
        ShareVisable={ShareVisable}
        setShareVisable={setShareVisable}
        dayObject={dayObject}
      /> */}
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({});

export default DayScreen;
