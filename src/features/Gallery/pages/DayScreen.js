import React, { useState, useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  ScrollView,
  useColorScheme,
} from "react-native";
import DateHeader from "../../../components/DateHeader";
import DayScrollViewComponent from "../components/dayView/DayScrollViewComponent";
import { OpenFunc } from "../components/dayView/ShareMenu";
import { DateTime } from "luxon";
import { SharedElement } from "react-navigation-shared-element";
import AppContext from "../../../../AppContext";
import { text1, surfaceColor } from "../../../utils/colors";
import { useFocusEffect } from "@react-navigation/native";

const DayScreen = ({ route, navigation }) => {
  const { dayObject } = route.params;
  const [ShareVisable, setShareVisable] = useState(false);
  const { setSelectedDayObject } = useContext(AppContext);
  const colorScheme = useColorScheme();
  useFocusEffect(
    React.useCallback(() => {
      setSelectedDayObject(true);

      const unsubscribe = () => {
        setSelectedDayObject(false);
      };

      return () => unsubscribe();
    }, [])
  );
  return (
    <View style={{ flex: 1, backgroundColor: surfaceColor(colorScheme) }}>
      <DateHeader
        setShareVisable={setShareVisable}
        navigation={navigation}
        headerContent={DateTime.fromISO(dayObject.day).toFormat(
          "cccc', ' LLL d"
        )}
        dayObject={dayObject}
      />

      <DayScrollViewComponent dayObject={dayObject} colorScheme={colorScheme} />

      {/* <ShareMenu
        ShareVisable={ShareVisable}
        setShareVisable={setShareVisable}
        dayObject={dayObject}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({});

export default DayScreen;
