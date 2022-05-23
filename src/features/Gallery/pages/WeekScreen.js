import React, { useContext } from "react";
import { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  TouchableOpacity,
  Button,
  useColorScheme,
} from "react-native";
import DateHeader from "../../../components/DateHeader";
import { surfaceColor, elevatedColor, text1 } from "../../../utils/colors";
import BigList from "../components/Lists/BigList";
import { DateTime } from "luxon";
const WeekScreen = ({ route, navigation }) => {
  const { dayObject } = route.params;
  const days = dayObject.days;
  console.log(route.params);
  // console.log(days[0].day.startOf('week').toISODate())
  const colorScheme = useColorScheme();

  return (
    <View style={{ flex: 1, backgroundColor: surfaceColor(colorScheme) }}>
      <DateHeader
        navigation={navigation}
        headerContent={DateTime.fromISO(dayObject.timeBegin).toFormat(
          "'Week of' LLL dd yyyy"
        )}
        type={"week"}
      ></DateHeader>
      <BigList
        colorScheme={colorScheme}
        dayObjects={days}
        navigation={navigation}
        type={"week"}
      ></BigList>
    </View>
  );
};

const styles = StyleSheet.create({});

export default WeekScreen;
