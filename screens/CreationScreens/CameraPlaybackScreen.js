import { StyleSheet, Text, View, Button, Pressable , TouchableOpacity} from 'react-native'
import React from 'react'
import {useRef, useState, useEffect} from 'react'
import {Audio, Video } from 'expo-av'
import * as FileSystem from 'expo-file-system';
import { SafeAreaView } from 'react-native-safe-area-context';
import {GetVideoSegments} from '../../utility'
import * as MediaLibrary from 'expo-media-library';
import { FFmpegKit, FFprobeKit  } from 'ffmpeg-kit-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons'
import { useIsFocused } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {Slider} from '@miblanchard/react-native-slider';

import { faRotate, faNoteSticky, faCircleCheck, faArrowRotateLeft, faPen, faPenClip, faEye, faPause, faVolumeMute, faPlay, faVolumeHigh } from '@fortawesome/free-solid-svg-icons';
var RNFS = require('react-native-fs')

const writeTextFileWithAllAudioFiles = async (filePaths) => {
  var fileContent = ''
  const exists = await RNFS.exists(RNFS.DocumentDirectoryPath + "/audioList.txt")
  console.log(exists)
  if (exists) {
  await RNFS.unlink(RNFS.DocumentDirectoryPath + '/audioList.txt').catch((e)=> console.log("f"))
  }
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


const VideoPlayer = ({navigation, thumbnail, VideoURI, VideoPlaying, videoURIList, setVideoList}) => { 
  const video = useRef(null);
  const [status, setStatus] = useState({});
  const [shouldPlay, setShouldPlay] = useState(true)
  
  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      setShouldPlay(true)
      return () => {
        setShouldPlay(false)
      };
    }, [])
  );
  

    return (
      <View style={{flex: 1, backgroundColor: 'black', alignItems: 'center'}}>

      <Video
        ref={video}
        style={{height: '100%', aspectRatio: 9/16, position: 'absolute', display: 'flex'}}
        source={{
          uri: VideoURI,
        }}
        useNativeControls={false}
        resizeMode="cover"
        isLooping={true}
        shouldPlay={shouldPlay}
        progressUpdateIntervalMillis={50}
        onPlaybackStatusUpdate={status => setStatus(() => status)}
      />
      <View style={{position: 'absolute',  bottom: 15, zIndex: 1, height: 100, width: "100%", display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
        <Slider disabled={true} 
               maximumValue={status.durationMillis} 
               trackStyle={{backgroundColor: 'white', height: 10, borderRadius: 3 }}
              
              minimumTrackTintColor="#00468B" 
              renderThumbComponent={()=> {<View/>}}
               animateTransitions={false} 
               animationType='timing'  
               value={status.positionMillis} 
               containerStyle={{ width: "60%", marginHorizontal: 10}}>
        </Slider>
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginRight: 20, marginLeft: 10 }}>
          <TouchableOpacity
             style={{
             alignItems:'center',
             justifyContent:'center',
             width:40,
             height:40,
             backgroundColor:'rgba(0,0,0,0.5)',
             borderRadius:50,
             marginLeft: 10
             }}
              onPress={async() =>{if (status.isPlaying) {await video.current.pauseAsync()} else {await video.current.playAsync()}}}>
                {status.isPlaying ? <FontAwesomeIcon icon={faPause} size={22} color="#FFF"></FontAwesomeIcon>:<FontAwesomeIcon icon={faPlay} size={22} color="#FFF"></FontAwesomeIcon> }

          </TouchableOpacity>
          <TouchableOpacity
             style={{
             alignItems:'center',
             justifyContent:'center',
             width:40,
             height:40,
             backgroundColor:'rgba(0,0,0,0.5)',
             borderRadius:50,
             marginLeft: 10
             }}
              onPress={async() => {if (status.isMuted) {await video.current.setIsMutedAsync(false)} else {await video.current.setIsMutedAsync(true)}}}>
                {status.isMuted ?<FontAwesomeIcon icon={faVolumeMute} size={22} color="#FFF"></FontAwesomeIcon>: <FontAwesomeIcon icon={faVolumeHigh} size={22} color="#FFF"></FontAwesomeIcon>}

          </TouchableOpacity>
        </View>
      </View>
       </View>

    )
  
}

const buttonStyle = (EditorStatus, setting) => {
  if (EditorStatus === setting) { 
    
    return {

      alignItems:'center',
      justifyContent:'center',
      width:40,
      height:40,
      backgroundColor:'rgba(255,255,255,1)',
      borderRadius:50,
      marginBottom: 15
    }
  } else {
    return {

      alignItems:'center',
      justifyContent:'center',
      width:40,
      height:40,
      backgroundColor:'rgba(0,0,0,0.2)',
      borderRadius:50,
      marginBottom: 15

    }
  }
}


