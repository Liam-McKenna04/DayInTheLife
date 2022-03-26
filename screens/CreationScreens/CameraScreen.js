import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Button, Pressable, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import { getPermissionsAsync } from 'expo-av/build/Audio';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { faRotate, faDeleteLeft, faNoteSticky, faCircleCheck, faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons';
import {v4 as uuid} from 'uuid'
import { Audio, Video } from 'expo-av';
import { useNavigation } from '@react-navigation/native';


import { FontAwesome } from '@expo/vector-icons'
import { FFmpegKit, FFprobeKit, RNFFmpegConfig  } from 'ffmpeg-kit-react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'


function CameraScreen({Recording, setRecording}) {
  //Refs
  const navigation = useNavigation()

  
    const [camera, setCamera] = useState(null)
    const [record, setRecord] = useState(null);

    const [CameraHasPermission, setCameraHasPermission] = useState(null);
    const [MicHasPermission, setMicHasPermission] = useState(null);
    const [CameraOrientation, setCameraOrientation] = useState(Camera.Constants.Type.back);
    

  //Options
    const [VideoLength, setVideoLength] = useState(0);
    const [MaxVideoLength, setMaxVideoLength] = useState(60);
    const [Flash, setFlash] = useState("");
    const [Locked, setLocked] = useState(false);


    //Video Settings
    const [VideoList, setVideoList] = useState([]);
    const [Loaded, setLoaded] = useState(false);

    useEffect(async() => {
      const vidSegsString = await AsyncStorage.getItem('videoSegments')
    const vidSegs = await JSON.parse(vidSegsString)
    // console.log(vidSegs)
    if (vidSegs === null) {
      await AsyncStorage.setItem('videoSegments', "[]")
      setVideoList([])
    }else {
    setVideoList(vidSegs)
    }
    setLoaded(true)
      
      
      

     
  }, []);


  const playVideoHandler = () => {

  }

  const timeUpdateHandler = () => {

  }

    useEffect(() => {
      (async () => {

        
        const { status } = await Camera.requestCameraPermissionsAsync();
        // console.log(status)
        setCameraHasPermission(status === 'granted');
      })();
    }, []);


    useEffect(() => {
        (async () => {
  
          
          const { status } = await Camera.requestMicrophonePermissionsAsync();
          // console.log(status)
          setMicHasPermission(status === 'granted');
        })();
      }, []);
    
      useEffect(async() => {
        
        // console.log(VideoList)
        // console.log(VideoList[0])
        const lengths = []
        for (item of VideoList) {
          
          await FFprobeKit.execute(`-v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${item}`).then(async (session) => {
            let output = await session.getOutput()
            lengths.push(Number(output))
          })
        }
        const sum = lengths.reduce((partialSum, a) => partialSum + a, 0);
        console.log('-')
        console.log(sum) 
       
        setVideoLength(sum)
        

        await AsyncStorage.setItem('videoSegments', JSON.stringify(VideoList))
        
      }, [VideoList]);

    if (CameraHasPermission === null || MicHasPermission === null) {
        //Loading
      return <View />;
    }
    if (CameraHasPermission === false) {
        //Redirect to settings
        navigation.goBack()
      return <Text>No access to camera</Text>;
    }
    if (MicHasPermission === false) {
        //Redirect to settings

        navigation.goBack()
        return <Text>No access to Video</Text>;
      }

      const takeVideo = async () => {
            console.log("Maxvidlength" +MaxVideoLength)
            console.log("vidlength"+ VideoLength)
            if (MaxVideoLength < VideoLength){
              console.log("TOO LONG")
              return false
            }
            setRecording(true)
            console.log('b')
            const data = await camera.recordAsync({maxDuration: MaxVideoLength - VideoLength})
            console.log('e')

            setRecording(false)

            
            const myUUID = uuid()
            const fileEnd = await data.uri.split('.').pop()
            const newURI = FileSystem.documentDirectory + "DayInTheLife/Today/" + myUUID + "." + fileEnd
            const x2 = await FileSystem.moveAsync({from: data.uri, to: newURI})
            
            setRecord(newURI);
            setVideoList([...VideoList, newURI])
            
            
        
      }

      const stopVideo = async () => {
        camera.stopRecording();
      }
      
    return (
      
<Camera ref ={ref => setCamera(ref)} style={{flex: 1, width: "100%", justifyContent: 'space-between'}} zoom={0} type={CameraOrientation}  >
    <StatusBar style='light'></StatusBar>
    <SafeAreaView style={{flex: 1, width: "100%", justifyContent: 'space-between'}}>

      <View style={{justifyContent: "space-between", flexDirection: 'row', marginTop: 5, marginHorizontal: 25}}>
        <TouchableOpacity
             style={{

              alignItems:'center',
              justifyContent:'center',
              width:40,
              height:40,
              backgroundColor:'rgba(0,0,0,0.2)',
              borderRadius:50,
            }}
              onPress={() => navigation.navigate('GalleryNav')}>
        <FontAwesome name={"arrow-left"}  size={24} color="#FFF" />
        </TouchableOpacity>
            <TouchableOpacity 
            style={{

              alignItems:'center',
              justifyContent:'center',
              width:40,
              height:40,
              backgroundColor:'rgba(0,0,0,0.2)',
              borderRadius:50,
            }}

              onPress={() => {
                setCameraOrientation(CameraOrientation === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back)}}
            >
                <FontAwesomeIcon icon={faRotate} size={24}color="#FFF"></FontAwesomeIcon>
            </TouchableOpacity>
      </View>




          <View style={{justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', marginBottom: 65}}>
              <View style={{flex: 1, alignItems: 'flex-end'}}>
                <TouchableOpacity style={{

                      alignItems:'center',
                      justifyContent:'center',
                      width:40,
                      height:40,
                      backgroundColor:'rgba(0,0,0,0.2)',
                      borderRadius:50,
                      marginRight: 30
                      }}
                  onPress={() => navigation.navigate("Notes")}>
                <FontAwesomeIcon icon={faNoteSticky} size={24}color="#FFF"></FontAwesomeIcon>

                </TouchableOpacity>
              </View>



              <View style={{backgroundColor: 'transparent' , borderRadius: 100, borderWidth: 8, borderColor: 'white'}}>
                  <Pressable 
              // onPress={}
              onPressIn={async() => {await takeVideo()}}
                
              onPressOut={async() => {await stopVideo()}}
              
              // onLongPress={}
              // delayLongPress={}

            
            
            
                style={{height: 65, width: 65, backgroundColor: 'transparent', borderRadius: 100}}>

                </Pressable>
              </View>

              <View style={{flexDirection: 'row', flex: 1, justifyContent: 'space-between'}}>
                {VideoList.length > 0? <TouchableOpacity style={{

                          alignItems:'center',
                          justifyContent:'center',
                          width:40,
                          height:40,
                          backgroundColor:'rgba(0,0,0,0.2)',
                          borderRadius:50,
                          marginLeft: 30
                          }}
                
                onPress={async() => {
                  const uriToDelete = VideoList[VideoList.length - 1]
                  if (VideoList.length > 0){
                  setVideoList(VideoList.slice(0, -1))
                  }
                  await FileSystem.deleteAsync(uriToDelete, {idempotent: true}).catch(()=> console.log('no more videos to delete :)'))
                }}
                >
                <FontAwesomeIcon icon={faArrowRotateLeft} size={24}color="#FFF"></FontAwesomeIcon>
                </TouchableOpacity>: <View/>}

                { VideoList.length > 0? 
                <TouchableOpacity style={{

                  alignItems:'center',
                  justifyContent:'center',
                  width:40,
                  height:40,
                  backgroundColor:'rgba(0,0,0,0.2)',
                  borderRadius:50,
                  marginRight: 30

                  }} onPress={() => navigation.navigate('CameraPlayback')}>
                   <FontAwesomeIcon icon={faCircleCheck} size={24}color="#FFF"></FontAwesomeIcon>
                </TouchableOpacity>: <View/>
            }
              </View>
          </View>
            
    </SafeAreaView>
    </Camera>
        
  )
}
export default CameraScreen

const styles = StyleSheet.create({
    exampleStyle:  { flex: 1, alignItems: 'center', justifyContent: 'center' }


})
