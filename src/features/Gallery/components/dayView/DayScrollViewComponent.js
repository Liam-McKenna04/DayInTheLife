import {
  StyleSheet,
  Text,
  View,
  Animated,
  ScrollView,
  Image,
  Pressable,
  TouchableOpacity,
  Dimensions,
  useColorScheme,
} from "react-native";
import { Video, AVPlaybackStatus } from "expo-av";
import Swipeable from "react-native-gesture-handler/Swipeable";

import React from "react";
import { useRef, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import StaticNoteComponent from "../dayView/StaticNoteComponent";
import { DateTime } from "luxon";
import { SharedElement } from "react-navigation-shared-element";
import { useFocusEffect } from "@react-navigation/native";
import { InteractionManager } from "react-native";
import * as FileSystem from "expo-file-system";
import { surfaceColor, text1 } from "../../../../utils/colors";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
// import { surfaceColor, elevatedColor, text1 } from "../utils/colors";
import Modal from "react-native-modal";
import {
  faArrowUpRightFromSquare,
  faEyeSlash,
  faMinus,
  faUpRightAndDownLeftFromCenter,
} from "@fortawesome/free-solid-svg-icons";
import { OpenFunc } from "./ShareMenu";
import PopupVideo from "../../../Creation/components/VideoPlayer";
const HEADER_HEIGHT = Dimensions.get("window").height * 0.8;
const WIDTH = Dimensions.get("window").width;
// await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
// const playbackObject = new Audio.Sound();

const VideoPlayer = ({ thumbnail, video, VideoPlaying, id, vidRef }) => {
  const [Loaded, setLoaded] = useState(true);
  // useFocusEffect(
  //   React.useCallback(() => {
  //     // Do something when the screen is focused
  //     const task = InteractionManager.runAfterInteractions(() => {
  //       // Expensive task
  //       setLoaded(true);
  //     });
  //     return () => {
  //       // setLoaded(false);
  //     };
  //   }, [])
  // );
  // const vidRef = useRef(null);
  const [status, setStatus] = useState({});

  return (
    <View style={{ flex: 1 }}>
      <Video
        style={{
          resizeMode: "cover",
          borderRadius: 10,
          backgroundColor: "transparent",
          position: "absolute",
          width: "100%",
          height: "100%",
          zIndex: 5,
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "transparent",
        }}
        ref={vidRef}
        source={{ uri: FileSystem.documentDirectory + video }}
        // useNativeControls
        resizeMode="cover"
        onPlaybackStatusUpdate={(status) => setStatus(() => status)}
        isLooping
        shouldPlay={VideoPlaying}
        progressUpdateIntervalMillis={100}

        // thumbnail={FileSystem.documentDirectory + thumbnail}
      />

      <SharedElement id={id}>
        <Image
          source={{ uri: FileSystem.documentDirectory + thumbnail }}
          style={{ height: "100%", borderRadius: 10 }}
        ></Image>
      </SharedElement>
    </View>
  );
};

const AnimatedImageHeader = ({
  animatedValue,
  thumbnail,
  video,
  VideoClickHandler,
  VideoPlaying,
  id,
  colorScheme,
  vidRef,
}) => {
  // const insets = useSafeAreaInsets();
  const headerHeight = animatedValue.interpolate({
    inputRange: [0, HEADER_HEIGHT - 300],
    outputRange: [HEADER_HEIGHT, 250],
    extrapolate: "clamp",
  });
  if (video != "") {
    return (
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,

          zIndex: 1,
          height: headerHeight,
          backgroundColor: "transparent",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
        pointerEvents="none"
      >
        <View></View>

        <Pressable
          style={{
            height: "90%",
            width: "90%",
            position: "relative",
            borderRadius: 10,
            shadowOffset: { width: 2, height: 2 },
            shadowOpacity: 0,
            shadowRadius: 10,
            paddingBottom: 15,
            paddingTop: 15,
            backgroundColor: surfaceColor(colorScheme),
          }}
          onPress={() => {
            VideoClickHandler();
          }}
        >
          <VideoPlayer
            id={id}
            VideoPlaying={VideoPlaying}
            thumbnail={thumbnail}
            video={video}
            vidRef={vidRef}
          />
        </Pressable>
        <View
          style={{
            borderTopColor: "#888888",
            borderTopWidth: 1,
            width: "80%",
          }}
        />
      </Animated.View>
    );
  } else {
    return <View />;
  }
};

const DayScrollViewComponent = ({ navigation, dayObject, colorScheme }) => {
  // const colorScheme = useColorScheme();
  const offset = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);
  const vidRef = useRef(null);
  const [VideoPlaying, setVideoPlaying] = useState(true);
  const [ExpandedVideoShown, setExpandedVideoShown] = useState(false);
  const [ReturnValue, setReturnValue] = useState(null);
  const [VideoVisible, setVideoVisible] = useState(true);
  const [FulyCompressed, setFulyCompressed] = useState(false);
  const VideoClickHandler = () => {
    if (offset._value < 10) {
      console.log("clickedVideo");
    } else {
      console.log(offset);
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
      }
    }
  };

  const NoteClickHandler = () => {
    // if (offset._value < 250 && dayObject.video != "") {
    //   if (scrollViewRef.current) {
    //     scrollViewRef.current.scrollTo({
    //       y: HEADER_HEIGHT - 750,
    //       animated: true,
    //     });
    //   }
    // }
  };

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <AnimatedImageHeader
        id={dayObject.id}
        VideoPlaying={VideoPlaying}
        VideoClickHandler={VideoClickHandler}
        thumbnail={dayObject.thumbnail}
        video={dayObject.video}
        animatedValue={offset}
        colorScheme={colorScheme}
        vidRef={vidRef}
      />
      {/* 
      <TouchableOpacity
        style={{
          position: "absolute",

          zIndex: 5,
          left: 30,
          top: 20,
          alignItems: "center",
          justifyContent: "center",
          width: 40,
          height: 40,
          backgroundColor: "rgba(0,0,0,0.2)",
          borderRadius: 50,
        }}
        onPress={() => {}}
      >
        <FontAwesomeIcon
          icon={faMinus}
          size={22}
          color={"white"}
        ></FontAwesomeIcon>
      </TouchableOpacity> */}
      <TouchableOpacity
        style={{
          position: "absolute",

          zIndex: 5,
          right: WIDTH / 20 + 10,
          top: 20,
          alignItems: "center",
          justifyContent: "center",
          width: 40,
          height: 40,
          backgroundColor: "rgba(0,0,0,0.2)",
          borderRadius: 50,
        }}
        onPress={() => OpenFunc(dayObject)}
      >
        <FontAwesomeIcon
          icon={faArrowUpRightFromSquare}
          size={22}
          color={"white"}
        ></FontAwesomeIcon>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          position: "absolute",

          zIndex: 5,
          right: WIDTH / 20 + 10,
          top: 70,
          alignItems: "center",
          justifyContent: "center",
          width: 40,
          height: 40,
          backgroundColor: "rgba(0,0,0,0.2)",
          borderRadius: 50,
        }}
        onPress={async () => {
          setExpandedVideoShown(true);
          setVideoPlaying(false);
        }}
      >
        <FontAwesomeIcon
          icon={faUpRightAndDownLeftFromCenter}
          size={22}
          color={"white"}
        ></FontAwesomeIcon>
      </TouchableOpacity>
      <ScrollView
        NoteClickHandler={() => {}}
        ref={scrollViewRef}
        style={{ flex: 1, backgroundColor: "transparent" }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.contentContainer,
          dayObject.video == ""
            ? styles.contentContainerWithoutVideo
            : styles.contentContainerWithVideo,
        ]}
        scrollEventThrottle={1}
        scrollToOverflowEnabled={true}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: offset } } }],
          {
            listener: (e) => {
              if (offset._value > 200) {
                setVideoPlaying(false);
              } else {
                setVideoPlaying(true);
              }
              if (offset._value > HEADER_HEIGHT - 200) {
                setFulyCompressed(true);
                console.log(offset._value);
              } else {
                setFulyCompressed(false);
              }
            },
            useNativeDriver: false,
          }
        )}
      >
        {dayObject.notes.map((note) => {
          return (
            <StaticNoteComponent
              NoteClickHandler={NoteClickHandler}
              key={note.date}
              text={note.text}
              title={note.title}
              time={DateTime.fromISO(note.date).toFormat("t")}
              colorScheme={colorScheme}
            />
          );
        })}
      </ScrollView>

      <Modal
        isVisible={ExpandedVideoShown}
        onBackdropPress={() => {
          setExpandedVideoShown(false);
          setVideoPlaying(true);
        }}
        onModalwillHide={async () => {
          await vidRef.current.setPositionAsync(ReturnValue - 100);
          console.log(ReturnValue);
        }}
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
        animationIn="zoomIn"
        animationOut="zoomOut"
        animationInTiming={500}
        animationOutTiming={500}
        useNativeDriver={true}
      >
        <View style={{ height: "83%" }}>
          <PopupVideo
            VideoURI={dayObject.video}
            videoURIList={[]}
            dayComponent={true}
            setExpandedVideoShown={setExpandedVideoShown}
            setVideoPlaying={setVideoPlaying}
            setReturnValue={setReturnValue}
            vidRefIncoming={vidRef}
          ></PopupVideo>
        </View>
      </Modal>
    </SafeAreaProvider>
  );
};

export default DayScrollViewComponent;

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: 100,
  },
  contentContainerWithVideo: { paddingTop: HEADER_HEIGHT * 0.9 },
  contentContainerWithoutVideo: { paddingTop: 0 },
});
