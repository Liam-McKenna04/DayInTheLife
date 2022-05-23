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
const MonthScreen = ({ route, navigation }) => {
  const { dayObject } = route.params;
  const days = dayObject.days;
  // console.log(days[0].day.startOf('week').toISODate())
  const colorScheme = useColorScheme();
  const [MonthCal, setMonthCal] = useState("day");

  return (
    <View style={{ flex: 1, backgroundColor: surfaceColor(colorScheme) }}>
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
      ></BigList>
    </View>
  );
};

export default MonthScreen;

const styles = StyleSheet.create({});
