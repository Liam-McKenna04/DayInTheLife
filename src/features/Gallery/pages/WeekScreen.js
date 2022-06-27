import React, { useContext } from "react";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  TouchableOpacity,
  Button,
  useColorScheme,
  Dimensions,
} from "react-native";
import DateHeader from "../../../components/DateHeader";
import { surfaceColor, elevatedColor, text1 } from "../../../utils/colors";
import BigList from "../components/Lists/BigList";
import { DateTime } from "luxon";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { snapPoint } from "react-native-redash";
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import SingleLargeGalleryItem from "../components/ListItems/SingleLargeGalleryItem";
import CalendarModeComponent from "../components/GalleryViewMisc/CalendarMode";
import { v4 as uuidv4 } from "uuid";
import AdItem from "../components/ListItems/AdItem";
import SpecialItem from "../components/ListItems/SpecialItem";
import seedrandom from "seedrandom";

getHeightFromSeededNumber = function (n) {
  //Random number should be from 0 to 1
  const n1 = Math.round(n * 5);
  let height = 0;
  switch (n1) {
    case 1:
      height = -50;
      break;
    case 2:
      height = -20;

      break;

    case 3:
      break;
    case 4:
      break;
    case 5:
      break;
    default:
      break;
  }

  return height;
};
const WeekScreen = ({ route, navigation }) => {
  const { dayObject } = route.params;
  const dayObjects = dayObject.days;
  const days = dayObject.days;
  // console.log(route.params);
  // console.log(days[0].day.startOf('week').toISODate())
  const colorScheme = useColorScheme();
  const bottomSheetRef = useRef(null);
  const handleSheetChanges = useCallback((index) => {
    setLoaded(index);
    console.log("handleSheetChanges", index);
  }, []);
  const [Loaded, setLoaded] = useState(-1);
  const [AllObjects, setAllObjects] = useState([]);
  const [CalendarMode, setCalendarMode] = useState("day");
  const { height } = Dimensions.get("window");
  const [MonthCal, setMonthCal] = useState("week");
  const numCols = Math.floor(Dimensions.get("screen").width / 184);

  function compareLuxonDates(a, b) {
    return a.toMillis() - b.toMillis();
  }
  let allObjects = [];
  useEffect(() => {
    const organizeBigList = async () => {
      let computedObjects = [];
      if (dayObjects === null) {
        dayObjects = [];
      }

      if (CalendarMode === "day") {
        computedObjects = dayObjects.sort((a, b) =>
          compareLuxonDates(DateTime.fromISO(b.day), DateTime.fromISO(a.day))
        );
      } else {
        if (CalendarMode === "week") {
          let yearObjects = groupBy(
            dayObjects,
            (x) => DateTime.fromISO(x["day"]).startOf("week").year
          );
          let WeekObjects = [];
          yearObjects.forEach((yearList) => {
            let y = groupBy(yearList, (x) => x["day"]["weekNumber"]);
            y.forEach((z) => WeekObjects.push(z));
          });

          //Turn WeekObject array of array into Array: [object {Array, first day, id, thumbnail, type, dayObject: Computed Full Object}]
          computedObjects = WeekObjects.map((value, index) => {
            return {
              days: value,
              timeBegin: DateTime.fromISO(value[0].day).startOf("week").toISO(),
              id: uuidv4(),
              thumbnail: value[0].thumbnail,
              type: "week",
            };
          });
        } else if (CalendarMode === "month") {
          let yearObjects = groupBy(
            dayObjects,
            (x) => DateTime.fromISO(x["day"]).startOf("month").year
          );
          let MonthObjects = [];
          yearObjects.forEach((yearList) => {
            let y = groupBy(yearList, (x) => x["day"]["month"]);
            y.forEach((z) => MonthObjects.push(z));
          });

          //Turn Month array of array into Array: [object {Array, first day, id, thumbnail, type, dayObject: Computed Full Object}]
          computedObjects = MonthObjects.map((value, index) => {
            return {
              days: value,
              timeBegin: DateTime.fromISO(value[0].day)
                .startOf("month")
                .toISO(),
              id: uuidv4(),
              thumbnail: value[0].thumbnail,
              type: "month",
            };
          });
        }
      }

      allObjects = [...computedObjects];

      const idAd = uuidv4();
      allObjects.splice(1, 0, { ad: true, id: idAd });

      setAllObjects(allObjects);
    };
    organizeBigList();
  }, [CalendarMode, MonthCal]);
  // console.log(AllObjects);
  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={["100%"]}
      onChange={handleSheetChanges}
      handleStyle={{ display: "none" }}
      enablePanDownToClose={true}
      onClose={(e) => {
        if (Loaded === -1) {
          navigation.goBack();
        }
      }}
      onAnimate={(e) => {
        if (e === 0) {
          navigation.goBack();
        }
        console.log(e);
      }}
    >
      <View style={[{ flex: 1, backgroundColor: surfaceColor(colorScheme) }]}>
        <DateHeader
          navigation={navigation}
          headerContent={DateTime.fromISO(dayObject.timeBegin).toFormat(
            "'Week of' LLL dd yyyy"
          )}
          type={"week"}
        ></DateHeader>
        <View
          style={{
            top: -20,
            minHeight: 310,
            flex: 1,
            flexDirection: "column",
            justifyContent: "flex-start",
            zIndex: -1,
          }}
        >
          <BottomSheetScrollView
            data={AllObjects}
            contentContainerStyle={[
              {
                paddingTop: 25,
                width: "100%",
                flex: 1,
                flexDirection: "row",
              },
              true && { marginTop: 20, top: 0 },
            ]}
            scrollEventThrottle={1}
            // onScroll={type && ScrollHandler}
          >
            {Array.from(Array(numCols), (_, num) => {
              return (
                <View
                  key={`masonry-column-${num}`}
                  style={{
                    flex: 1 / numCols,
                    flexDirection: "column",
                    // backgroundColor: num === 0 ? "red" : "blue",
                  }}
                >
                  {AllObjects.map((el, i) => {
                    if (i % numCols === num) {
                      if (el.ad) {
                        return <AdItem />;
                      } else if (el.specialObject) {
                        return (
                          <SpecialItem
                            key={el.id}
                            onClick={() => {
                              el.onClick();
                            }}
                            text={el.text}
                            image={el.image}
                          ></SpecialItem>
                        );
                      } else {
                        const one = seedrandom(el.id)();
                        const computedHeight = getHeightFromSeededNumber(one);

                        return (
                          <SingleLargeGalleryItem
                            key={el.id}
                            dayObject={el}
                            navigation={navigation}
                            colorScheme={colorScheme}
                            sectionType={el.type}
                            timeBegin={el.timeBegin}
                            thumbnail={el.thumbnail}
                            randomHeight={computedHeight}
                          />
                        );
                      }
                    }

                    return null;
                  }).filter((e) => !!e)}
                </View>
              );
            })}
          </BottomSheetScrollView>
        </View>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    display: "flex",

    flexDirection: "row",
    marginHorizontal: 30,
    marginTop: 25,
    marginBottom: 5,
    justifyContent: "space-between",
    alignItems: "center",
    overflow: "visible",
  },
  container: {
    //   flexDirection: "row",
    //   flexWrap: "wrap",
    //   overflow: "visible",
    paddingTop: 25,
    width: "100%",
    marginLeft: 10,
    flex: 1,
  },
});
export default WeekScreen;
