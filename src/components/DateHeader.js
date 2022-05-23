import React, { useState, useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import {
  faArrowUpRightFromSquare,
  faTrash,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";
import { surfaceColor, elevatedColor, text1 } from "../utils/colors";
import { OpenFunc } from "../features/Gallery/components/dayView/ShareMenu";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Modal from "react-native-modal";
import AppContext from "../../AppContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CalendarModeComponent from "../features/Gallery/components/GalleryViewMisc/CalendarMode";
const DateHeader = ({
  headerContent,
  setShareVisable,
  dayObject,
  type,
  MonthCal,
  setMonthCal,
}) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [TrashModalVisable, setTrashModalVisable] = useState(false);
  const colorScheme = useColorScheme();
  const { DayObjects, setDayObjects } = useContext(AppContext);

  return (
    <View
      style={{
        alignItems: "center",
        backgroundColor: surfaceColor(colorScheme),
      }}
    >
      <View style={[styles.header, { marginTop: insets.top + 7 }]}>
        <FontAwesome.Button
          name="arrow-left"
          onPress={() => {
            navigation.goBack();
          }}
          iconStyle={{ color: text1(colorScheme) }}
          size={24}
          underlayColor="transparent"
          activeOpacity={0.2}
          backgroundColor="transparent"
        />

        <Text
          style={{
            fontFamily: "Sora_600SemiBold",
            color: text1(colorScheme),
            fontSize: 26,
            textAlign: "left",
            top: -2,
            left: -2,
          }}
        >
          {headerContent}
        </Text>

        {!type ? (
          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
            }}
            onPress={() => {
              setTrashModalVisable(true);
            }}
          >
            <FontAwesomeIcon
              icon={faTrash}
              size={22}
              color={text1()}
            ></FontAwesomeIcon>
          </TouchableOpacity>
        ) : type === "month" ? (
          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
            }}
            onPress={() => {
              if (MonthCal === "day") {
                setMonthCal("week");
              } else setMonthCal("day");
            }}
          >
            <CalendarModeComponent Mode={MonthCal} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>
      <View
        style={{
          borderBottomColor: "#888888",
          borderBottomWidth: 1,
          width: "95%",
          marginTop: 10,
        }}
      />
      <Modal
        isVisible={TrashModalVisable}
        useNativeDriverForBackdrop
        onBackdropPress={() => {
          setTrashModalVisable(false);
        }}
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
        backdropOpacity={0.4}
      >
        <View
          style={{
            minHeight: 250,
            width: 350,
            backgroundColor: elevatedColor(colorScheme),
            padding: 20,
            borderRadius: 10,
          }}
        >
          <Text
            style={{
              color: text1(colorScheme),
              fontFamily: "Sora_600SemiBold",
              fontSize: 24,
              marginBottom: 10,
            }}
          >
            Are you sure you want to delete this day?
          </Text>
          <Text
            style={{
              color: text1(colorScheme),
              fontFamily: "Sora_400Regular",
              fontSize: 16,
            }}
          >
            Deleting days is permanent and you will not be able to undo this
            action.
          </Text>
          <View
            style={{
              bottom: 8,
              backgroundColor: "transparent",
              height: 80,
              width: 350,

              position: "absolute",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
              padding: 12,
            }}
          >
            <TouchableOpacity
              style={{
                width: 140,
                height: 55,
                backgroundColor: "transparent",
                borderRadius: 12,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 2,
                borderColor: "#444",
              }}
              onPress={() => {
                setTrashModalVisable(false);
              }}
            >
              <Text
                style={{
                  color: text1(colorScheme),
                  fontFamily: "Sora_400Regular",
                  fontSize: 16,
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: 140,
                height: 55,
                backgroundColor: "#FF5252",
                borderRadius: 12,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={async () => {
                const newDayObjects = DayObjects.filter(
                  (day) => day.id != dayObject.id
                );
                setDayObjects(newDayObjects);
                const PastDaysString = JSON.stringify(newDayObjects);
                await AsyncStorage.setItem("PastDays", PastDaysString);
                navigation.navigate("Gallery");
              }}
            >
              <Text
                style={{
                  color: "black",
                  fontFamily: "Sora_400Regular",
                  fontSize: 16,
                }}
              >
                Delete Day
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
