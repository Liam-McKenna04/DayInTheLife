import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";

const TimerImage = ({ MaxVideoLength, img1, img2, img3 }) => {
  if (MaxVideoLength === 60) {
    return (
      <Image
        source={require("../../../../assets/images/60.png")}
        style={{ width: 30, height: 30, resizeMode: "contain" }}
      ></Image>
    );
  } else if (MaxVideoLength === 10) {
    return (
      <Image
        source={require("../../../../assets/images/10.png")}
        style={{ width: 30, height: 30, resizeMode: "contain" }}
      ></Image>
    );
  } else if (MaxVideoLength === 2) {
    return (
      <Image
        source={require("../../../../assets/images/2.png")}
        style={{ width: 30, height: 30, resizeMode: "contain" }}
      ></Image>
    );
  } else {
    return <View />;
  }
};

export default TimerImage;

const styles = StyleSheet.create({});
