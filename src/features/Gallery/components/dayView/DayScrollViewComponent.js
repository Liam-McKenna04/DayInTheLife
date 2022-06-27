import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  TouchableOpacity,
  Dimensions,
  useColorScheme,
  ScrollView,
} from "react-native";
import { Video, AVPlaybackStatus } from "expo-av";
import Swipeable from "react-native-gesture-handler/Swipeable";

import React from "react";
import { useRef, useState, useEffect } from "react";
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
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
const HEADER_HEIGHT = Dimensions.get("window").height * 0.85;
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

      <SharedElement id={id} style={{ flex: 1 }}>
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
  animatedHeaderStyle,
}) => {
  // const insets = useSafeAreaInsets();
  // const headerHeight = Animated.interpolateNode(animatedValue, {
  //   inputRange: [0, HEADER_HEIGHT - 300],
  //   outputRange: [HEADER_HEIGHT, 250],
  //   extrapolate: "clamp",
  // });

  // console.log(animatedHeaderStyle);
  if (video != "") {
    return (
      <Animated.View
        style={[
          {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            // height: headerHeight,

            zIndex: 1,
            backgroundColor: "transparent",
            alignItems: "center",
            justifyContent: "flex-start",
          },
          animatedHeaderStyle,
        ]}
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
const compareObjects = (object1, object2, key) => {
  const obj1 = object1[key];
  const obj2 = object2[key];

  if (obj1 < obj2) {
    return -1;
  }
  if (obj1 > obj2) {
    return 1;
  }
  return 0;
};

const DayScrollViewComponent = ({
  navigation,
  dayObject,
  colorScheme,
  translationY,
  scrollViewRef,
  newTranslateY,
  newTranslateX,
  translationX,
  ScrollEnabled,
  setScrollEnabled,
}) => {
  // const colorScheme = useColorScheme();
  // const offset = useRef(new Animated.Value(0)).current;
  const vidRef = useRef(null);
  const [VideoPlaying, setVideoPlaying] = useState(true);
  const [ExpandedVideoShown, setExpandedVideoShown] = useState(false);
  const [ReturnValue, setReturnValue] = useState(null);
  const [VideoVisible, setVideoVisible] = useState(true);
  const [FulyCompressed, setFulyCompressed] = useState(false);
  const [NoteHeights, setNoteHeights] = useState([]);
  const [RawNoteHeight, setRawNoteHeight] = useState([]);
  const { height } = Dimensions.get("window");
  const [Bouncing, setBouncing] = useState(true);
  const [HeightOffset, setHeightOffset] = useState(0);
  useEffect(() => {
    // console.log(NoteHeights.length);
    // const revNewHeights = RawNoteHeight.slice(0).reverse();
    // console.log(revNewHeights);
    if (RawNoteHeight.length === dayObject.notes.length) {
      const RawCopied = [...RawNoteHeight];
      RawCopied.sort((a, b) => {
        return compareObjects(a, b, "i");
      });

      let revNewHeights = [];
      for (let i = 0; i < RawCopied.length; i++) {
        const element = RawCopied[i].height;
        let prev = HEADER_HEIGHT - 290;
        if (i > 0) {
          prev = revNewHeights[revNewHeights.length - 1];
        }
        revNewHeights.push(element + prev + 25);
      }

      setNoteHeights(revNewHeights);
    }
  }, [RawNoteHeight]);
  const VideoClickHandler = () => {
    // if (offset._value < 10) {
    //   console.log("clickedVideo");
    // } else {
    //   // console.log(offset);
    //   if (scrollViewRef.current) {
    //     scrollViewRef.current.scrollTo({ y: 0, animated: true });
    //   }
    // }
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
  const ScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      translationY.value = event.contentOffset.y;
      translationX.value = event.contentOffset.x;

      if (translationY.value > 200) {
        runOnJS(setVideoPlaying)(false);
      } else {
        runOnJS(setVideoPlaying)(true);
      }
      // console.log(translationY.value);
    },
  });
  const animatedHeaderStyle = useAnimatedStyle(() => {
    const headerHeight = interpolate(
      translationY.value,
      [0, HEADER_HEIGHT - 300],
      [HEADER_HEIGHT, 250],
      "clamp"
    );
    console.log(headerHeight);
    return {
      height: headerHeight,
    };
  });
  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <AnimatedImageHeader
        id={dayObject.id}
        VideoPlaying={VideoPlaying}
        VideoClickHandler={VideoClickHandler}
        thumbnail={dayObject.thumbnail}
        video={dayObject.video}
        animatedValue={translationY.value}
        colorScheme={colorScheme}
        vidRef={vidRef}
        animatedHeaderStyle={animatedHeaderStyle}
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
      {dayObject.video != "" ? (
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
      ) : null}
      {dayObject.video != "" ? (
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
      ) : null}
      <BottomSheetScrollView
        NoteClickHandler={() => {}}
        ref={scrollViewRef}
        style={{
          flex: 1,
          backgroundColor: surfaceColor(colorScheme),
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.contentContainer,
          dayObject.video == ""
            ? styles.contentContainerWithoutVideo
            : styles.contentContainerWithVideo,
        ]}
        // scrollEventThrottle={1}
        scrollToOverflowEnabled={false}
        scrollEnabled={true}
        bounces={true}
        snapToOffsets={[HEADER_HEIGHT - 300, ...NoteHeights]}
        decelerationRate={"fast"}
        onTouchMove={ScrollHandler}
        // Animated.event(
        //   [{ nativeEvent: { contentOffset: { y: offset } } }],
        //   {
        //     listener: (e) => {
        //       // console.log(offset._value);
        //       // console.log(NoteHeights);
        //       if (offset._value > 200) {
        //         setVideoPlaying(false);
        //       } else {
        //         setVideoPlaying(true);
        //       }
        //       if (offset._value > HEADER_HEIGHT - 200) {
        //         setFulyCompressed(true);
        //         // console.log(offset._value);
        //       } else {
        //         setFulyCompressed(false);
        //       }
        //     },
        //     useNativeDriver: false,
        //   }
        // )}
      >
        {dayObject.notes
          .slice(0)
          .reverse()
          .map((note, i) => {
            return (
              <StaticNoteComponent
                NoteClickHandler={NoteClickHandler}
                key={note.date}
                text={note.text}
                title={note.title}
                time={DateTime.fromISO(note.date).toFormat("t")}
                colorScheme={colorScheme}
                i={i}
                setNoteHeights={setNoteHeights}
                setRawNoteHeight={setRawNoteHeight}
                RawNoteHeight={RawNoteHeight}
                NoteHeights={NoteHeights}
                HEADER_HEIGHT={HEADER_HEIGHT}
                video={dayObject.video}
              />
            );
          })}
      </BottomSheetScrollView>

      <Modal
        isVisible={ExpandedVideoShown}
        onBackdropPress={() => {
          setExpandedVideoShown(false);
          setVideoPlaying(true);
        }}
        onModalwillHide={async () => {
          await vidRef.current.setPositionAsync(ReturnValue - 100);
          // console.log(ReturnValue);
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
        // swipeDirection={["up", "down", "left", "right"]}
        onSwipeComplete={() => {
          console.log("swipe");
        }}
      >
        <View style={{ height: "83%", backgroundColor: "transparent" }}>
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
