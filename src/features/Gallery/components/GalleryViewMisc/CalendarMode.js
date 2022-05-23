import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faArrowUpRightFromSquare,
  faCalendarDay,
  faCalendarDays,
  faCalendarWeek,
  faUpRightAndDownLeftFromCenter,
} from "@fortawesome/free-solid-svg-icons";
import { surfaceColor, elevatedColor, text1 } from "../../../../utils/colors";

const CalendarModeComponent = ({ Mode, colorScheme }) => {
  if (Mode === "month") {
    return (
      <FontAwesomeIcon
        icon={faCalendarDays}
        size={22}
        color={text1(colorScheme)}
      ></FontAwesomeIcon>
    );
  } else if (Mode === "week") {
    return (
      <FontAwesomeIcon
        icon={faCalendarWeek}
        size={22}
        color={text1(colorScheme)}
      ></FontAwesomeIcon>
    );
  } else {
    return (
      <FontAwesomeIcon
        icon={faCalendarDay}
        size={22}
        color={text1(colorScheme)}
      ></FontAwesomeIcon>
    );
  }
};

export default CalendarModeComponent;

const styles = StyleSheet.create({});
