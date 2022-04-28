import { StyleSheet, Text, View } from 'react-native'
import React, {useEffect, useRef, useState} from 'react'
import NativeAdView from "react-native-admob-native-ads";
import { AdBadge, ImageView, HeadlineView } from "react-native-admob-native-ads";
import { getTrackingStatus } from 'react-native-tracking-transparency';
import { LinearGradient } from 'expo-linear-gradient'


const AdItem = () => {
  console.log("ad") 
  const nativeAdViewRef = useRef()
  const [UsingTracking, setUsingTracking] = useState(false);
  useEffect(async()=> {

const trackingStatus = await getTrackingStatus();
console.log(trackingStatus)
if (trackingStatus === 'authorized' || trackingStatus === 'unavailable') {
  // enable tracking features
    setUsingTracking(true)
  console.log('x')
} else {
    setUsingTracking(false)
    console.log('y')
}


    nativeAdViewRef.current?.loadAd();
    
  }, [])

  return (
    <NativeAdView
    ref={nativeAdViewRef}
    mediaAspectRatio='portrait'

    adUnitID="ca-app-pub-3940256099942544/2247696110"
    enableTestMode={true}
    style={styles.GalleryItemContainer}
    adChoicesPlacement='bottomRight'
    requestNonPersonalizedAdsOnly={UsingTracking}

    >
    {/* <HeadlineView style={{fontFamily: "Sora_600SemiBold", fontSize: 15, textAlign: 'left', position: 'absolute',  top: 12, left: 12, width: '90%', zIndex: 4}}/> */}

    <LinearGradient
                         style={{height: '100%', width: '100%', borderRadius: 10, backgroundColor: 'transparent', position: 'absolute', zIndex: 2}}
                             colors={['rgba(255,255,255, 0.43) ,','rgba(255,255,255, 0)) ']}
                             start={{ x: 0.0, y: 0.0 }}
                             end={{ x: 0.0, y:0.5}}
                             
                             />
    <ImageView
  style={{
    width: "100%",
    height: "100%",
    resizeMode: 'stretch'
  }}
    ></ImageView>
    </NativeAdView>
  )
}

export default AdItem

const styles = StyleSheet.create({
    GalleryItemContainer :{
        backgroundColor: 'white',
        width: 165,
        height: 205,
        borderRadius: 10,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        overflow: 'hidden',
        
        // alignItems: 'center',
        shadowOffset: {
            width: 2, 
            height: 2
        },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 3,
        zIndex: 2,
        
        
        // marginTop: 20,
        marginHorizontal: 15,
        marginBottom: 20

    }})