import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Linking,
  Appearance,
  useColorScheme,
} from "react-native";
import React from "react";
import { useFocusEffect } from "@react-navigation/native";

import { StatusBar } from "expo-status-bar";
import { text1, surfaceColor, elevatedColor } from "../../../utils/colors";
const PermissionDenied = ({ text, title }) => {
  const [Focused, setFocused] = React.useState(false);
  const colorScheme = useColorScheme();

  const statusBarStyle = colorScheme === "dark" ? "light" : "dark";

  useFocusEffect(
    React.useCallback(() => {
      setFocused(true);
      return () => {
        setFocused(false);
      };
    })
  );
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        backgroundColor: surfaceColor(colorScheme),
      }}
    >
      <StatusBar hidden={Focused}></StatusBar>
      <View style={{ height: 400, width: "100%", top: -50, color: "blue" }}>
        <Text
          style={{
            fontFamily: "Sora_600SemiBold",
            color: text1(colorScheme),
            fontSize: 38,
            marginLeft: 20,
            alignItems: "center",
            marginBottom: 5,
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontFamily: "Sora_400Regular",
            color: text1(colorScheme),
            fontSize: 22,
            marginLeft: 20,
            alignItems: "center",
            marginBottom: 5,
          }}
        >
          {text}
        </Text>
        <Pressable
          onPress={() => {
            Linking.openSettings();
          }}
          style={styles.press}
        >
          <View
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* <FontAwesomeIcon icon={faGear} size={24} style={{color: 'black'}}/> */}
            <Text
              style={{
                textAlign: "center",
                marginLeft: 13,
                fontFamily: "Sora_600SemiBold",
                fontSize: 18,
                color: "white",
              }}
            >
              Go To Settings
            </Text>
          </View>
          {/* <FontAwesomeIcon icon={faAngleRight} size={20} style={{color: 'black'}}/> */}
        </Pressable>
      </View>
    </View>
  );
};

export default PermissionDenied;

const styles = StyleSheet.create({
  press: {
    backgroundColor: "#00468B",
    width: "89%",
    marginTop: 22,
    marginLeft: 20,
    height: 66,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
  },
});
