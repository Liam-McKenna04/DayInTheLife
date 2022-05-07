import { View, TouchableOpacity } from "react-native";
import React from "react";
import { useRef, useState } from "react";
import { Video } from "expo-av";
import * as FileSystem from "expo-file-system";
import { useFocusEffect } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Slider } from "@miblanchard/react-native-slider";
import {
  faPause,
  faVolumeMute,
  faPlay,
  faVolumeHigh,
} from "@fortawesome/free-solid-svg-icons";
const VideoPlayer = ({ VideoURI }) => {
  const video = useRef(null);
  const [status, setStatus] = useState({});
  const [shouldPlay, setShouldPlay] = useState(true);
  // console.log(VideoURI)

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      setShouldPlay(true);
      return () => {
        setShouldPlay(false);
      };
    }, [])
  );

  return (
    <View style={{ flex: 1, backgroundColor: "black", alignItems: "center" }}>
      <Video
        ref={video}
        style={{
          height: "100%",
          aspectRatio: 9 / 16,
          position: "absolute",
          display: "flex",
        }}
        source={{
          uri: FileSystem.documentDirectory + VideoURI,
        }}
        useNativeControls={false}
        resizeMode="cover"
        // isLooping={true}
        shouldPlay={shouldPlay}
        progressUpdateIntervalMillis={50}
        onPlaybackStatusUpdate={(status) => {
          if (status.didJustFinish && !status.isLooping) {
            if (video) {
              video.current.playFromPositionAsync(0);
              video.current.setIsLoopingAsync(true);
            }
          }

          setStatus(() => status);
        }}
      />
      <View
        style={{
          position: "absolute",
          bottom: 15,
          zIndex: 1,
          height: 100,
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Slider
          disabled={true}
          maximumValue={status.durationMillis}
          trackStyle={{ backgroundColor: "white", height: 10, borderRadius: 3 }}
          minimumTrackTintColor="#00468B"
          renderThumbComponent={() => {
            <View />;
          }}
          animateTransitions={false}
          animationType="timing"
          value={status.positionMillis}
          containerStyle={{ width: "60%", marginHorizontal: 10 }}
        ></Slider>
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
    </View>
  );
};

export default VideoPlayer;
