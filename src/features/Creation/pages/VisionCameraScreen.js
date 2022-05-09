import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Dimensions,
  Image,
} from "react-native";
import { Camera, useCameraDevices } from "react-native-vision-camera";
import { SafeAreaView } from "react-native-safe-area-context";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  faRotate,
  faCircleCheck,
  faArrowRotateLeft,
  faPenClip,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { v4 as uuid } from "uuid";
import { useNavigation } from "@react-navigation/native";
import { capturePhoto } from "../utils/capturingFunctions/CapturePhoto";
import Svg, { Circle } from "react-native-svg";
import { FontAwesome } from "@expo/vector-icons";
import { FFmpegKit } from "ffmpeg-kit-react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { launchImageLibrary } from "react-native-image-picker";
import AppContext from "../../../../AppContext";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import PermissionDenied from "../components/PermissionDenied";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withTiming,
  multiply,
  Extrapolate,
} from "react-native-reanimated";
import RecordButton from "../utils/animaitons/RecordButton";
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const ReanimatedCamera = Animated.createAnimatedComponent(Camera);
Animated.addWhitelistedNativeProps({ zoom: true });
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
var RNFS = require("react-native-fs");
async function hasAndroidPermission() {
  const permission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

  const hasPermission = await PermissionsAndroid.check(permission);
  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(permission);
  return status === "granted";
}

