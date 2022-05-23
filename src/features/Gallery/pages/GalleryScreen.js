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
import BigList from "../components/Lists/BigList";
import SmallList from "../components/Lists/SmallList";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUser, faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import data from "../../../../assets/data/DATA";
import { DateTime } from "luxon";
import { StatusBar } from "expo-status-bar";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import AppContext from "../../../../AppContext";
import { surfaceColor, elevatedColor, text1 } from "../../../utils/colors";

function groupBy(collection, returnFunction) {
  var i = 0,
    val,
    index,
    values = [],
    result = [];
  for (; i < collection.length; i++) {
    val = returnFunction(collection[i]);
    index = values.indexOf(val);
    if (index > -1) result[index].push(collection[i]);
    else {
      values.push(val);
      result.push([collection[i]]);
    }
  }
  return result;
}

// var obj = groupBy(list, "group");

function GalleryScreen() {
  const { DayObjects, setDayObjects } = useContext(AppContext);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  // const [DayObjects, setDayObjects] = useState([]);
  const [ThisWeekObjects, setThisWeekObjects] = useState([]);
  const [NotthisWeekDays, setNotthisWeekDays] = useState([]);
  const colorScheme = useColorScheme();
  const scrollViewRef = useRef(null);
  useEffect(() => {
    const loadPastDays = async () => {
      const pastDaysSTR = await AsyncStorage.getItem("PastDays");
      const pastDays = await JSON.parse(pastDaysSTR);
      setDayObjects(pastDays);
    };
    loadPastDays();
  }, []);

  useEffect(() => {
    const ConfigureLists = async () => {
      console.log("DAYOBJECTS");
      console.log(DayObjects);
      //  await FileSystem.getInfoAsync(DayObjects[0].video)
      console.log("-----");
      if (DayObjects != null) {
        setThisWeekObjects(
          DayObjects.filter(
            (Day) =>
              DateTime.fromISO(Day.day).weekNumber ===
                DateTime.now().weekNumber &&
              DateTime.fromISO(Day.day).year === DateTime.now().year
          )
        );
        setNotthisWeekDays(
          DayObjects.filter(
            (Day) =>
              !(
                DateTime.fromISO(Day.day).weekNumber ===
                  DateTime.now().weekNumber &&
                DateTime.fromISO(Day.day).year === DateTime.now().year
              )
          )
        );
      }
    };
    ConfigureLists();
    // console.log(ThisWeekObjects.length)
  }, [DayObjects]);

  return (
    <View
      navigation={navigation}
      style={[
        styles.GalleryContainer,
        { backgroundColor: surfaceColor(colorScheme) },
      ]}
    >
      <Pressable
        navigation={navigation}
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: insets.top + 5,
          marginLeft: 18,
          marginBottom: 10,
          marginRight: 18,
        }}
        onPress={() => {
          scrollViewRef.current?.scrollTo({ y: 0, animated: true });
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {/* <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center', padding: 10}} onPress={ () => navigation.navigate('ProfileNav')}>
                    <FontAwesomeIcon icon={faUser} size={20}/>
                </TouchableOpacity> */}
          <Text
            style={{
              fontFamily: "Sora_600SemiBold",
              color: text1(colorScheme),
              fontSize: 32,
              marginLeft: 10,
              alignItems: "center",
            }}
          >
            Gallery
          </Text>
        </View>

        <TouchableOpacity
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
          }}
          onPress={() => navigation.navigate("CameraNav")}
        >
          <FontAwesomeIcon
            icon={faSquarePlus}
            size={20}
            color={text1(colorScheme)}
          />
        </TouchableOpacity>
      </Pressable>

      <ScrollView ref={scrollViewRef}>
        <SmallList
          dayObjects={ThisWeekObjects}
          navigation={navigation}
          colorScheme={colorScheme}
        />
        <BigList
          dayObjects={NotthisWeekDays}
          objectCount={DayObjects == null ? 0 : DayObjects.length}
          navigation={navigation}
          colorScheme={colorScheme}
        />
        {DayObjects === null || DayObjects.length === 0 ? (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Text
              style={{
                fontFamily: "Sora_600SemiBold",
                color: text1(colorScheme),
                fontSize: 28,
                alignItems: "center",
                textAlign: "center",
                marginBottom: 10,
              }}
            >
              Create your first day
            </Text>
            <Text
              style={{
                fontFamily: "Sora_400Regular",
                color: text1(colorScheme),
                fontSize: 14,
                alignItems: "center",
                textAlign: "center",
                marginBottom: 10,
                maxWidth: "90%",
              }}
            >
              Record videos of your daily activities and add journal entries.
              Your previous days will appear here
            </Text>
            <TouchableOpacity
              style={{ padding: 5 }}
              onPress={() => navigation.navigate("CameraNav")}
            >
              <Text
                style={{
                  fontFamily: "Sora_600SemiBold",
                  color: "#00468B",
                  fontSize: 14,
                  alignItems: "center",
                  textAlign: "center",
                  marginBottom: 10,
                  maxWidth: "80%",
                }}
              >
                Create day
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View />
        )}
      </ScrollView>
    </View>
  );
}
export default GalleryScreen;

const styles = StyleSheet.create({
  GalleryContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    justifyContent: "flex-start",
  },
});
