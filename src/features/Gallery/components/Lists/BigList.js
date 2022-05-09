import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Pressable, ScrollView } from "react-native";
import SingleLargeGalleryItem from "../ListItems/SingleLargeGalleryItem";
import SpecialItem from "../ListItems/SpecialItem";
import AdItem from "../ListItems/AdItem";
import { DateTime } from "luxon";
import { v4 as uuidv4 } from "uuid";
import { surfaceColor, elevatedColor, text1 } from "../../../../utils/colors";
import { Asset, useAssets } from "expo-asset";
import Share, { Social } from "react-native-share";

function compareLuxonDates(a, b) {
  return a.toMillis() - b.toMillis();
}

const BigList = ({ navigation, dayObjects, objectCount }) => {
  //editing objects in list

  const [AllObjects, setAllObjects] = useState([]);
  let allObjects = [];
  useEffect(async () => {
    if (dayObjects === null) {
      dayObjects = [];
    }
    dayObjects.sort((a, b) =>
      compareLuxonDates(DateTime.fromISO(b.day), DateTime.fromISO(a.day))
    );
    if (objectCount === 0) {
      const specialObject = {
        specialObject: true,
        text: "Example day",
        onClick: () => {
          navigation.navigate("CameraNav");
        },
        id: uuidv4(),
      };
      const adObject = { ad: true, id: uuidv4() };
      allObjects = [...dayObjects, adObject];
      setAllObjects(allObjects);
    } else if (dayObjects.length === 0) {
      const img = await Asset.loadAsync(
        require("../../../../../assets/images/ShareWithFriends.jpg")
      );
      const specialObject = {
        specialObject: true,
        text: "Share with your friends",
        image: img[0].localUri,
        onClick: () => {
          console.log(Share);
          Share.open({
            title: "Share jot",
            message: "Hey, I think you might like this video journal app!\n\n",
            url: "https://www.apple.com/us/app/Jot-|-Video-Journal/1616335485",
          }).catch(() => {});
        },
      };
      const adObject = { ad: true, id: uuidv4() };

      allObjects = [...dayObjects, specialObject, adObject];
      setAllObjects(allObjects);
    } else {
      allObjects = [...dayObjects];
      const length = dayObjects.length;
      const chunkSize = 10;
      let pos = 1;
      const interval = 5;

      while (pos < length) {
        const uuid = uuidv4();
        allObjects.splice(pos, 0, { ad: true, id: uuid });
        pos += interval;
      }

      // allObjects.splice(1, 0, { ad: true, id: uuidv4() });
      setAllObjects(allObjects);
      // console.log(allObjects);
    }
  }, [dayObjects]);

  return (
    <View
      style={{
        top: -20,
        minHeight: 310,
        flexDirection: "column",
        justifyContent: "flex-start",
      }}
    >
      <View style={styles.headerContainer}>
        <Text
          style={{
            fontFamily: "Sora_600SemiBold",
            fontSize: 16,
            color: text1(),
          }}
        >
          Recent days
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
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
                  key={x.day}
                  dayObject={x}
                  navigation={navigation}
                />
              );
            }
          })}
        </ScrollView>
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
    flexDirection: "row",
    flexWrap: "wrap",
    overflow: "visible",
    paddingTop: 25,
    width: "100%",
    marginLeft: 10,
    flex: 1,
  },
});

export default BigList;
