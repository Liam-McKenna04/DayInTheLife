import { Appearance, useColorScheme } from "react-native";
import { useState } from "react";

const surfaceDark = "#121212";
const surfaceLight = "#EEEEEE";
const elevatedDark = "#242424";
const dark1 = "#333";

const dark3 = "#1A1A1A";
const dark2 = "#181818";
const light1 = "#FEFEFE";
const light2 = "#EEEEEE";
const primary1 = "#00468B";
const highlight1 = "#FFE45C";

//background

export const surfaceColor = (colorScheme) => {
  // console.log("scheme: " + useColorScheme);
  // const colorScheme = useColorScheme();
  if (colorScheme === "light") {
    return surfaceLight;
  } else {
    return surfaceDark;
  }
};

export const elevatedColor = (colorScheme) => {
  // const colorScheme = Appearance.getColorScheme();

  if (colorScheme === "light") {
    return light1;
  } else {
    return elevatedDark;
  }
};

export const neutral2 = (colorScheme) => {
  // const colorScheme = Appearance.getColorScheme();

  if (colorScheme === "light") {
    return light1;
  } else {
    return dark1;
  }
};

export const text1 = (colorScheme) => {
  // const colorScheme = Appearance.getColorScheme();
  if (colorScheme === "light") {
    return dark1;
  } else {
    return light1;
  }
};

export const RevText1 = (colorScheme) => {
  // const colorScheme = Appearance.getColorScheme();
  if (colorScheme === "dark") {
    return dark1;
  } else {
    return light1;
  }
};

export const text2 = (colorScheme) => {
  // const colorScheme = Appearance.getColorScheme();

  if (colorScheme === "light") {
    return dark3;
  } else {
    return light1;
  }
};

export const revNeutral2 = (colorScheme) => {
  // const colorScheme = Appearance.getColorScheme();

  if (colorScheme === "light") {
    return dark2;
  } else {
    return light2;
  }
};

export const placeholderColor = (colorScheme) => {
  // const colorScheme = Appearance.getColorScheme();

  if (colorScheme === "light") {
    return "#a9a9a9";
  } else {
    return "rgba(255,255,255,0.38)";
  }
};
