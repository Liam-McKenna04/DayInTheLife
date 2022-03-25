import * as React from 'react';
import { useState, useEffect } from 'react';
import Tabs from "./components/NavbarComponent"
import { StyleSheet, Text, View, SafeAreaView, ScrollView, useColorScheme } from 'react-native';
import * as FileSystem from 'expo-file-system';
import {v4 as uuid} from 'uuid'

import { NavigationContainer } from '@react-navigation/native';

import AppLoading from 'expo-app-loading';
import {useFonts, Sora_400Regular, Sora_600SemiBold } from '@expo-google-fonts/sora'
import { createStackNavigator } from '@react-navigation/stack';
import CameraNav from './screens/CreationScreens/CameraNav';
import GalleryNav from './screens/GalleryScreens/GalleryNav';
import ProfileNavHub from './screens/ProfileScreens/ProfileNavHub';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {isFirstStartup, createDirectory, CreateToday, GetToday} from './utility'
import { DateTime } from 'luxon';
import Midnight from 'react-native-midnight';
import { LogBox } from 'react-native';
import { FFmpegKit  } from 'ffmpeg-kit-react-native';
var RNFS = require('react-native-fs')
 
const RootStack = createStackNavigator();

const writeTextFileWithAllAudioFiles = async (filePaths) => {
  var fileContent = ''

  filePaths.forEach(path => {
    // console.log(path)
    fileContent += `file '${path}'\n`
  });
  const filePath =  RNFS.DocumentDirectoryPath + '/audioList.txt'
  try {
    await RNFS.writeFile(filePath, fileContent, 'utf8')
    return filePath
  } catch (error) {
    return error
  }
}


const newDay = async() => {
const todaySTR = await AsyncStorage.getItem('today')
const today = todaySTR != null ? JSON.parse(todaySTR) : null
console.log(today)
const vidSegsString = await AsyncStorage.getItem('videoSegments')
if (vidSegsString == null) {
  console.log("No value previously stored")
} else {
const vidSegs = await JSON.parse(vidSegsString)
if (vidSegs.length === 0) {
   console.log('no videos')
} else {
  //video exists
console.log('videos')
const myUuid = uuid()
const endingSTR = vidSegs[0].split('.').pop()
const inputFile = FileSystem.documentDirectory + "DayInTheLife/TodayFinished/" + "finished" + "." + endingSTR
const inputFileInfo = await FileSystem.getInfoAsync(inputFile)
console.log("finished file exists " + inputFileInfo.exists)  
const outputFile = FileSystem.documentDirectory + "DayInTheLife/Days" + myUuid + "." + endingSTR
finishedinfo = await FileSystem.getInfoAsync(inputFile)
if (!finishedinfo.exists) {
  const vidSegsString = await AsyncStorage.getItem('videoSegments')
  const vidSegs = await JSON.parse(vidSegsString)
  const textfile = await writeTextFileWithAllAudioFiles(vidSegs)
  const command = `-f concat -safe 0 -i ${textfile} -c copy ${inputFile}`
  await FFmpegKit.execute(command) 

} 
console.log(finishedinfo.exists)
if (finishedinfo.exists) {
await FileSystem.moveAsync({from: inputFile, to: outputFile})
today.video = outputFile

const thumbnail = await createThumbnail(outputFile)
today.thumbnail = thumbnail
console.log(typeof(today)) 




}  

 


}}

//Cleanup


//Destroys videosegment list 
const emptylist = JSON.stringify([])
await AsyncStorage.setItem('videoSegments', emptylist)
console.log('deleting today')
await FileSystem.deleteAsync(FileSystem.documentDirectory + "DayInTheLife/Today")
await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + "DayInTheLife/Today")

//Create new today item
const emptyday = JSON.stringify({day: DateTime.now(), video: "", thumbnail: "", notes: []})
await AsyncStorage.setItem('today', emptyday)

console.log(today)
//add today to data 
jsonPastDays = await AsyncStorage.getItem('PastDays')
PastDays = await jsonPastDays != null ? JSON.parse(jsonPastDays) : null
if ((today.notes.length > 0) || (today.thumbnail.length > 0)) {
  console.log(today.notes.length)
  console.log(today.thumbnail.length)
if (PastDays === null) {
const stringToday = JSON.stringify([today])
await AsyncStorage.setItem('PastDays', stringToday )
} else {
  
  PastDays.push(today)
  const PastDaysString = JSON.stringify(PastDays)
  await AsyncStorage.setItem('PastDays', PastDaysString)

}
} else {
  console.log("DIDNT PUSH, NO DATA")
}
}

const createThumbnail = async(videoURI) => {
  const imageUuid = uuid()
  const outputfilepath = FileSystem.documentDirectory + "DayInTheLife/Days" + imageUuid + ".png"
  const command = `-i ${videoURI} -ss 00:00:01.000 -vframes 1 ${outputfilepath}`
   await FFmpegKit.execute(command)
  return outputfilepath
}  





const RootNavigator = () => {
  return (
    <RootStack.Navigator initialRouteName='GalleryNav' screenOptions={{ headerShown: false, animationEnabled: false }}>

        <RootStack.Screen name="ProfileNav" component={ProfileNavHub}/>
        <RootStack.Screen name="GalleryNav" component={GalleryNav}/>
        <RootStack.Screen name="CameraNav" component={CameraNav}/>
        {/* <RootStack.Screen name="BottomTabNavigatorScreen" component={Tabs}/> */}
        {/* <RootStack.Screen name="CameraNav" component={CameraNav} options={{ ananimationEnabled: true}} /> */}
    </RootStack.Navigator>
  )
}


export default function App() {
    let [fontsLoaded] = useFonts({
      Sora_400Regular,
      Sora_600SemiBold
    })


    //On app load
    useEffect(async() => {
      const FirstStartup = isFirstStartup()
      createDirectory("DayInTheLife/Days/")
      createDirectory("DayInTheLife/Today/")
      createDirectory("DayInTheLife/TodayFinished/")
      await CreateToday()
      today = await GetToday()
      console.log(+DateTime.fromISO(today.day).startOf('day') == +DateTime.now().startOf("day"))
      if (+DateTime.fromISO(today.day).startOf("day") === +DateTime.now().startOf("day")) {
        console.log('x')
      } else {
        newDay()

        //Recycle day object and 
      }
      const listener = Midnight.addListener(()=> {
        newDay()
      })
      // newDay()

      return ()=> listener.remove()



        },
     []);

    
    
    if (!fontsLoaded) {
      return <AppLoading/>
    }


   


  return (
    
    <NavigationContainer>
      <StatusBar style='auto'/>
      <RootNavigator/>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
});

