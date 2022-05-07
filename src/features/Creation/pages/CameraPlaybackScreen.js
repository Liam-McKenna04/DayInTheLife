import { StyleSheet, View, TouchableOpacity, Platform } from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import * as FileSystem from "expo-file-system";
import { FFmpegKit } from "ffmpeg-kit-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useNavigation } from "@react-navigation/native";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import ShareMenu from "../../../features/Gallery/components/dayView/ShareMenu";
import VideoPlayer from "../components/VideoPlayer";
import { StatusBar, setStatusBarStyle } from "expo-status-bar";
import { OpenFunc } from "../../../features/Gallery/components/dayView/ShareMenu";
// const RNVP = require("react-native-video-processing");
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

  filePaths.forEach((item) => {
    const path = FileSystem.documentDirectory + item.uri;

    fileContent += `file '${path}'\n`;
  });

  const filePath = RNFS.DocumentDirectoryPath + "/audioList.txt";
  try {
    await RNFS.writeFile(filePath, fileContent, "utf8");
    return filePath;
  } catch (error) {
    return error;
  }
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
      let command = "";
      if (Platform.OS === "android") {
        command = `-f concat -safe 0 -i ${textfile} -c:v copy -c:a mp3 ${outputFile}`;
      } else {
        command = `-f concat -safe 0 -i ${textfile} -c copy ${outputFile}`;
      }

      console.log(FileSystem.documentDirectory + VideoList[0].uri);
      const x = await FFmpegKit.execute(command).then(() => {
        setVideoURI(outputTAG);
      });
      // setVideoURI(VideoList[0].uri);
    }
  }, [VideoList]);

  useEffect(() => {
    console.log("a");
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light"></StatusBar>
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
              OpenFunc({ video: VideoURI });
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
        <View></View>
      )}

      {/* <ShareMenu
        ShareVisable={ShareVisable}
        setShareVisable={setShareVisable}
        dayObject={{ video: VideoURI }}
      /> */}
    </View>
  );
};

export default CameraPlaybackScreen;

const styles = StyleSheet.create({});
