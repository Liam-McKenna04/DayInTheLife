import { StyleSheet, Text, View, Animated, ScrollView , Image, Pressable, Modal} from 'react-native'
import {Video, AVPlaybackStatus} from 'expo-av'
import Swipeable from 'react-native-gesture-handler/Swipeable';

import React from 'react'
import { useRef, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StaticNoteComponent from './Items/StaticNoteComponent';
import backgroundImage from '../../assets/images/backgroundimage.png'
import { DateTime } from 'luxon';
const HEADER_HEIGHT = 663;
// await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
// const playbackObject = new Audio.Sound();


const VideoPlayer = ({thumbnail, video, VideoPlaying}) => { 
  const vidRef = useRef(null)
  const [status, setStatus] = useState({});
 
      return (
      
        <View thumbnail={thumbnail} style={{flex: 1, position: 'relative', top: 0, bottom: 0, left: 0, right: 0}}>
            <Video  style={{flex: 1, height: '100%', width: '100%', resizeMode: 'cover', borderRadius: 10, backgroundColor: 'white'}} 
                    ref={vidRef} source={{uri: video}}
                    // useNativeControls
                    resizeMode='cover'
                    onPlaybackStatusUpdate={status => setStatus(() => status)}
                    isLooping
                    shouldPlay={VideoPlaying}
                    

                    />


      </View>
      
      )
  
}



const AnimatedImageHeader = ({animatedValue, thumbnail, video, VideoClickHandler, VideoPlaying}) => {
    // const insets = useSafeAreaInsets();
    const headerHeight = animatedValue.interpolate({
        inputRange: [0, HEADER_HEIGHT - 185],
        outputRange: [HEADER_HEIGHT,  200],
        extrapolate: 'clamp', 
    })
    if (video != "") {
    return (
        <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          
          zIndex: 1,
          height: headerHeight,
          backgroundColor: '#F2F2F6', 
          alignItems: 'center',
          justifyContent: 'space-between',
          flex: 1,
          
          
        }}
        pointerEvents="none"
        >
        <View></View>
        
        <Pressable  

          style={{height: '90%', width: '90%', position: 'relative',borderRadius: 10, shadowOffset: {width: 2, height: 2},shadowOpacity: 0.1,shadowRadius: 10}} 
            thumbnail={thumbnail}
            onPress={() => {
              VideoClickHandler()
              
            }}
           
            
            >
          
          <VideoPlayer VideoPlaying={VideoPlaying} thumbnail={thumbnail} video={video}/>
        </Pressable>
        <View style={{borderBottomColor: '#888888', borderBottomWidth: 1, width: "80%"}}/>

      </Animated.View>)
    } else {
      return (<View/>)
    }
}


const DayScrollViewComponent = ({navigation, dayObject}) => {
  const offset = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null)
  const [VideoPlaying, setVideoPlaying] = useState(true);
  const VideoClickHandler = () => {
    
    if (offset._value < 10) {
      console.log('clickedVideo')
    } else {
      console.log(offset)
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true })
    }
  }
  }

  const NoteClickHandler = () => {
    if ((offset._value < 250) && (dayObject.video != '')) {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: HEADER_HEIGHT - 185, animated: true })
      }
    }
  }

  
  

    
  return (
    <SafeAreaProvider style={{flex: 1}}>
           
            <AnimatedImageHeader VideoPlaying={VideoPlaying} VideoClickHandler={VideoClickHandler} thumbnail={dayObject.thumbnail} video={dayObject.video} animatedValue={offset} />
            <ScrollView 
            
              NoteClickHandler={NoteClickHandler}
                ref={scrollViewRef}
                style={{flex: 1, backgroundColor: '#F2F2F6'}} 
                showsVerticalScrollIndicator={false} 
                contentContainerStyle={[styles.contentContainer, dayObject.video == "" ? styles.contentContainerWithoutVideo: styles.contentContainerWithVideo]}
                scrollEventThrottle={16}
                scrollToOverflowEnabled={true}
                onScroll={
                  
                  Animated.event(
                    [{ nativeEvent: { contentOffset: { y: offset} } }],
                    {
                        listener: (e) => {
                          if (offset._value > 200){
                            setVideoPlaying(false)
                        } else {
                            setVideoPlaying(true)
                        }
                        
                      
                      
                      },
                        useNativeDriver: false
                      },
                    
                  )}
        
            >
              
                {dayObject.notes.map((note)=>{
                return <StaticNoteComponent NoteClickHandler={NoteClickHandler} key={note.date} text={note.text} title={note.title} time={DateTime.fromISO(note.date).toFormat('t')}/>})}
                
            </ScrollView>
            
            {/* </Modal> */}
  </SafeAreaProvider>
  )
}

export default DayScrollViewComponent

const styles = StyleSheet.create({
    contentContainer: {
      alignItems: 'center', paddingHorizontal: 10, paddingBottom: 100
    },
    contentContainerWithVideo: {paddingTop: HEADER_HEIGHT

    },
    contentContainerWithoutVideo: {paddingTop: 0

    }
})