const CameraPlaybackScreen = ({navigation}) => {
  const [VideoList , setVideoList] = useState([])
  const [VideoURI, setVideoURI] = useState("");
  const [Loaded, setLoaded] = useState(false)
  const [EditorStatus, setEditorStatus] = useState("Preview");
  useEffect(async() => {
    const vidSegsString = await AsyncStorage.getItem('videoSegments')
    const vidSegs = await JSON.parse(vidSegsString)
    // console.log(vidSegs)
    setVideoList(vidSegs)
    setLoaded(true)
    
    
    }, [])
    

    
    

 

    useEffect(async() => {
      if (VideoList.length != 0 || Loaded){
        let listlength = VideoList.length
      let StringToText = ""
      let FilterString = ""
      // console.log(VideoList.length)
      for (let i = 0; i < VideoList.length;i++ ) {
        
          StringToText = StringToText.concat( "-i " + VideoList[i]+ " ")
          FilterString = FilterString.concat(`[${i}:v] [${i}:a] `)
        
      
    }
      const textfile = await writeTextFileWithAllAudioFiles(VideoList)
      const endingTAG = VideoList[0]
      const endingSTR = endingTAG.split('.').pop()
      const outputFile = FileSystem.documentDirectory + "DayInTheLife/TodayFinished/" + "finished" + "." + endingSTR

    FileSystem.deleteAsync(outputFile, {idempotent: true})
      // await FFmpegKit.execute(`${StringToText} -filter_complex "${FilterString} concat=n=${listlength}:v=1:a=1 [v] [a]" -map "[v]" -map "[a]" ${outputFile}`).then(async(session)=> {
      //   setVideoURI(outputFile)
      //   console.log(outputFile)
      
      // })
    
    const command = `-f concat -safe 0 -i ${textfile} -c copy ${outputFile} -loglevel quiet`

    const x = await FFmpegKit.execute(command).then(() => {
      setVideoURI(outputFile)
      
    }


    )
    
      
      
    }
    }, [VideoList]);
    
 


  return (
    <View style={{flex: 1}}>
        <View style={{ height: 150, width: "100%",flexDirection: 'row', alignItems: 'flex-start', marginTop: 50,position: 'absolute', zIndex: 1, paddingHorizontal: 25, justifyContent: 'space-between'}}>
        <TouchableOpacity
             style={{

              alignItems:'center',
              justifyContent:'center',
              width:40,
              height:40,
              backgroundColor:'rgba(0,0,0,0.2)',
              borderRadius:50,
            }}
              onPress={() => navigation.navigate('Camera')}>
        <FontAwesome name={"arrow-left"}  size={24} color="#FFF" />

        </TouchableOpacity>
        <View>
        <TouchableOpacity
             style={buttonStyle(EditorStatus, "Preview")}
              onPress={() =>{setEditorStatus("Preview")}}>
                <FontAwesomeIcon icon={faEye} size={22} color={EditorStatus === "Preview" ?"#000":"#FFF" }></FontAwesomeIcon>

        </TouchableOpacity>
        <TouchableOpacity
             style={buttonStyle(EditorStatus, "Edit")}
              onPress={() =>{setEditorStatus("Edit")}}>
                <FontAwesomeIcon icon={faEye} size={22} color={EditorStatus === "Edit" ?"#000":"#FFF" }></FontAwesomeIcon>

        </TouchableOpacity>
        <TouchableOpacity
             style={buttonStyle(EditorStatus, "hee")}
              onPress={() =>{setEditorStatus("hee")}}>
                <FontAwesomeIcon icon={faEye} size={22} color={EditorStatus === "hee" ?"#000":"#FFF" }></FontAwesomeIcon>

        </TouchableOpacity>
        
        
        </View>
        </View>
        {VideoURI.length > 0 ? <VideoPlayer setVideoList={setVideoList} navigation={navigation} VideoURI={VideoURI} videoURIList={VideoList} VideoPlaying={true}/>: <View/>}
        {/* {EditorStatus !== "Preview"? <LinearGradient
                         style={{height: '30%', width: '100%', backgroundColor: 'transparent', position: 'absolute', zIndex: 1, bottom: 0}}
                             colors={['rgba(0,0,0, 0.8)','rgba(0,0,0, 0) ']}
                             start={{ x: 1, y: 0.9 }}
                             end={{ x: 1, y:0}}/> : <View/>} */}
        


       

    </View>
  )
}

export default CameraPlaybackScreen

const styles = StyleSheet.create({})