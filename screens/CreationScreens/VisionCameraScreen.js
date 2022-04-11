import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, TouchableOpacity } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { faRotate, faNoteSticky, faCircleCheck, faArrowRotateLeft, faPen, faPenClip } from '@fortawesome/free-solid-svg-icons';
import {v4 as uuid} from 'uuid'
import { useNavigation } from '@react-navigation/native';

import Svg, {Circle, Path} from 'react-native-svg'
import { Linking } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'
import {  FFprobeKit  } from 'ffmpeg-kit-react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
  multiply,
  Clock,
  Extrapolate,
} from 'react-native-reanimated'
const AnimatedCircle = Animated.createAnimatedComponent(Circle)

var RNFS = require('react-native-fs')



  


function VisionCameraScreen({Recording, setRecording}) {


 

  //Timer
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [Delta, setDelta] = useState(0)
  function toggle() {
    setIsActive(!isActive);
  }

  function reset() {
    setSeconds(0);
    setIsActive(false);
  }

  useEffect(() => {
    let interval = null;
    const startTime = new Date().getTime()
    if (isActive) {
      interval = setInterval(() => {
        // console.log(seconds / 10)
        var delta = new Date().getTime() - startTime
        
        if ((delta/1000 + VideoLength) > MaxVideoLength) {
          
          stopVideo()
          setIsActive(false)
        }
        
          setDelta(delta/1000)
        
      }, 0);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
      setDelta(0)
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);














  //Refs
  const navigation = useNavigation()
  const devices = useCameraDevices()
    const [camera, setCamera] = useState(null)
    const [record, setRecord] = useState(null);

    const [CameraHasPermission, setCameraHasPermission] = useState(null);
    const [MicHasPermission, setMicHasPermission] = useState(null);
    const [CameraOrientation, setCameraOrientation] = useState();

  //Options
    const [LengthList, setLengthList] = useState([]);
    const [VideoLength, setVideoLength] = useState(0);
    const [MaxVideoLength, setMaxVideoLength] = useState(60);
    const [Flash, setFlash] = useState("");
    const [Locked, setLocked] = useState(false);
  
    //Video Settings
    const [VideoList, setVideoList] = useState([]);
    const [Loaded, setLoaded] = useState(false);
    const AnimatedCameraButton = Animated.createAnimatedComponent(Pressable)
    // console.log(VideoList)

    const cameraButtonStyle = useAnimatedStyle(() => {
      return {
        width: withTiming(!Recording ? 78: 88, {duration: 100}),
        height: withTiming(!Recording ? 78: 88, {duration: 100}),
        
        borderWidth: withTiming(!Recording ? 8: 44, {duration: 100}),

      }
    })


    useEffect(async() => {
      const vidSegsString = await AsyncStorage.getItem('videoSegments')
    const vidSegs = await JSON.parse(vidSegsString)
    
    if (vidSegs === null) {
      await AsyncStorage.setItem('videoSegments', "[]")
      setVideoList([])
    }else {
    for (let i = vidSegs.length - 1; i > -1; i--){
    let response = await FileSystem.getInfoAsync(vidSegs[i])
    if (response.exists === false){
      vidSegs.splice(i, 1)
    }
    }
    setVideoList(vidSegs)
    }
    setLoaded(true)
    
      

     
  }, []);

  useEffect(() => {
      setCameraOrientation(devices.back)
  }, [devices]);
  

    useEffect(async() => {
        

        
        let camStatus  = await Camera.getCameraPermissionStatus();
        let micStatus  = await Camera.getMicrophonePermissionStatus();
        camStatus = await Camera.requestCameraPermission()
        micStatus = await Camera.requestMicrophonePermission()
        
        
        setCameraHasPermission(camStatus === 'authorized');
        setMicHasPermission(micStatus === "authorized")
      
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
        let sum = lengths.reduce((partialSum, a) => partialSum + a, 0);
        sum = sum || 0
       setDelta(0)
      setVideoLength(sum)
      setLengthList(lengths)
      
        

        await AsyncStorage.setItem('videoSegments', JSON.stringify(VideoList))
        
      }, [VideoList]);




    if (CameraHasPermission === null || MicHasPermission === null) {
        //Loading
      return <View />;
    }
    if (CameraHasPermission === false || MicHasPermission === false) {
        //Redirect to settings
        let title = "Enable Camera"
        let text = "Please provide us access to your camera, which is required to create days"
        if (CameraHasPermission === true) {
          title = "Enable Microphone"
          text = "Please provide us access to your Microphone, which is required to create days"
        }
      return (
      <View style={{justifyContent:'center', alignItems: 'center', flex: 1}}>
          <View style={{height: 400, width: "100%", top: -50}}>
            <Text style={{ fontFamily: "Sora_600SemiBold",  color: "#1A1A1A", fontSize: 38, marginLeft: 20, alignItems: 'center', marginBottom: 5 }}>{title}</Text>
            <Text style={{ fontFamily: "Sora_400Regular",  color: "#1A1A1A", fontSize: 22, marginLeft: 20, alignItems: 'center', marginBottom: 5}}>{text}</Text>
            <Pressable onPress={()=> {Linking.openSettings()}} style={styles.press}>
                <View style={{flex: 1, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: 'center'}}>
                
                {/* <FontAwesomeIcon icon={faGear} size={24} style={{color: 'black'}}/> */}
                <Text style={{textAlign: "center", marginLeft: 13, fontFamily: "Sora_600SemiBold", fontSize: 18, color: 'white'}}>Go To Settings</Text>

                </View>
              {/* <FontAwesomeIcon icon={faAngleRight} size={20} style={{color: 'black'}}/> */}
              </Pressable>
          </View>
      </View>
      );
    }
    

      const takeVideo =  async() => {
            console.log("Maxvidlength: " + MaxVideoLength)
            console.log("vidlength: "+ VideoLength)
            if (MaxVideoLength < VideoLength){
              console.log("TOO LONG")
              return false
            }
            setIsActive(true)
            setRecording(true)
            // clearTimeout(timeoutID)
            // const timeoutID = setTimeout(() => stopVideo(), (MaxVideoLength - VideoLength)* 1000)
            camera.startRecording({onRecordingFinished: async(video)=> {
                setRecording(false)
                
                const myUUID = uuid()
                const fileEnd = await video.path.split('.').pop()
                const newURI = FileSystem.documentDirectory + "DayInTheLife/Today/" + myUUID + "." + fileEnd
                const x2 = await RNFS.moveFile(video.path, newURI)
                
                setRecord(newURI);
                setVideoList([...VideoList, newURI])
                
                reset()


            
            } , onRecordingError: (err) => {console.log(err) 
              setDelta(0)
              reset()
              
            setRecording(false)}
          })
            
            


            
            
            
            
        
      }

      const stopVideo = () => {
          console.log("video length: "+ VideoLength)
        
        camera.stopRecording().catch(()=> console.log('err'));
      }
      
      const shutterOpacity = Recording ? .5 : 1
      

      const size = 128
      const strokeWidth = 12

      const radius = (size - strokeWidth) / 2
      const circumference = radius * 2 * Math.PI
      const alpha = Animated.interpolateNode( (VideoLength + Delta), {
        inputRange: [0, MaxVideoLength], 
        
        outputRange: [Math.PI * 2, 0],
        extrapolate: Extrapolate.CLAMP
        
      })
      const strokeDashoffset = multiply(alpha, radius)
      
      // console.log(strokeDashoffset)
      const strokeMarker = () => {

      } 


    return (
      
<Camera ref ={ref => setCamera(ref)} style={{flex: 1, width: "100%", justifyContent: 'space-between'}} zoom={1.2} video={true}
  audio={true} isActive={true} device={CameraOrientation}  > 
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
                setCameraOrientation(CameraOrientation === devices.back
                ? devices.front
                : devices.back)}}
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
                <FontAwesomeIcon icon={faPenClip} size={22} color="#FFF"></FontAwesomeIcon>

                </TouchableOpacity>
              </View>


              <View style={{width: 120, height: 120, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent'}}>
            
              <Svg style={{transform:[{rotateZ: "270deg"}]}} width={size} height={size}>
                <AnimatedCircle strokeLinecap='round' stroke="#00468B" fill="none" cy={size/2} cx={size/2} r={radius} strokeDashoffset={strokeDashoffset}  strokeDasharray={`${circumference} ${circumference}`} {...{strokeWidth}}></AnimatedCircle>
                      {/* <Path d={`M64 64 L75 75`} fill="none" stroke="red"/> */}
                       
              </Svg>

              <Animated.View                 
              style={[cameraButtonStyle, {backgroundColor: 'transparent', position: 'absolute',borderColor: 'white', borderRadius: 100, opacity: shutterOpacity}]}>
                  <Pressable 
              // onPress={}
              onPressIn={async() => {await takeVideo()}}
                
              onPressOut={async() => {stopVideo()}}
              
              // onLongPress={}
              // delayLongPress={}

            
            style={{backgroundColor: 'transparent', height: 86, width: 86, borderRadius: 100}}>

                </Pressable>
                </Animated.View>
                
                
                </View>
              

              <View style={{flexDirection: 'row', flex: 1, justifyContent: 'space-between'}}>
                {VideoList.length > 0? <TouchableOpacity style={{

                          alignItems:'center',
                          justifyContent:'center',
                          width:40,
                          height:40,
                          backgroundColor:'rgba(0,0,0,0.2)',
                          borderRadius:50,
                          marginLeft: 20
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
                <Pressable style={{

                  alignItems:'center',
                  justifyContent:'center',
                  width:40,
                  height:40,
                  backgroundColor:'rgba(0,0,0,0.2)',
                  borderRadius:50,
                  marginRight: 30

                  }} onPress={() => navigation.navigate('CameraPlayback')}>
                   <FontAwesomeIcon icon={faCircleCheck} size={24}color="#FFF"></FontAwesomeIcon>
                </Pressable>: <View/>
            }
              </View>
          </View>
            
    </SafeAreaView>
    </Camera>
        
  )
}
export default VisionCameraScreen

const styles = StyleSheet.create({
    exampleStyle:  { flex: 1, alignItems: 'center', justifyContent: 'center' },
    press: {
      backgroundColor: "#00468B", 
      width: "89%", 
      marginTop: 22, 
      marginLeft: 20,
      height: 66, 
      display: "flex", 
      flexDirection: "row", 
      alignItems: "center", 
      justifyContent: "space-between", 
      padding: 20, 
      borderRadius: 5,
      shadowOffset: {
          width: 0, 
          height: 2
      },
      shadowOpacity: 0.1
  }

})
