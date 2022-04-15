import { StyleSheet, Text, View, Keyboard } from 'react-native'
import React, {useRef} from 'react'
import VisionCameraScreen from './VisionCameraScreen'
import NoteTakingScreen from './NoteTakingScreen'
import Swiper from 'react-native-swiper'
const CreationNav = ({Recording, setRecording}) => {
    const swiperRef=useRef()
  return (
    <Swiper scrollEnabled={!Recording} ref={swiperRef} showsButtons={false} horizontal={false} loop={false} showsPagination={false} onTouchStartCapture={()=> {Keyboard.dismiss()}} >
        <VisionCameraScreen Recording={Recording} setRecording={setRecording} swiperRef={swiperRef}/>

        <NoteTakingScreen swiperRef={swiperRef} />

    </Swiper>
  )
}

export default CreationNav

const styles = StyleSheet.create({})