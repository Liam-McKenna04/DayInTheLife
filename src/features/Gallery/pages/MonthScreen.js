import React, { useContext } from "react";
import { useEffect, useState, useRef, useFocusEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  TouchableOpacity,
  Button,
  useColorScheme,
  Dimensions,
} from "react-native";
import DateHeader from "../../../components/DateHeader";
import { surfaceColor, elevatedColor, text1 } from "../../../utils/colors";
import BigList from "../components/Lists/BigList";
import { DateTime } from "luxon";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { snapPoint } from "react-native-redash";
const MonthScreen = ({ route, navigation }) => {
  const { dayObject } = route.params;
  const days = dayObject.days;
  const { height } = Dimensions.get("window");

  // console.log(days[0].day.startOf('week').toISODate())
  const colorScheme = useColorScheme();
  const [MonthCal, setMonthCal] = useState("day");
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
          navigation={navigation}
          headerContent={DateTime.fromISO(dayObject.timeBegin).toFormat(
            "LLL yyyy"
          )}
          type={"month"}
          MonthCal={MonthCal}
          setMonthCal={setMonthCal}
        ></DateHeader>
        <BigList
          colorScheme={colorScheme}
          dayObjects={days}
          navigation={navigation}
          type={"month"}
          MonthCal={MonthCal}
          translationY={translationYY}
          translationX={translationXX}
          newTranslateY={translateY}
          newTranslateX={translateX}
          scrollViewRef={scrollViewRef}
        ></BigList>
      </Animated.View>
    </PanGestureHandler>
  );
};

export default MonthScreen;

const styles = StyleSheet.create({});
