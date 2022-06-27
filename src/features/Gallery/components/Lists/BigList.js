import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Platform,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from "react-native";
import SingleLargeGalleryItem from "../ListItems/SingleLargeGalleryItem";
import SpecialItem from "../ListItems/SpecialItem";
import AdItem from "../ListItems/AdItem";
import { DateTime } from "luxon";
import { v4 as uuidv4 } from "uuid";
import { surfaceColor, elevatedColor, text1 } from "../../../../utils/colors";
import { Asset, useAssets } from "expo-asset";
import Share, { Social } from "react-native-share";
import CalendarModeComponent from "../GalleryViewMisc/CalendarMode";
import { ScrollView } from "react-native-gesture-handler";
import MasonryList from "reanimated-masonry-list";
import {
  Extrapolate,
  runOnJS,
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { snapPoint } from "react-native-redash";
import Rate, { AndroidMarket } from "react-native-rate";
import seedrandom from "seedrandom";
function compareLuxonDates(a, b) {
  return a.toMillis() - b.toMillis();
}

const shareObject = {
  specialObject: true,
  text: "Share with your friends",
  image: true,
  onClick: () => {
    Share.open({
      title: "Share jot",
      message: "Hey, I think you might like this video journal app!\n\n",
      url: "https://jott.day/download",
    }).catch(() => {});
  },
  id: uuidv4(),
};

const rateObject = {
  specialObject: true,
  text: "Rate on the App Store",
  image: true,
  onClick: () => {
    const options = {
      AppleAppID: "1616335485",
      GooglePackageName: "com.liammckenna04.dayinthelife",
    };
    Rate.rate(options).catch(() => {});
  },
  id: uuidv4(),
};

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

const BigList = ({
  navigation,
  dayObjects,
  objectCount,
  colorScheme,
  type,
  MonthCal,
  translationY,
  translationX,
  newTranslateY,
  scrollViewRef,
}) => {
  //editing objects in list

  const [AllObjects, setAllObjects] = useState([]);
  const [CalendarMode, setCalendarMode] = useState("day");
  const { height } = Dimensions.get("window");
  const [Bouncing, setBouncing] = useState(true);
  const [HeightOffset, setHeightOffset] = useState(0);
  let allObjects = [];
  useEffect(() => {
    const organizeBigList = async () => {
      if (MonthCal) {
        setCalendarMode(MonthCal);
        // console.log(MonthCal);
      }
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
            let y = groupBy(
              yearList,
              (x) => DateTime.fromISO(x["day"])["weekNumber"]
            );
            y.forEach((z) => WeekObjects.push(z));
          });

          //Turn WeekObject array of array into Array: [object {Array, first day, id, thumbnail, type, dayObject: Computed Full Object}]
          computedObjects = WeekObjects.map((value, index) => {
            const thumbList = value.filter((day) => day.thumbnail != "");
            const thumb = thumbList === [] ? "" : thumbList[0].thumbnail;

            return {
              days: value,
              timeBegin: DateTime.fromISO(value[0].day).startOf("week").toISO(),
              id: uuidv4(),
              thumbnail: thumb,
              type: "week",
            };
          });
          // console.log(WeekObjects);
        } else if (CalendarMode === "month") {
          let yearObjects = groupBy(
            dayObjects,
            (x) => DateTime.fromISO(x["day"]).startOf("month").year
          );
          let MonthObjects = [];
          yearObjects.forEach((yearList) => {
            let y = groupBy(
              yearList,
              (x) => DateTime.fromISO(x["day"])["month"]
            );
            y.forEach((z) => MonthObjects.push(z));
          });

          //Turn Month array of array into Array: [object {Array, first day, id, thumbnail, type, dayObject: Computed Full Object}]
          computedObjects = MonthObjects.map((value, index) => {
            const thumbList = value.filter((day) => day.thumbnail != "");
            const thumb = thumbList === [] ? "" : thumbList[0].thumbnail;
            return {
              days: value,
              timeBegin: DateTime.fromISO(value[0].day)
                .startOf("month")
                .toISO(),
              id: uuidv4(),
              thumbnail: thumb,
              type: "month",
            };
          });
        }
      }

      allObjects = [...computedObjects];

      allObjects.splice(1, 0, { ad: true, id: uuidv4() });

      setAllObjects(allObjects);
    };
    organizeBigList();
  }, [dayObjects, CalendarMode, MonthCal]);

  return (
    <View
      style={{
        top: -20,
        minHeight: 310,
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        zIndex: -1,
      }}
    >
      {!type ? (
        <View style={styles.headerContainer}>
          <Text
            style={{
              fontFamily: "Sora_600SemiBold",
              fontSize: 18,
              color: text1(colorScheme),
            }}
          >
            Recent {CalendarMode}s
          </Text>
          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              // backgroundColor: "rgba(0,0,0,0.2)",
              borderRadius: 50,
            }}
            onPress={() => {
              switch (CalendarMode) {
                case "day":
                  setCalendarMode("week");
                  break;
                case "week":
                  setCalendarMode("month");
                  break;
                case "month":
                  setCalendarMode("day");
                  break;
                default:
                  break;
              }
            }}
          >
            <CalendarModeComponent
              Mode={CalendarMode}
              colorScheme={colorScheme}
            />
          </TouchableOpacity>
        </View>
      ) : null}
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <MasonryList
          data={AllObjects}
          contentContainerStyle={[
            { paddingTop: 25, width: "100%", marginLeft: 10, flex: 1 },
            type && { marginTop: 20, top: HeightOffset },
          ]}
          numColumns={Math.floor(Dimensions.get("screen").width / 184)}
          ref={scrollViewRef}
          scrollEventThrottle={1}
          // onScroll={type && ScrollHandler}
          renderItem={({ item }) => {
            if (item.ad) {
              return <AdItem key={"bbbbbbbb"} />;
            } else {
              let one = 0;
              if (CalendarMode === "day") {
                one = seedrandom(item.id)();
              } else {
                if (item.days) {
                  one = seedrandom(item.days[0].id)();
                }
              }
              const computedHeight = getHeightFromSeededNumber(one);

              return (
                <SingleLargeGalleryItem
                  key={item.id}
                  dayObject={item}
                  navigation={navigation}
                  colorScheme={colorScheme}
                  sectionType={item.type}
                  timeBegin={item.timeBegin}
                  thumbnail={item.thumbnail}
                  randomHeight={computedHeight}
                />
              );
            }
          }}
        ></MasonryList>
        {/* <Animated.ScrollView
          contentContainerStyle={[
            styles.container,
            type && { marginTop: 15, top: HeightOffset },
          ]}
          scrollEventThrottle={1}
          onScroll={type && ScrollHandler}
          bounces={Bouncing}
          ref={scrollViewRef}
          scrollEnabled={true}
        >
          {AllObjects.map((x) => {
            if (x.ad) {
              return <AdItem key={x.id} />;
            } else if (x.specialObject) {
              return (
                <SpecialItem
                  key={x.id}
                  onClick={() => {
                    x.onClick();
                  }}
                  text={x.text}
                  image={x.image}
                ></SpecialItem>
              );
            } else {
              return (
                <SingleLargeGalleryItem
                  key={x.id}
                  dayObject={x}
                  navigation={navigation}
                  colorScheme={colorScheme}
                  sectionType={x.type}
                  timeBegin={x.timeBegin}
                  thumbnail={x.thumbnail}
                />
              );
            }
          })}
        </Animated.ScrollView> */}
      </View>
    </View>
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
  },
});

export default BigList;
