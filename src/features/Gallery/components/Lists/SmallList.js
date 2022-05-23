import React from "react";
import {
  View,
  StyleSheet,
  Button,
  ScrollView,
  Text,
  Pressable,
} from "react-native";
import SingleGalleryItem from "../ListItems/SingleGalleryItem";
import { surfaceColor, elevatedColor, text1 } from "../../../../utils/colors";

const SmallList = ({ navigation, dayObjects, colorScheme }) => {
  if (dayObjects.length == 0) {
    return <View></View>;
  }
  return (
    <View dayObjects={dayObjects}>
      <View style={styles.headerContainer}>
        <Text
          style={{
            fontFamily: "Sora_600SemiBold",
            fontSize: 16,
            color: text1(colorScheme),
          }}
        >
          This week
        </Text>
        <Pressable
          style={{ fontFamily: "Sora_600SemiBold", fontSize: 450, padding: 10 }}
          onPress={() => {
            console.log("a");
          }}
        >
          {/* <Text style={{fontFamily:"Sora_600SemiBold", color: "#4285F4"}}>See More</Text> */}
        </Pressable>
      </View>
      <ScrollView
        dayObjects={dayObjects}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 20,
          marginLeft: -5,
          overflow: "visible",
        }}
      >
        {dayObjects.map((x) => (
          <SingleGalleryItem
            dayObject={x}
            key={x.day}
            navigation={navigation}
            colorScheme={colorScheme}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    marginHorizontal: 30,
    marginTop: 5,
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default SmallList;
