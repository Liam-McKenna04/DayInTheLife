import {
  StyleSheet,
  Text,
  View,
  Pressable,
  useColorScheme,
} from "react-native";
import React from "react";
import { text1, elevatedColor } from "../../../../utils/colors";
const StaticNoteComponent = ({
  NoteClickHandler,
  title,
  time,
  text,
  setNoteHeights,
  setRawNoteHeight,
  RawNoteHeight,
  NoteHeights,
  HEADER_HEIGHT,
  i,
  video,
}) => {
  // console.log(NoteClickHandler())
  const colorScheme = useColorScheme();
  return (
    <Pressable
      style={[
        styles.container,
        { backgroundColor: elevatedColor(colorScheme) },
      ]}
      onPress={() => {
        NoteClickHandler();
      }}
      onLayout={(event) => {
        const { height } = event.nativeEvent.layout;
        setRawNoteHeight([...RawNoteHeight, { height: height, i: i }]);
      }}
    >
      <Text
        style={{
          fontFamily: "Sora_400Regular",
          fontSize: 16,
          color: text1(colorScheme),
        }}
      >
        {time}
      </Text>
      <Text
        style={{
          fontFamily: "Sora_600SemiBold",
          fontSize: 36,
          color: text1(colorScheme),
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontFamily: "Sora_400Regular",
          fontSize: 16,
          color: text1(colorScheme),
        }}
      >
        {text}
      </Text>
    </Pressable>
  );
};

export default StaticNoteComponent;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    width: "90%",
    marginTop: 25,
    padding: 15,
    borderRadius: 5,
  },
});
