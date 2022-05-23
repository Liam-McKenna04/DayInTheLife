import {
  View,
  TouchableOpacity,
  Text,
  Pressable,
  Dimensions,
  Platform,
  useColorScheme,
} from "react-native";
import React from "react";
import { useRef, useState, useEffect, useLayoutEffect } from "react";
import { Video, Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { useFocusEffect } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Slider } from "@miblanchard/react-native-slider";
import {
  faPause,
  faVolumeMute,
  faPlay,
  faVolumeHigh,
  faX,
  faCheckCircle,
  faRotateBack,
  faCheck,
  faMicrophone,
} from "@fortawesome/free-solid-svg-icons";
import Svg, { Circle, Path } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withTiming,
  multiply,
  Extrapolate,
} from "react-native-reanimated";
import { v4 as uuid } from "uuid";
import Modal from "react-native-modal";
import { text1, elevatedColor, surfaceColor } from "../../../utils/colors";

const VideoPlayer = ({
  VideoURI,
  videoURIList,
  dayComponent,
  setExpandedVideoShown,
  setVideoPlaying,
  vidRefIncoming,
  setReturnValue,
  EditorStatus,
  setEditorStatus,
  Started,
  setStarted,
  TryingtoDelete,
  setTryingtoDelete,
}) => {
  const colorScheme = useColorScheme();

  const video = useRef(null);
  const slider = useRef(null);
  const [status, setStatus] = useState({});
  const [shouldPlay, setShouldPlay] = useState(false);
  const [DurationTicks, setDurationTicks] = useState([]);
  const [OriginalAudioMuted, setOriginalAudioMuted] = useState(true);
  const [AudioRecording, setAudioRecording] = useState();
  // console.log(slider?.current?._containerSize?.width);
  let fileEnd = Platform.OS === "ios" ? "m4a" : "mp4";
  const tag = "audio_record" + "." + fileEnd;
  const [Recording, setRecording] = useState(false);
  const cameraButtonStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(!Recording ? 78 : 88, { duration: 100 }),
      height: withTiming(!Recording ? 78 : 88, { duration: 100 }),

      borderWidth: withTiming(!Recording ? 8 : 44, { duration: 100 }),
    };
  });
  // console.log(videoURIList);
  const shutterOpacity = Recording ? 0.5 : 1;

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      // console.log(EditorStatus);
      // if (EditorStatus === "none") {
      //   // setShouldPlay(false);
      //   video.current.playAsync();
      // }
      if (EditorStatus) {
        setEditorStatus("none");
      }
      console.log("e");
      video.current.playAsync();
      return () => {
        video?.current?.pauseAsync();
      };
    }, [])
  );
  useEffect(() => {
    if (EditorStatus === "Voiceover") {
      console.log("a");
      video.current.pauseAsync();
      video.current.setPositionAsync(0);
    } else {
      video.current.playAsync();
      video.current.setPositionAsync(0);
    }
  }, [EditorStatus]);
  useEffect(() => {
    let positions = videoURIList.map((value, index) => {
      // console.log(value);

      const computedPositionList = [];
      for (let i = index; i >= 0; i--) {
        const ClipDuration = videoURIList[i].duration;
        const FullDuration = status?.durationMillis / 1000;
        const PercentLength = ClipDuration / FullDuration;
        const onePosition =
          PercentLength * slider?.current?._containerSize?.width;
        computedPositionList.push(onePosition);
      }
      const computedPosition = computedPositionList.reduce(
        (partialSum, a) => partialSum + a,
        0
      );
      if (computedPosition) {
        // console.log(computedPosition);
        return { position: computedPosition, id: uuid() };
      }
    });

    setDurationTicks(positions);
  }, [status?.durationMillis]);

  useLayoutEffect(() => {
    const VidPlayerStartup = async () => {
      // console.log(vidRefIncoming);
      if (vidRefIncoming) {
        const { positionMillis } =
          await vidRefIncoming.current.getStatusAsync();
        console.log(positionMillis);
        await video.current.setPositionAsync(positionMillis);
        // console.log(video);
      }
    };
    VidPlayerStartup();
  }, []);
  return (
    <View
      style={[
        {
          backgroundColor: "black",
          alignItems: "center",
          width: "100%",
          height: "100%",
        },
        dayComponent && { borderRadius: 10 },
      ]}
    >
      <Video
        ref={video}
        style={[
          {
            height: "100%",
            aspectRatio: 9 / 16,
            position: "absolute",
            display: "flex",
          },
          dayComponent && { borderRadius: 10 },
        ]}
        source={{
          uri: FileSystem.documentDirectory + VideoURI,
        }}
        useNativeControls={false}
        resizeMode="cover"
        // isLooping={true}
        shouldPlay={shouldPlay}
        progressUpdateIntervalMillis={20}
        onPlaybackStatusUpdate={async (status) => {
          if (status.positionMillis === 0) {
            // setStarted(true);

            if (Started != undefined) {
              setStarted(false);
            }
          }
          if (status.didJustFinish && !status.isLooping) {
            if (video) {
              video.current.playFromPositionAsync(0);
              video.current.setIsLoopingAsync(true);
            }
          }

          setStatus(() => status);
          if (dayComponent) {
            setReturnValue(status.positionMillis);
          }
        }}
      />
      {dayComponent ? (
        <View
          style={{
            position: "absolute",
            height: 100,
            width: "100%",
            // backgroundColor: "red",
            zIndex: 2,
            display: "flex",
            alignItems: "flex-end",
            top: 10,
          }}
        >
          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              backgroundColor: "rgba(0,0,0,0.5)",
              borderRadius: 50,
              marginLeft: 10,
            }}
            onPress={() => {
              setExpandedVideoShown(false);
              setVideoPlaying(true);
            }}
          >
            <FontAwesomeIcon
              icon={faX}
              size={22}
              color="#FFF"
            ></FontAwesomeIcon>
          </TouchableOpacity>
        </View>
      ) : null}
      {!(EditorStatus === "Voiceover") ? (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            zIndex: 2,
            height: 100,
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            // backgroundColor: "red",
          }}
        >
          <Slider
            disabled={true}
            ref={slider}
            maximumValue={status.durationMillis}
            trackStyle={{
              backgroundColor: "rgba(255,255,255,0.4)",
              height: 10,
              borderRadius: 3,
            }}
            minimumTrackTintColor="#00468B"
            renderThumbComponent={() => {
              <View />;
            }}
            animateTransitions={false}
            animationType="timing"
            value={status.positionMillis}
            containerStyle={{ width: "60%", marginHorizontal: 10 }}
          ></Slider>

          {DurationTicks?.map((value, index) => {
            // console.log(value);

            if (!isNaN(value?.position) && index != DurationTicks.length - 1) {
              return (
                <View
                  key={value.id}
                  style={{
                    position: "absolute",
                    height: 10,
                    width: 3,
                    backgroundColor: "white",
                    left: 10 + value?.position,
                    zIndex: 1,
                  }}
                />
              );
            } else return <View />;
          })}
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginRight: 20,
              marginLeft: 10,
            }}
          >
            <TouchableOpacity
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                backgroundColor: "rgba(0,0,0,0.5)",
                borderRadius: 50,
                marginLeft: 10,
              }}
              onPress={async () => {
                if (status.isPlaying) {
                  await video.current.pauseAsync();
                } else {
                  await video.current.playAsync();
                }
              }}
            >
              {status.isPlaying ? (
                <FontAwesomeIcon
                  icon={faPause}
                  size={22}
                  color="#FFF"
                ></FontAwesomeIcon>
              ) : (
                <FontAwesomeIcon
                  icon={faPlay}
                  size={22}
                  color="#FFF"
                ></FontAwesomeIcon>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                backgroundColor: "rgba(0,0,0,0.5)",
                borderRadius: 50,
                marginLeft: 10,
              }}
              onPress={async () => {
                if (status.isMuted) {
                  await video.current.setIsMutedAsync(false);
                } else {
                  await video.current.setIsMutedAsync(true);
                }
              }}
            >
              {status.isMuted ? (
                <FontAwesomeIcon
                  icon={faVolumeMute}
                  size={22}
                  color="#FFF"
                ></FontAwesomeIcon>
              ) : (
                <FontAwesomeIcon
                  icon={faVolumeHigh}
                  size={22}
                  color="#FFF"
                ></FontAwesomeIcon>
              )}
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            zIndex: 2,
            height: 100,
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            // backgroundColor: "red",
          }}
        >
          {Recording || !Started ? (
            <Pressable
              style={{
                width: 120,
                height: 120,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "transparent",
                bottom: 110,
                left: Dimensions.get("window").width / 2 - 60,
              }}
              onPressIn={async () => {
                setRecording(true);
                setShouldPlay(true);
                let fileEnd = Platform.OS === "ios" ? "m4a" : "mp4";
                const tag = "audio_record" + "." + fileEnd;
                await FileSystem.deleteAsync(
                  FileSystem.documentDirectory + tag,
                  { idempotent: true }
                ).catch(() => {});
                await Audio.setAudioModeAsync({
                  allowsRecordingIOS: true,
                  playsInSilentModeIOS: true,
                });
                const { recording } = await Audio.Recording.createAsync(
                  Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
                );
                setAudioRecording(recording);
              }}
              onPressOut={async () => {
                setRecording(false);
                setShouldPlay(false);
                setStarted(true);
                console.log(AudioRecording);
                await AudioRecording.stopAndUnloadAsync();
                const uri = AudioRecording.getURI();
                let fileEnd = Platform.OS === "ios" ? "m4a" : "mp4";
                const tag = "audio_record" + "." + fileEnd;
                await FileSystem.moveAsync({
                  from: uri,
                  to: FileSystem.documentDirectory + tag,
                });
                setAudioRecording(undefined);
                // console.log("Recording stopped and stored at", uri);

                // video.current.setPositionAsync(0);
              }}
            >
              <Animated.View
                style={[
                  cameraButtonStyle,
                  {
                    backgroundColor: "transparent",
                    position: "absolute",
                    borderColor: "white",
                    borderRadius: 100,
                    opacity: shutterOpacity,
                    justifyContent: "center",
                    alignItems: "center",
                  },
                ]}
              >
                <FontAwesomeIcon
                  icon={faMicrophone}
                  size={22}
                  color="#FFF"
                ></FontAwesomeIcon>
              </Animated.View>
            </Pressable>
          ) : null}
          <View
            style={{
              position: "absolute",
              bottom: 0,
              zIndex: 2,
              height: 70,
              width: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              // backgroundColor: "red",
            }}
          >
            <Slider
              disabled={true}
              ref={slider}
              maximumValue={status.durationMillis}
              trackStyle={{
                backgroundColor: "rgba(255,255,255,0.4)",
                height: 10,
                borderRadius: 3,
              }}
              minimumTrackTintColor="#00468B"
              renderThumbComponent={() => {
                <View />;
              }}
              animateTransitions={false}
              animationType="timing"
              value={status.positionMillis}
              containerStyle={{ width: "60%", marginHorizontal: 10 }}
            ></Slider>
            {DurationTicks?.map((value, index) => {
              // console.log(value);

              if (
                !isNaN(value?.position) &&
                index != DurationTicks.length - 1
              ) {
                return (
                  <View
                    key={value.id}
                    style={{
                      position: "absolute",
                      height: 10,
                      width: 3,
                      backgroundColor: "white",
                      left: 10 + value?.position,
                      top: 15,
                      zIndex: 1,
                    }}
                  />
                );
              } else return <View />;
            })}

            <TouchableOpacity
              style={[
                {
                  alignItems: "center",
                  justifyContent: "center",
                  width: 40,
                  height: 40,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  borderRadius: 50,
                  marginLeft: 20,
                  display: "none",
                },
                Started && { display: "flex" },
              ]}
              onPress={() => {
                if (!Recording) video.current.setPositionAsync(0);
              }}
            >
              <FontAwesomeIcon
                icon={faRotateBack}
                size={22}
                color="#FFF"
              ></FontAwesomeIcon>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                {
                  alignItems: "center",
                  justifyContent: "center",
                  width: 40,
                  height: 40,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  borderRadius: 50,
                  marginLeft: 20,
                  display: "none",
                },
                Started && { display: "flex" },
              ]}
              onPress={() => {
                if (!Recording && EditorStatus) {
                  setEditorStatus("none");
                  video.current.setPositionAsync(0);
                }
              }}
            >
              <FontAwesomeIcon
                icon={faCheckCircle}
                size={22}
                color="#FFF"
              ></FontAwesomeIcon>
            </TouchableOpacity>
          </View>
          {true ? (
            <View
              style={{
                width: "100%",
                bottom: 80,
                flexDirection: "row",
                position: "absolute",
                // alignItems: "flex-end",
              }}
            >
              <TouchableOpacity
                style={[
                  {
                    borderWidth: 1,
                    borderColor: "white",
                    // backgroundColor: "#00468B",
                    borderRadius: 5,
                    marginLeft: 15,
                    width: 30,
                    height: 30,
                    justifyContent: "center",
                    alignItems: "center",
                  },
                  OriginalAudioMuted && { backgroundColor: "#00468B" },
                ]}
                onPress={async () => {
                  setOriginalAudioMuted(!OriginalAudioMuted);
                  if (status.isMuted) {
                    await video.current.setIsMutedAsync(false);
                  } else {
                    await video.current.setIsMutedAsync(true);
                  }
                }}
              >
                {OriginalAudioMuted ? (
                  <FontAwesomeIcon
                    icon={faCheck}
                    size={22}
                    color="#FFF"
                  ></FontAwesomeIcon>
                ) : null}
              </TouchableOpacity>
              <Text
                style={{
                  fontFamily: "Sora_600SemiBold",
                  fontSize: 14,
                  color: "white",
                  top: 6.3,
                  left: 6,
                }}
              >
                Keep Original Sound
              </Text>
            </View>
          ) : null}
        </View>
      )}
      <Modal
        isVisible={TryingtoDelete}
        useNativeDriverForBackdrop
        onBackdropPress={() => {
          setTryingtoDelete(false);
        }}
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
        backdropOpacity={0.4}
      >
        <View
          style={{
            height: 250,
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
            Are you sure you want to abandon this voiceover?
          </Text>
          <Text
            style={{
              color: text1(colorScheme),
              fontFamily: "Sora_400Regular",
              fontSize: 16,
            }}
          >
            Please press the check if you want to save your voiceover, pressing
            Delete will remove your voiceover
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
                setTryingtoDelete(false);
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
                let fileEnd = Platform.OS === "ios" ? "m4a" : "mp4";
                const tag = "audio_record" + "." + fileEnd;
                await FileSystem.deleteAsync(
                  FileSystem.documentDirectory + tag,
                  { idempotent: true }
                );
                video.current.pauseAsync();
                video.current.setPositionAsync(0);
                setStarted(false);
                setEditorStatus("none");
                setTryingtoDelete(false);
              }}
            >
              <Text
                style={{
                  color: "black",
                  fontFamily: "Sora_400Regular",
                  fontSize: 16,
                }}
              >
                Delete Voiceover
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default VideoPlayer;
