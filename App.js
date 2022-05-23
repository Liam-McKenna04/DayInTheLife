import * as React from "react";
import { useState, useEffect, useRef } from "react";
import * as FileSystem from "expo-file-system";
import { v4 as uuid } from "uuid";

import { NavigationContainer } from "@react-navigation/native";

import {
  useFonts,
  Sora_400Regular,
  Sora_600SemiBold,
} from "@expo-google-fonts/sora";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createDirectory, CreateToday, GetToday } from "./utility";
import { DateTime } from "luxon";
import Midnight from "react-native-midnight";
import { FFmpegKit } from "ffmpeg-kit-react-native";
import AppContext from "./AppContext";
import { Platform, View, Text, Appearance, AppState } from "react-native";
import Navigation from "./src/navigation/Navigation";
var RNFS = require("react-native-fs");
import { getTrackingStatus } from "react-native-tracking-transparency";
const schedule = require("node-schedule");
import * as SplashScreen from "expo-splash-screen";
import AppLoading from "expo-app-loading";
import Modal from "react-native-modal";
import { text1, elevatedColor } from "./src/utils/colors";
import { Video, AVPlaybackStatus, Audio } from "expo-av";
if (!__DEV__) {
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
}

const writeTextFileWithAllVidFiles = async (filePaths) => {
  var fileContent = "";
  await RNFS.unlink(RNFS.DocumentDirectoryPath + "/audioList.txt", {
    idempotent: true,
  }).catch((err) => {
    console.log(err.message);
  });
  filePaths.forEach((item) => {
    // console.log(path)
    const path = item.uri;
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

const newDay = async ({ setDayObjects, setDayDownloading }) => {
  console.log("NEW DAY");
  const todaySTR = await AsyncStorage.getItem("today");
  const today = todaySTR != null ? JSON.parse(todaySTR) : [];

  const vidSegsString = await AsyncStorage.getItem("videoSegments");

  if (vidSegsString == null) {
    console.log("No value previously stored");
  } else {
    const vidSegs = await JSON.parse(vidSegsString);
    if (vidSegs.length === 0) {
      console.log("no videos");
    } else {
      //video exists
      const myUuid = uuid();
      const endingSTR = vidSegs[0].uri.split(".").pop();
      const inputFile =
        FileSystem.documentDirectory +
        "DayInTheLife/TodayFinished/" +
        "finished" +
        "." +
        endingSTR;
      const inputFileInfo = await FileSystem.getInfoAsync(inputFile);
      console.log("finished file exists " + inputFileInfo.exists);
      const outputFile = "DayInTheLife/Days/" + myUuid + "." + endingSTR;
      const finishedinfo = await FileSystem.getInfoAsync(inputFile);

      if (!finishedinfo.exists) {
        const vidSegsString = await AsyncStorage.getItem("videoSegments");
        const vidSegs = await JSON.parse(vidSegsString);
        const textfile = await writeTextFileWithAllVidFiles(vidSegs);
        let command = "";
        if (Platform.OS === "android") {
          command = `-f concat -safe 0 -i ${textfile} -c:v copy -c:a mp3 ${
            FileSystem.documentDirectory + outputFile
          }`;
        } else {
          command = `-f concat -safe 0 -i ${textfile} -c copy ${
            FileSystem.documentDirectory + outputFile
          }`;
        }
        await FFmpegKit.execute(command);
      } else {
        await FileSystem.moveAsync({
          from: inputFile,
          to: FileSystem.documentDirectory + outputFile,
        });
      }
      const thumbnail = await createThumbnail(
        FileSystem.documentDirectory + outputFile
      );
      today.thumbnail = thumbnail;

      today.video = outputFile;
    }
  }

  //Cleanup

  //Destroys videosegment list
  const emptylist = JSON.stringify([]);
  await AsyncStorage.setItem("videoSegments", emptylist);
  await FileSystem.deleteAsync(
    FileSystem.documentDirectory + "DayInTheLife/Today"
  );
  await FileSystem.makeDirectoryAsync(
    FileSystem.documentDirectory + "DayInTheLife/Today"
  );

  //Create new today item
  const emptyday = JSON.stringify({
    day: DateTime.now(),
    video: "",
    thumbnail: "",
    notes: [],
    id: uuid(),
  });
  await AsyncStorage.setItem("today", emptyday);

  // console.log(today)
  //add today to data
  const jsonPastDays = await AsyncStorage.getItem("PastDays");
  const PastDays = jsonPastDays != null ? await JSON.parse(jsonPastDays) : null;
  if (today.notes.length > 0 || today.thumbnail.length > 0) {
    if (PastDays === null) {
      const stringToday = JSON.stringify([today]);
      await AsyncStorage.setItem("PastDays", stringToday);
      setDayObjects([today]);
    } else {
      PastDays.push(today);
      const PastDaysString = JSON.stringify(PastDays);
      await AsyncStorage.setItem("PastDays", PastDaysString);
      setDayObjects(PastDays);
    }
  } else {
    console.log("DIDNT PUSH, NO DATA");
    setDayObjects(PastDays);
  }
  // console.log(PastDays);
};

const createThumbnail = async (videoURI) => {
  const imageUuid = uuid();
  const outputfilepath = "DayInTheLife/Days/" + imageUuid + ".png";
  const command = `-i ${videoURI} -vframes 1 ${
    FileSystem.documentDirectory + outputfilepath
  }`;
  await FFmpegKit.execute(command);
  return outputfilepath;
};

// Prevent native splash screen from autohiding before App component declaration
SplashScreen.preventAutoHideAsync()
  .then((result) =>
    console.log(`SplashScreen.preventAutoHideAsync() succeeded: ${result}`)
  )
  .catch(() => console.log("t")); // it's good to explicitly catch and inspect any error

export default function App() {
  let [fontsLoaded] = useFonts({
    Sora_400Regular,
    Sora_600SemiBold,
  });
  const [DayDownloading, setDayDownloading] = useState(false);
  const [DayObjects, setDayObjects] = useState([]);
  const [SelectedDayObject, setSelectedDayObject] = useState(false);
  // const colorScheme = useColorScheme();
  // console.log(colorScheme);

  //On app load
  useEffect(() => {
    const AppLoad = async () => {
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

      setSelectedDayObject(false);

      createDirectory("DayInTheLife/Days/");
      createDirectory("DayInTheLife/Today/");
      createDirectory("DayInTheLife/TodayFinished/");
      console.log("test test");
      await CreateToday();
      today = await GetToday();

      if (
        +DateTime.fromISO(today.day).startOf("day") ===
        +DateTime.now().startOf("day")
      ) {
        console.log("x");
      } else {
        console.log("y");
        newDay({ setDayObjects, setDayDownloading });
      }
      // await FileSystem.getInfoAsync(DayObjects[0].video)
      // await AsyncStorage.setItem("PastDays", "[]");
      // newDay({ setDayObjects, setDayDownloading });
      // console.log("aaaa");

      await SplashScreen.hideAsync().catch(() => {});
    };
    console.log("a");
    AppLoad();
  }, []);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        if (
          +DateTime.fromISO(today.day).startOf("day") ===
          +DateTime.now().startOf("day")
        ) {
          console.log("x");
        } else {
          console.log("y");
          newDay({ setDayObjects, setDayDownloading });
        }
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log("AppState", appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  if (!fontsLoaded) {
    return <AppLoading />;
  }
  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.allowFontScaling = false;

  return (
    <AppContext.Provider
      value={{
        DayObjects,
        setDayObjects,
        SelectedDayObject,
        setSelectedDayObject,
      }}
    >
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </AppContext.Provider>
  );
}
