import {
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  useColorScheme,
  Text,
} from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import * as FileSystem from "expo-file-system";
import { FFmpegKit, FFprobeKit } from "ffmpeg-kit-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useNavigation } from "@react-navigation/native";
import {
  faArrowUpRightFromSquare,
  faMicrophone,
} from "@fortawesome/free-solid-svg-icons";
import ShareMenu from "../../../features/Gallery/components/dayView/ShareMenu";
import VideoPlayer from "../components/VideoPlayer";
import { StatusBar, setStatusBarStyle } from "expo-status-bar";
import { OpenFunc } from "../../../features/Gallery/components/dayView/ShareMenu";
import Modal from "react-native-modal";
import { text1, elevatedColor } from "../../../utils/colors";

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

const CameraPlaybackScreen = ({ EditorStatus, setEditorStatus }) => {
  const [ModalVis, setModalVis] = useState(false);
  const [VideoList, setVideoList] = useState([]);
  const [VideoURI, setVideoURI] = useState("");
  const [Loaded, setLoaded] = useState(false);
  const [Started, setStarted] = useState(false);
  const [TryingtoDelete, setTryingtoDelete] = useState(false);
  const [Audio, setAudio] = useState(false);
  const colorScheme = useColorScheme();
  useEffect(() => {
    console.log("eeeeeee");
    const getFiles = async () => {
      let fileEnd = Platform.OS === "ios" ? "m4a" : "mp4";

      const tag = "audio_record" + "." + fileEnd;
      const info = await FileSystem.getInfoAsync(
        FileSystem.documentDirectory + tag
      );
      console.log(info);
      setAudio(info.exists);
    };

    getFiles();
  }, [EditorStatus]);
  const navigation = useNavigation();
  useEffect(() => {
    const getVidSegs = async () => {
      const vidSegsString = await AsyncStorage.getItem("videoSegments");
      const vidSegs = await JSON.parse(vidSegsString);

      // console.log(vidSegs);
      setVideoList(vidSegs);
      setLoaded(true);

      let fileEnd = Platform.OS === "ios" ? "m4a" : "mp4";
      const tag = "audio_record" + "." + fileEnd;
      const info = await FileSystem.getInfoAsync(
        FileSystem.documentDirectory + tag
      );
      setAudio(info.exists);
    };
    getVidSegs();

    return () => {
      setLoaded(false);
    };
  }, []);

  useEffect(() => {
    const onVideoListChange = async () => {
      if (VideoList.length != 0 || Loaded) {
        const textfile = await writeTextFileWithAllAudioFiles(VideoList);

        let listlength = VideoList.length;
        // let StringToText = "";
        // let FilterString = "";
        // // console.log(VideoList.length)
        // for (let i = 0; i < VideoList.length; i++) {
        //   console.log(VideoList[i].uri);
        //   StringToText = StringToText.concat(
        //     "-i " + FileSystem.documentDirectory + VideoList[i].uri + " "
        //   );
        //   FilterString = FilterString.concat(`[${i}:v] [${i}:a] `);
        // }
        const endingTAG = VideoList[0].uri;
        const endingSTR = endingTAG.split(".").pop();
        const outputTAG =
          "DayInTheLife/TodayFinished/" + "finished" + "." + endingSTR;
        const outputFile = FileSystem.documentDirectory + outputTAG;

        FileSystem.deleteAsync(outputFile, { idempotent: true });
        let command = "";
        if (Platform.OS === "android") {
          command = `-f concat -safe 0 -i ${textfile} -v quiet -c:v copy -c:a mp3 ${outputFile}`;
        } else {
          command = `-f concat -safe 0 -i ${textfile} -v quiet -c copy ${outputFile}`;
        }

        // console.log(FileSystem.documentDirectory + VideoList[0].uri);
        const x = await FFmpegKit.execute(command).then(() => {
          setVideoURI(outputTAG);
        });
        const y = await FFprobeKit.execute(
          `-i ${outputFile} -show_entries format=size -v quiet -of csv="p=0"`
        );
      }
    };
    onVideoListChange();
    console.log(VideoList);
  }, [VideoList]);
  useEffect(() => {
    console.log("audio");
  }, [Audio]);

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
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
          onPress={() => {
            if (EditorStatus === "Voiceover" && Started) {
              setTryingtoDelete(true);
            } else {
              navigation.navigate("Nav");
            }
          }}
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
          <TouchableOpacity
            style={[
              buttonStyle(EditorStatus, "Voiceover"),
              Audio && { borderColor: "white", borderWidth: 1 },
            ]}
            onPress={() => {
              if (EditorStatus === "Voiceover") {
                if (Started) {
                  setTryingtoDelete(true);
                } else {
                  setEditorStatus("none");
                }
              } else {
                if (Audio) {
                  setModalVis(true);
                } else {
                  setEditorStatus("Voiceover");
                }
              }
            }}
          >
            <FontAwesomeIcon
              icon={faMicrophone}
              size={22}
              color={EditorStatus === "Voiceover" ? "#000" : "#FFF"}
            ></FontAwesomeIcon>
          </TouchableOpacity>
          {/* <TouchableOpacity
             style={buttonStyle(EditorStatus, "Edit")}
             onPress={() =>{if (EditorStatus === "Edit"){setEditorStatus("none")} else { setEditorStatus("Edit")}}}>
                <FontAwesomeIcon icon={faClapperboard} size={20} color={EditorStatus === "Edit" ?"#000":"#FFF" }></FontAwesomeIcon>

        </TouchableOpacity> */}
        </View>
      </View>
      <View>
        {VideoURI.length > 0 ? (
          <VideoPlayer
            setVideoList={setVideoList}
            navigation={navigation}
            VideoURI={VideoURI}
            videoURIList={VideoList}
            VideoPlaying={true}
            EditorStatus={EditorStatus}
            setEditorStatus={setEditorStatus}
            Started={Started}
            setStarted={setStarted}
            TryingtoDelete={TryingtoDelete}
            setTryingtoDelete={setTryingtoDelete}
          />
        ) : (
          <View></View>
        )}
      </View>
      <Modal
        isVisible={ModalVis}
        useNativeDriverForBackdrop
        onBackdropPress={() => {
          setModalVis(false);
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
            You can only have one voiceover at a time, press Delete to make a
            new voiceover
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
                setModalVis(false);
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
                FileSystem.deleteAsync(FileSystem.documentDirectory + tag);
                setEditorStatus("Voiceover");
                setModalVis(false);
              }}
            >
              <Text
                style={{
                  color: "black",
                  fontFamily: "Sora_400Regular",
                  fontSize: 16,
                }}
              >
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CameraPlaybackScreen;

const styles = StyleSheet.create({});
