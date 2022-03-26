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
var RNFS = require('react-native-fs')

const writeTextFileWithAllAudioFiles = async (filePaths) => {
  var fileContent = ''
  console.log('b')
  const exists = await RNFS.exists(RNFS.DocumentDirectoryPath + "/audioList.txt")
  if (exists) {
  await RNFS.unlink(RNFS.DocumentDirectoryPath + '/audioList.txt')
  }
  console.log('c')
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
  const [CurrentIndex, setCurrentIndex] = useState(0);
  const video = useRef(null);
  const [status, setStatus] = useState({});
  if (true) {
    return (
      <View style={{flex: 1, backgroundColor: 'white', alignItems: 'center'}}>

      <Video
        ref={video}
        style={{height: '100%', aspectRatio: 9/16, position: 'absolute', display: 'flex'}}
        source={{
          uri: VideoURI,
        }}
        useNativeControls={false}
        resizeMode="cover"
        isLooping={true}
        shouldPlay={true}
        
        onPlaybackStatusUpdate={status => setStatus(() => status)}
      />
       </View>

    )
  } else {

  return (


      
      <View style={{flex: 1, backgroundColor: 'white', alignItems: 'center'}}>
      {videoURIList.map((vid, index) => <IndividualVideo setVideoList={setVideoList} navigation={navigation} index={index} key={vid} vidURI={vid} setCurrentIndex={setCurrentIndex} currentIndex={CurrentIndex} listSize={videoURIList.length}/>)}
      
      </View>
 

  )}
}

// const IndividualVideo = ({navigation, vidURI, currentIndex, index, listSize, setCurrentIndex, setVideoList}) => {
//   const video = useRef(null);
//   const [status, setStatus] = useState({});
//   const [Display, setDisplay] = useState('none')
//   // const Display = currentIndex==index ? 'flex': 'none'
//   useEffect(() => {
//     if (status.didJustFinish == true) {
//       video.current.stopAsync()
      
//       if (currentIndex == listSize - 1) {
//         setCurrentIndex(0)

//       } else {
//         setCurrentIndex(currentIndex + 1)

//       }
      
//     } else {

//     }

//   }, [status.didJustFinish]);

//   useEffect(()=> {
//     if (currentIndex == index) {
//       video.current.playAsync()
//       setDisplay('flex')
//       // console.log(currentIndex)
//     } else {
//       setDisplay('none')
//     }

//   }, [currentIndex])



//   useEffect(async() => {
      
//     const leave = navigation.addListener('blur', async() => {
//       setVideoList([])
//     })
//     return leave
    
//     }, [navigation])
// return(
// <Video
//         ref={video}
//         style={{height: '100%', aspectRatio: 9/16, position: 'absolute', display: Display}}
//         source={{
//           uri: vidURI,
//         }}
//         useNativeControls={false}
//         resizeMode="cover"
//         isLooping={true}
//         progressUpdateIntervalMillis={10}
        
//         onPlaybackStatusUpdate={status => setStatus(() => status)}
//       />
      
//       )
// }


const CameraPlaybackScreen = ({navigation}) => {
  const [VideoList , setVideoList] = useState([])
  const [VideoURI, setVideoURI] = useState("");
  const [VideoPlaying, setVideoPlaying] = useState(true);
  const [Loaded, setLoaded] = useState(false)
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
    
    const command = `-f concat -safe 0 -i ${textfile} -c copy ${outputFile}`

    const x = await FFmpegKit.execute(command).then(() => {
      setVideoURI(outputFile)
    }


    )
    
      
      
    }
    }, [VideoList]);




  return (
    <View style={{flex: 1}}>
     {/* <SafeAreaView style={{flex: 1, width: "100%", justifyContent: 'space-between'}}> */}
        <View style={{ height: 150, flexDirection: 'row', alignItems: 'center', position: 'absolute', zIndex: 2, paddingLeft: 25}}>
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
        </View>
        <VideoPlayer setVideoList={setVideoList} navigation={navigation} VideoURI={VideoURI} videoURIList={VideoList} VideoPlaying={true}/>

        


        {/* <View style={{height: 200}}></View> */}
      {/* </SafeAreaView> */}

    </View>
  )
}

export default CameraPlaybackScreen

const styles = StyleSheet.create({})