import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withTiming,
  multiply,
  Extrapolate,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

const RecordButton = ({
  Recording,
  VideoLength,
  Delta,
  MaxVideoLength,
  VideoList,
}) => {
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);

  const cameraButtonStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(!Recording ? 78 : 88, { duration: 100 }),
      height: withTiming(!Recording ? 78 : 88, { duration: 100 }),

      borderWidth: withTiming(!Recording ? 8 : 44, { duration: 100 }),
    };
  });
  const shutterOpacity = Recording ? 0.5 : 1;

  const size = 128;
  const strokeWidth = 12;

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const alpha = Animated.interpolateNode(VideoLength + Delta, {
    inputRange: [0, MaxVideoLength],

    outputRange: [Math.PI * 2, 0],
    extrapolate: Extrapolate.CLAMP,
  });
  const strokeDashoffset = multiply(alpha, radius);

  return (
    <View
      style={{
        width: 120,
        height: 120,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
      }}
      pointerEvents="none"
    >
      {
        <Svg
          style={{ transform: [{ rotateZ: "270deg" }] }}
          width={size}
          height={size}
        >
          <AnimatedCircle
            strokeLinecap="round"
            stroke={
              Delta != 0 || VideoList.length > 0 ? "#00468B" : "transparent"
            }
            fill="none"
            cy={size / 2}
            cx={size / 2}
            r={radius}
            style={{
              transition: "all 0.3s",
              strokeDashoffset: strokeDashoffset,
            }}
            // strokeDashoffset={strokeDashoffset}
            strokeDasharray={`${circumference} ${circumference}`}
            {...{ strokeWidth }}
          ></AnimatedCircle>
          {/* <Path d={`M64 64 L75 75`} fill="none" stroke="red"/> */}
        </Svg>
      }

      <Animated.View
        style={[
          cameraButtonStyle,
          {
            backgroundColor: "transparent",
            position: "absolute",
            borderColor: "white",
            borderRadius: 100,
            opacity: shutterOpacity,
          },
        ]}
      ></Animated.View>
    </View>
  );
};

export default RecordButton;

const styles = StyleSheet.create({});