function VisionCameraScreen({
  Recording,
  setRecording,
  swiperRef,
  currentScreen,
}) {
  const insets = useSafeAreaInsets();

  // First set up animation

  //Timer
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [Delta, setDelta] = useState(0);
  function toggle() {
    setIsActive(!isActive);
  }

  function reset() {
    setSeconds(0);
    setIsActive(false);
  }

  useEffect(() => {
    let interval = null;
    const startTime = new Date().getTime();
    if (isActive) {
      interval = setInterval(() => {
        // console.log(seconds / 10)
        var delta = new Date().getTime() - startTime;

        if (delta / 1000 + VideoLength > MaxVideoLength) {
          stopVideo();
          setIsActive(false);
        }
        if (delta > 600) {
          setDelta(delta / 1000 - 0.6);
        } else {
          setDelta(0);
        }
      }, 0);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
      setDelta(0);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  //Refs
  const navigation = useNavigation();
  const devices = useCameraDevices();
  const [camera, setCamera] = useState(null);
  const [record, setRecord] = useState(null);

  const [CameraHasPermission, setCameraHasPermission] = useState(null);
  const [MicHasPermission, setMicHasPermission] = useState(null);
  const [CameraOrientation, setCameraOrientation] = useState();
  //Options

  const [VideoLength, setVideoLength] = useState(0);
  const [MaxVideoLength, setMaxVideoLength] = useState(60);

  const [Previewable, setPreviewable] = useState(true);
  const [ClickedInButton, setClickedInButton] = useState(false);
  //Video Settings
  const [VideoList, setVideoList] = useState([]);
  const [Loaded, setLoaded] = useState(false);
  const [ShortPressable, setShortPressable] = useState(true);
  let photo = null;
  // console.log(VideoList)
  const { DayObjects, setDayObjects } = useContext(AppContext);

  const zoom = useSharedValue(0);
  const animatedProps = useAnimatedProps(() => ({ zoom: zoom.value }), [zoom]);
  const onDrag = React.useCallback((zoomValue) => {
    zoom.value = zoomValue;
  }, []);

  const cameraButtonStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(!Recording ? 78 : 88, { duration: 100 }),
      height: withTiming(!Recording ? 78 : 88, { duration: 100 }),

      borderWidth: withTiming(!Recording ? 8 : 44, { duration: 100 }),
    };
  });

  useEffect(async () => {
    const vidSegsString = await AsyncStorage.getItem("videoSegments");
    const vidSegs = await JSON.parse(vidSegsString);

    if (vidSegs === null) {
      await AsyncStorage.setItem("videoSegments", "[]");
      setVideoList([]);
    } else {
      // for (let i = vidSegs.length - 1; i > -1; i--){
      // let response = await FileSystem.getInfoAsync(vidSegs[i])
      // if (response.exists === false){
      //   vidSegs.splice(i, 1)
      // }
      // }
      setVideoList(vidSegs);
    }
  }, [DayObjects]);

  useEffect(async () => {
    const vidSegsString = await AsyncStorage.getItem("videoSegments");
    const vidSegs = await JSON.parse(vidSegsString);
    // console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAa")
    if (vidSegs === null) {
      console.log("null");
      await AsyncStorage.setItem("videoSegments", "[]");
      setVideoList([]);
    } else {
      // for (let i = vidSegs.length - 1; i > -1; i--){
      // let response = await FileSystem.getInfoAsync(vidSegs[i])
      // if (response.exists === false){
      //   vidSegs.splice(i, 1)
      // }
      // }
      console.log("VIDSEGS " + vidSegs);

      setVideoList(vidSegs);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    setCameraOrientation(devices.back);
  }, [devices]);

  useEffect(async () => {
    let camStatus = await Camera.getCameraPermissionStatus();
    let micStatus = await Camera.getMicrophonePermissionStatus();
    camStatus = await Camera.requestCameraPermission();
    micStatus = await Camera.requestMicrophonePermission();

    setCameraHasPermission(camStatus === "authorized");
    setMicHasPermission(micStatus === "authorized");
  }, []);

  useEffect(async () => {
    console.log("VIDEOLIST");
    console.log(VideoList);

    const lengths = [];
    for (let i = 0; i < VideoList.length; i++) {
      console.log(VideoList[i]);
      lengths.push(VideoList[i].duration);
    }

    const sum = lengths.reduce((a, b) => a + b, 0);
    setVideoLength(sum);
    setDelta(0);
    await AsyncStorage.setItem("videoSegments", JSON.stringify(VideoList));
    console.log(VideoList);

    // await FFprobeKit.execute(`-v error -show_forma t -show_streams ${VideoList[0].uri}`)
  }, [VideoList]);

  if (CameraHasPermission === null || MicHasPermission === null) {
    //Loading
    return <View />;
  }
  if (CameraHasPermission === false || MicHasPermission === false) {
    //Redirect to settings
    let title = "Enable Camera";
    let text =
      "Please provide us access to your camera, which is required to create days";
    if (CameraHasPermission === true) {
      title = "Enable Microphone";
      text =
        "Please provide us access to your Microphone, which is required to create days";
    }
    return <PermissionDenied text={text} title={title} />;
  }

  const takeVideo = async () => {
    console.log("Maxvidlength: " + MaxVideoLength);
    console.log("vidlength: " + VideoLength);
    if (MaxVideoLength < VideoLength) {
      console.log("TOO LONG");
      return false;
    }
    setIsActive(true);
    setRecording(true);
    const startTime = new Date().getTime();

    await camera.startRecording({
      videoCodec: "h264",
      onRecordingFinished: async (video) => {
        const delta = new Date().getTime() - startTime;
        if (delta < 500) {
          console.log("a");
          setDelta(0);
          reset();
          photo = await camera.takePhoto({ qualityPrioritization: "speed" });
          console.log("photo " + photo.path);
          setRecording(false);
          capturePhoto({
            photo: photo.path,
            imported: false,
            metadata: photo,
            setShortPressable: setShortPressable,
            setVideoList: setVideoList,
            VideoList: VideoList,
          });
          return;
        }
        setRecording(false);

        console.log("VIDEOPATH");
        console.log(video);
        const myUUID = uuid();
        // const fileEnd = await video.path.split('.').pop()
        let fileEnd = "mp4"; // check if this is right on android before releasing
        if (Platform.OS === "ios") {
          fileEnd = "mov";
        }
        const newURI = "DayInTheLife/Today/" + myUUID + "." + fileEnd;
        // await FFmpegKit.execute(`-i ${video.path} -video_track_timescale 60000 ${newURI}`)
        // await FFmpegKit.execute(`-i ${video.path} -preset ultrafast -video_track_timescale 30 ${newURI}`)
        if (Platform.OS === "android") {
          await FFmpegKit.execute(
            `-i ${
              video.path
            } -map 0:0 -map 0:1 -ac 2 -c:a mp3 -ar 48000 -preset ultrafast -video_track_timescale 600 ${
              FileSystem.documentDirectory + newURI
            }`
          );
        } else {
          await RNFS.moveFile(
            video.path,
            FileSystem.documentDirectory + newURI
          );
        }
        setRecord(newURI);
        setVideoList([
          ...VideoList,
          { uri: newURI, type: "video", duration: video.duration },
        ]);

        reset();
        // await FileSystem.deleteAsync(photo.path)
      },
      onRecordingError: async (err) => {
        console.log("a");
        setDelta(0);
        reset();
        photo = await camera.takePhoto({ qualityPrioritization: "speed" });
        console.log("photo " + photo.path);
        setRecording(false);
        capturePhoto({
          photo: photo.path,
          imported: false,
          metadata: photo,
          setShortPressable: setShortPressable,
          setVideoList: setVideoList,
          VideoList: VideoList,
        });
      },
    });

    // reset()
    // setDelta(0)
  };

  const stopVideo = async () => {
    if (ClickedInButton) {
      console.log("video length: " + VideoLength);

      camera.stopRecording().catch(async () => {
        photo = await camera.takePhoto({ qualityPrioritization: "speed" });
        console.log("photo aa" + photo.path);
        capturePhoto({
          photo: photo.path,
          imported: false,
          metadata: photo,
          setShortPressable: setShortPressable,
          setVideoList: setVideoList,
          VideoList: VideoList,
        });
      });

      reset();
      setRecording(false);
    }
  };

  const shutterOpacity = Recording ? 0.5 : 1;

  const size = 128;
  const strokeWidth = 12;

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const alpha = Animated.interpolateNode(VideoLength + Delta, {
    inputRange: [0, MaxVideoLength],

    outputRange: [Math.PI * 2, 0],
    extrapolate: Extrapolate.CLAMP,
  });
  const strokeDashoffset = multiply(alpha, radius);

  return (
    <View
      style={{ flex: 1, width: "100%", justifyContent: "space-between" }}
      onStartShouldSetResponder={async (evt) => {
        const center = windowWidth / 2;
        const X = evt.nativeEvent.pageX;
        const Y = evt.nativeEvent.pageY;

        const buttonBottom = windowHeight - (65 + insets.bottom);
        // console.log(Y)
        // console.log(buttonBottom)

        if (
          X > center - 60 &&
          X < center + 60 &&
          Y < buttonBottom &&
          Y > buttonBottom - 120
        ) {
          setClickedInButton(true);
          setRecording(true);
          await takeVideo();
        }
        return true;
      }}
      onResponderRelease={async () => {
        stopVideo();
        setClickedInButton(false);
        zoom.value = 1;
      }}
      onMoveShouldSetResponder={() => true}
      onResponderMove={(evt) => {
        if (ClickedInButton) {
          // console.log(evt.nativeEvent.pageY)
          const buttonBottom = windowHeight - (65 + insets.bottom);

          const y =
            1 +
            evt.nativeEvent.pageY *
              ((16 - 1) / (windowHeight - (60 + 65 + insets.bottom)));
          console.log(y);
          // setZoom(Math.max(16 - y, 1))
          onDrag(Math.max(16 - y, 1));
        }
      }}
    >
      {(navigation.isFocused() && currentScreen === 0) ||
      Platform.OS === "ios" ? (
        <ReanimatedCamera
          ref={(ref) => setCamera(ref)}
          style={{
            flex: 1,
            width: "100%",
            justifyContent: "space-between",
            position: "absolute",
            height: "100%",
          }}
          animatedProps={animatedProps}
          video={true}
          photo={true}
          audio={true}
          isActive={true}
          device={CameraOrientation}
          fps={30}
        ></ReanimatedCamera>
      ) : (
        <View style={{ backgroundColor: "black" }} />
      )}

      {/* <StatusBar style='light'></StatusBar> */}

      <SafeAreaView
        style={{ flex: 1, width: "100%", justifyContent: "space-between" }}
      >
        <View
          style={{
            justifyContent: "space-between",
            flexDirection: "row",
            marginTop: 5,
            marginHorizontal: 25,
          }}
        >
          {!Recording ? (
            <TouchableOpacity
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                backgroundColor: "rgba(0,0,0,0.2)",
                borderRadius: 50,
              }}
              onPress={() => navigation.navigate("GalleryNav")}
            >
              <FontAwesome name={"arrow-left"} size={24} color="#FFF" />
            </TouchableOpacity>
          ) : (
            <View />
          )}
          {!Recording ? (
            <TouchableOpacity
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                backgroundColor: "rgba(0,0,0,0.2)",
                borderRadius: 50,
              }}
              onPress={() => {
                setCameraOrientation(
                  CameraOrientation === devices.back
                    ? devices.front
                    : devices.back
                );
              }}
            >
              <FontAwesomeIcon
                icon={faRotate}
                size={24}
                color="#FFF"
              ></FontAwesomeIcon>
            </TouchableOpacity>
          ) : (
            <View />
          )}
        </View>

        {Previewable ? (
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 65,
              marginLeft: 20,
              marginRight: 20,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                flex: 1,
                justifyContent: "flex-end",
              }}
            >
              {!Recording ? (
                <TouchableOpacity
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    width: 40,
                    height: 40,
                    backgroundColor: "rgba(0,0,0,0.2)",
                    borderRadius: 50,
                  }}
                  onPress={async () => {
                    setPreviewable(false);
                    console.log(MaxVideoLength - VideoLength);
                    const result = await launchImageLibrary({
                      mediaType: "mixed",
                    }).catch((err) => {
                      console.log(err);
                    });
                    if (result.didCancel) {
                      setPreviewable(true);
                    }
                    if (result.assets) {
                      if (
                        result.assets[0].duration >
                        MaxVideoLength - VideoLength
                      ) {
                        console.log("Too long");
                        return;
                      }
                      if (result.assets[0].type.includes("image")) {
                        capturePhoto({
                          photo: result.assets[0].uri,
                          imported: true,
                          metadata: result.assets[0],
                          setShortPressable: setShortPressable,
                          setVideoList: setVideoList,
                          VideoList: VideoList,
                        });
                      } else if (result.assets[0].type.includes("video")) {
                        console.log(result.assets[0]);
                        console.log("------------------------");
                        const myUuid = uuid();
                        let fileEnd = "mov";
                        let begin = "";
                        if (Platform.OS === "android") {
                          fileEnd = "mp4";
                          begin = "file:";
                        }
                        const newTag =
                          "DayInTheLife/Today/" + myUuid + "." + fileEnd;
                        const newURI = FileSystem.documentDirectory + newTag;

                        await FFmpegKit.execute(
                          `-i ${
                            begin + result.assets[0].uri
                          } -preset ultrafast -c:a mp3 -vf format=yuv420p,scale=1080x1920 -video_track_timescale 600 ${newURI}`
                        );

                        // await RNFS.moveFile(result.assets[0].uri, newURI)

                        setVideoList([
                          ...VideoList,
                          {
                            uri: newTag,
                            type: "importedVideo",
                            duration: result.assets[0].duration,
                          },
                        ]);
                      }
                      console.log(result);
                      setPreviewable(true);
                    }
                  }}
                >
                  <FontAwesomeIcon
                    icon={faPlus}
                    size={22}
                    color="#FFF"
                  ></FontAwesomeIcon>
                </TouchableOpacity>
              ) : (
                <View />
              )}
              {!Recording ? (
                <TouchableOpacity
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    width: 40,
                    height: 40,
                    backgroundColor: "rgba(0,0,0,0.2)",
                    borderRadius: 50,
                    marginLeft: 25,
                    marginRight: 10,
                  }}
                  onPress={() => {
                    if (swiperRef.current) {
                      swiperRef.current.scrollBy(1, true);
                    }
                  }}
                >
                  <FontAwesomeIcon
                    icon={faPenClip}
                    size={22}
                    color="#FFF"
                  ></FontAwesomeIcon>
                </TouchableOpacity>
              ) : (
                <View />
              )}
            </View>

            <View
              style={{
                width: 120,
                height: 120,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "transparent",
              }}
              pointerEvents="none"
            >
              {
                <Svg
                  style={{ transform: [{ rotateZ: "270deg" }] }}
                  width={size}
                  height={size}
                >
                  <AnimatedCircle
                    strokeLinecap="round"
                    stroke={
                      Delta != 0 || VideoList.length > 0
                        ? "#00468B"
                        : "transparent"
                    }
                    fill="none"
                    cy={size / 2}
                    cx={size / 2}
                    r={radius}
                    strokeDashoffset={strokeDashoffset}
                    strokeDasharray={`${circumference} ${circumference}`}
                    {...{ strokeWidth }}
                  ></AnimatedCircle>
                  {/* <Path d={`M64 64 L75 75`} fill="none" stroke="red"/> */}
                </Svg>
              }

              <Animated.View
                style={[
                  cameraButtonStyle,
                  {
                    backgroundColor: "transparent",
                    position: "absolute",
                    borderColor: "white",
                    borderRadius: 100,
                    opacity: shutterOpacity,
                  },
                ]}
              ></Animated.View>
            </View>

            <View
              style={{
                flexDirection: "row",
                flex: 1,
                justifyContent: "flex-start",
              }}
            >
              {Previewable && VideoList.length > 0 && !Recording ? (
                <TouchableOpacity
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    width: 40,
                    height: 40,
                    backgroundColor: "rgba(0,0,0,0.2)",
                    borderRadius: 50,
                    marginLeft: 10,
                    marginRight: 25,
                  }}
                  onPress={async () => {
                    if (ShortPressable) {
                      console.log(VideoList);
                      const uriToDelete = VideoList[VideoList.length - 1];
                      if (VideoList.length > 0) {
                        setVideoList(VideoList.slice(0, -1));
                      }
                      await FileSystem.deleteAsync(
                        FileSystem.documentDirectory + uriToDelete,
                        { idempotent: true }
                      ).catch(() => console.log("no more videos to delete :)"));
                    }
                  }}
                >
                  <FontAwesomeIcon
                    icon={faArrowRotateLeft}
                    size={24}
                    color="#FFF"
                  ></FontAwesomeIcon>
                </TouchableOpacity>
              ) : (
                <View />
              )}

              {Previewable && VideoList.length > 0 && !Recording ? (
                <Pressable
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    width: 40,
                    height: 40,
                    backgroundColor: "rgba(0,0,0,0.2)",
                    borderRadius: 50,
                  }}
                  onPress={() => {
                    if (ShortPressable) {
                      navigation.navigate("PlaybackNav");
                    }
                  }}
                >
                  <FontAwesomeIcon
                    icon={faCircleCheck}
                    size={24}
                    color="#FFF"
                  ></FontAwesomeIcon>
                </Pressable>
              ) : (
                <View />
              )}
            </View>
          </View>
        ) : (
          <View
            style={{
              justifyContent: "center",
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 80,
            }}
          >
            <Text
              style={{
                color: "white",
                fontFamily: "Sora_600SemiBold",
                fontSize: 20,
              }}
            >
              Loading...
            </Text>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}
export default VisionCameraScreen;

const styles = StyleSheet.create({
  exampleStyle: { flex: 1, alignItems: "center", justifyContent: "center" },
  press: {
    backgroundColor: "#00468B",
    width: "89%",
    marginTop: 22,
    marginLeft: 20,
    height: 66,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
  },
});
