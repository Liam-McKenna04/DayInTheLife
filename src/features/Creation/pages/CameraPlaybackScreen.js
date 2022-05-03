import {
  StyleSheet,
  Text,
  View,
  Button,
  Pressable,
  TouchableOpacity,
  Platform,
} from "react-native";
import React from "react";
import { useRef, useState, useEffect } from "react";
import { Audio, Video } from "expo-av";
import * as FileSystem from "expo-file-system";
import { SafeAreaView } from "react-native-safe-area-context";
import * as MediaLibrary from "expo-media-library";
import { FFmpegKit, FFprobeKit } from "ffmpeg-kit-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Slider } from "@miblanchard/react-native-slider";
import { useNavigation } from "@react-navigation/native";
import { DateTime } from "luxon";
import { v4 as uuid } from "uuid";
import {
  faPenToSquare,
  faRotate,
  faNoteSticky,
  faCircleCheck,
  faArrowRotateLeft,
  faPen,
  faPenClip,
  faEye,
  faPause,
  faVolumeMute,
  faPlay,
  faVolumeHigh,
  faMicrophone,
  faClapperboard,
  faShare,
  faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import ShareMenu from "../../../features/Gallery/components/dayView/ShareMenu";

var RNFS = require("react-native-fs");

const writeTextFileWithAllAudioFiles = async (filePaths) => {
  var fileContent = "";
  const exists = await RNFS.exists(
    RNFS.DocumentDirectoryPath + "/audioList.txt"
  );
  console.log(exists);
  if (exists) {
    await RNFS.unlink(RNFS.DocumentDirectoryPath + "/audioList.txt").catch(
      (e) => console.log("f")
    );
  }
  // if (Platform.OS == "android"){
  // for (let i = 0 ; i < filePaths.length; i++){
  //   console.log(filePaths)
  //   const id = uuid()
  //   const path = FileSystem.documentDirectory + "vid" + id + ".ts"
  //   const prePath = FileSystem.documentDirectory + filePaths[i].uri

  //   console.log(path)
  //   console.log(prePath)
  //   await FFmpegKit.execute(`-i ${prePath} -codec copy -bsf:v h264_mp4toannexb ${path}`)
  //   fileContent+= `file '${path}'\n`

  //   }
  // } else {
  filePaths.forEach((item) => {
    console.log("ITEM ITEM");
    FFmpegKit.execute(`-i ${FileSystem.documentDirectory + item.uri} -f null`);
    // console.log(path)
    const path = FileSystem.documentDirectory + item.uri;
    fileContent += `file '${path}'\n`;
  });
  // }

  const filePath = RNFS.DocumentDirectoryPath + "/audioList.txt";
  try {
    await RNFS.writeFile(filePath, fileContent, "utf8");
    return filePath;
  } catch (error) {
    return error;
  }
};

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
        rate={1}
        useNativeControls={false}
        resizeMode="cover"
        isLooping={true}
        shouldPlay={shouldPlay}
        progressUpdateIntervalMillis={50}
        onPlaybackStatusUpdate={(status) => setStatus(() => status)}
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

const buttonStyle = (EditorStatus, setting) => {
  if (EditorStatus === setting) {
    return {
      alignItems: "center",
      justifyContent: "center",
      width: 40,
      height: 40,
      backgroundColor: "rgba(255,255,255,1)",
      borderRadius: 50,
      marginBottom: 15,
    };
  } else {
    return {
      alignItems: "center",
      justifyContent: "center",
      width: 40,
      height: 40,
      backgroundColor: "rgba(0,0,0,0.2)",
      borderRadius: 50,
      marginBottom: 15,
    };
  }
};

const CameraPlaybackScreen = () => {
  const [ShareVisable, setShareVisable] = useState(false);
  const [VideoList, setVideoList] = useState([]);
  const [VideoURI, setVideoURI] = useState("");
  const [Loaded, setLoaded] = useState(false);
  const navigation = useNavigation();
  const [EditorStatus, setEditorStatus] = useState("none");
  useEffect(async () => {
    const vidSegsString = await AsyncStorage.getItem("videoSegments");
    const vidSegs = await JSON.parse(vidSegsString);

    console.log(vidSegs);
    setVideoList(vidSegs);
    setLoaded(true);
  }, []);

  useEffect(() => {
    console.log("VIDEOURI CHANGED");
    console.log(VideoURI);
  }, [VideoURI]);

  useEffect(async () => {
    if (VideoList.length != 0 || Loaded) {
      const textfile = await writeTextFileWithAllAudioFiles(VideoList);

      let listlength = VideoList.length;
      let StringToText = "";
      let FilterString = "";
      // console.log(VideoList.length)
      for (let i = 0; i < VideoList.length; i++) {
        console.log(VideoList[i].uri);
        StringToText = StringToText.concat(
          "-i " + FileSystem.documentDirectory + VideoList[i].uri + " "
        );
        FilterString = FilterString.concat(`[${i}:v] [${i}:a] `);
      }
      const endingTAG = VideoList[0].uri;
      const endingSTR = endingTAG.split(".").pop();
      const outputTAG =
        "DayInTheLife/TodayFinished/" + "finished" + "." + endingSTR;
      const outputFile = FileSystem.documentDirectory + outputTAG;

      FileSystem.deleteAsync(outputFile, { idempotent: true });

      const command = `-f concat -safe 0 -i ${textfile} -c:v copy -c:a aac ${outputFile}`;
      // console.log('aaaaaaaaaaaaaaaaaaa')

      // await FFprobeKit.execute(`-v error -select_streams v:0 -show_entries stream=codec_name -of default=noprint_wrappers=1:nokey=1 ${VideoList[1]}`)
      // await FFprobeKit.execute(`-v error -show_entries stream=width,height -of default=noprint_wrappers=1 ${VideoList[1]}`)
      // await FFprobeKit.execute(`-v error -select_streams v:0 -show_entries stream=avg_frame_rate -of default=noprint_wrappers=1:nokey=1 ${VideoList[0]}`)

      const x = await FFmpegKit.execute(command).then(() => {
        setVideoURI(outputTAG);
      });
    }
  }, [VideoList]);

  useEffect(() => {
    console.log("a");
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          height: 150,
          width: "100%",
          flexDirection: "row",
          alignItems: "flex-start",
          marginTop: 50,
          position: "absolute",
          zIndex: 1,
          paddingHorizontal: 25,
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
            backgroundColor: "rgba(0,0,0,0.2)",
            borderRadius: 50,
          }}
          onPress={() => navigation.navigate("Nav")}
        >
          <FontAwesome name={"arrow-left"} size={24} color="#FFF" />
        </TouchableOpacity>
        <View>
          <TouchableOpacity
            style={buttonStyle(EditorStatus, "Preview")}
            onPress={async () => {
              setShareVisable(true);
            }}
          >
            <FontAwesomeIcon
              icon={faArrowUpRightFromSquare}
              size={21}
              color={EditorStatus === "Preview" ? "#000" : "#FFF"}
            ></FontAwesomeIcon>
          </TouchableOpacity>
          {/* <TouchableOpacity
             style={buttonStyle(EditorStatus, "Voiceover")}
             onPress={() =>{if (EditorStatus === "Voiceover"){setEditorStatus("none")} else { setEditorStatus("Voiceover")}}}>
                <FontAwesomeIcon icon={faMicrophone} size={22} color={EditorStatus === "Voiceover" ?"#000":"#FFF" }></FontAwesomeIcon>

        </TouchableOpacity>
        <TouchableOpacity
             style={buttonStyle(EditorStatus, "Edit")}
             onPress={() =>{if (EditorStatus === "Edit"){setEditorStatus("none")} else { setEditorStatus("Edit")}}}>
                <FontAwesomeIcon icon={faClapperboard} size={20} color={EditorStatus === "Edit" ?"#000":"#FFF" }></FontAwesomeIcon>

        </TouchableOpacity> */}
        </View>
      </View>
      {VideoURI.length > 0 ? (
        <VideoPlayer
          setVideoList={setVideoList}
          navigation={navigation}
          VideoURI={VideoURI}
          videoURIList={VideoList}
          VideoPlaying={true}
        />
      ) : (
        <View>
          <Text style={{ color: "white" }}>You shouldn't be reading this</Text>
        </View>
      )}

      <ShareMenu
        ShareVisable={ShareVisable}
        setShareVisable={setShareVisable}
        dayObject={{ video: VideoURI }}
      />
    </View>
  );
};

export default CameraPlaybackScreen;

const styles = StyleSheet.create({});
