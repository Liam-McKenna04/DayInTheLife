import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import React from "react";
const MainContentRenderer = ({ image }) => {
  if (true) {
    // console.log(image);
    return (
      <Image
        style={{
          height: "100%",
          width: "100%",
          resizeMode: "cover",
          borderRadius: 10,
        }}
        resizeMode="cover"
        source={require("../../../../../assets/images/ShareWithFriends.jpg")}
      />
    );
  } else {
    return <View />;
  }
};

const TitleContentRenderer = ({ text }) => {
  return (
    <Text
      style={{
        fontFamily: "Sora_600SemiBold",
        fontSize: 25,
        textAlign: "left",
        position: "absolute",
        top: 12,
        left: 12,
        width: "90%",
        zIndex: 1,
        color: "white",
      }}
    >
      {text}
    </Text>
  );
};

const SpecialItem = ({ onClick, text, image }) => {
  return (
    <Pressable style={styles.GalleryItemContainer} onPress={onClick}>
      <TitleContentRenderer text={text} />
      <MainContentRenderer image={image} />
    </Pressable>
  );
};

export default SpecialItem;

const styles = StyleSheet.create({
  GalleryItemContainer: {
    backgroundColor: "transparent",
    width: 165,
    height: 205,
    borderRadius: 10,
    flexDirection: "column",
    justifyContent: "flex-start",
    overflow: "visible",

    alignItems: "center",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 14,

    // marginTop: 20,
    marginHorizontal: 15,
    marginBottom: 20,
  },
  MainContentStyle: {
    height: 140,
    justifyContent: "flex-start",
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
});
