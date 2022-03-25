import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Button, Pressable, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import { getPermissionsAsync } from 'expo-av/build/Audio';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {v4 as uuid} from 'uuid'

import { FontAwesome } from '@expo/vector-icons'
import { GetVideoSegments } from '../../utility';

function CameraScreen({navigation}) {
  //Refs
  
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
    const [Recording, setRecording] = useState(false)
    const [Loaded, setLoaded] = useState(false);

    useEffect(async() => {
      const vidSegsString = await AsyncStorage.getItem('videoSegments')
    const vidSegs = await JSON.parse(vidSegsString)
    console.log(vidSegs)
    setVideoList(vidSegs)
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
        console.log(VideoList)
        
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
        if(camera){
            const data = await camera.recordAsync({quality: '720p'})
            const myUUID = uuid()
            const fileEnd = data.uri.split('.').pop()
            const newURI = FileSystem.documentDirectory + "DayInTheLife/Today/" + myUUID + "." + fileEnd
            await FileSystem.moveAsync({from: data.uri, to: newURI})
            
            setRecord(newURI);
            setVideoList([...VideoList, newURI])
            
            
        }
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
            <Pressable style={{backgroundColor: 'red', width: 40, height: 40, justifyContent: 'center', alignItems:'center', borderRadius: 99}}
              onPress={() => {
                console.log(CameraOrientation)
                setCameraOrientation(CameraOrientation === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back)}}
            >
                <Text>b</Text>
            </Pressable>
      </View>




          <View style={{justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', marginBottom: 65}}>
              <View style={{flex: 1, alignItems: 'flex-end'}}>
                <Pressable style={{backgroundColor: 'blue', width: 40, height: 40, borderRadius: 99, marginRight: 30, justifyContent: 'center', alignItems: 'center' }}
                  onPress={() => navigation.navigate("Notes")}>
                    <Text>n</Text>
                </Pressable>
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
                <Pressable style={{backgroundColor: 'blue', width: 40, height: 40, borderRadius: 99, marginLeft: 30, justifyContent: 'center', alignItems: 'center' }}
                
                onPress={async() => {
                  const uriToDelete = VideoList[VideoList.length - 1]
                  if (VideoList.length > 0){
                  setVideoList(VideoList.slice(0, -1))
                  }
                  await FileSystem.deleteAsync(uriToDelete, {idempotent: true}).catch(()=> console.log('no more videos to delete :)'))
                }}
                >
                  <Text style={{color: 'black'}}>d</Text>
                </Pressable>
                { VideoList.length > 0? 
                <Pressable style={{backgroundColor: 'red', width: 40, height: 40, borderRadius: 99, marginRight: 30, justifyContent: 'center', alignItems:'center' }} onPress={() => navigation.navigate('CameraPlayback')}>
                  <Text>p</Text>
                </Pressable>: <View/>
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
