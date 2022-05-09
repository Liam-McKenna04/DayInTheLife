import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import {
  faAnglesUp,
  faAngleRight,
  faShare,
  faUserGroup,
  faComment,
  faArrowUpFromBracket,
  faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";
import { surfaceColor, elevatedColor, text1 } from "../utils/colors";
import { OpenFunc } from "../features/Gallery/components/dayView/ShareMenu";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const DateHeader = ({ headerContent, setShareVisable, dayObject }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ alignItems: "center" }}>
      <View style={[styles.header, { marginTop: insets.top + 7 }]}>
        <FontAwesome.Button
          name="arrow-left"
          onPress={() => {
            navigation.goBack();
          }}
          iconStyle={{ color: text1() }}
          size={24}
          underlayColor="transparent"
          activeOpacity={0.2}
          backgroundColor="transparent"
        />

        <Text
          style={{
            fontFamily: "Sora_600SemiBold",
            color: text1(),
            fontSize: 26,
            textAlign: "left",
            top: -2,
            left: -2,
          }}
        >
          {headerContent}
        </Text>

        <TouchableOpacity
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
          }}
          onPress={() => {
            OpenFunc(dayObject);
          }}
        >
          <FontAwesomeIcon
            icon={faArrowUpRightFromSquare}
            size={22}
            color={text1()}
          ></FontAwesomeIcon>
        </TouchableOpacity>
      </View>
      <View
        style={{
          borderBottomColor: "#888888",
          borderBottomWidth: 1,
          width: "95%",
          marginTop: 10,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    width: "100%",
    // textAlign: "center",
  },
});

export default DateHeader;
