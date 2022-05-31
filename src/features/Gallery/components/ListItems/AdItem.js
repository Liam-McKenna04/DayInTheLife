import { StyleSheet, Text, View, Platform, AppState } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import NativeAdView from "react-native-admob-native-ads";
import {
  AdBadge,
  ImageView,
  HeadlineView,
} from "react-native-admob-native-ads";
import {
  getTrackingStatus,
  requestTrackingPermission,
} from "react-native-tracking-transparency";
import { LinearGradient } from "expo-linear-gradient";

const AdItem = () => {
  // const adId = "ca-app-pub-3940256099942544/2247696110";
  const adId =
    Platform.OS === "ios"
      ? "cca-app-pub-4250936061919309/7191326161"
      : "ca-app-pub-4250936061919309/2130571176";
  const nativeAdViewRef = useRef();
  const [UsingTracking, setUsingTracking] = useState(false);

  useEffect(() => {
    if (Platform.OS !== "ios") {
      return;
    }

    const updateTrackingStatus = (status) => {
      if (status === "active") {
        (async () => {
          const trackingStatus = await getTrackingStatus();
          setUsingTracking(trackingStatus);
          if (trackingStatus === "not-determined") {
            const trackingStatus = await requestTrackingPermission();
            setUsingTracking(trackingStatus);
          }
        })();
      }
    };

    // Ready to check the permission now
    if (AppState.currentState === "active") {
      updateTrackingStatus(AppState.currentState);
    } else {
      // Need to wait until the app is ready before checking the permission
      const subscription = AppState.addEventListener(
        "change",
        updateTrackingStatus
      );

      return () => {
        subscription.remove();
      };
    }
  }, [AppState.currentState]);

  useEffect(() => {
    let isMounted = true;
    const loadsAd = async () => {
      nativeAdViewRef.current?.loadAd();
    };
    if (isMounted) {
      loadsAd();
    }
    // console.log(nativeAdViewRef);
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <NativeAdView
      ref={nativeAdViewRef}
      mediaAspectRatio="portrait"
      adUnitID={adId}
      enableTestMode={true}
      style={styles.GalleryItemContainer}
      adChoicesPlacement="bottomRight"
      requestNonPersonalizedAdsOnly={!UsingTracking}
      onAdLoaded={() => {
        console.log("ad loaded");
      }}
      onAdFailedToLoad={(event) => {
        console.log(event);
        console.log("eee");
      }}
    >
      {/* <HeadlineView style={{fontFamily: "Sora_600SemiBold", fontSize: 15, textAlign: 'left', position: 'absolute',  top: 12, left: 12, width: '90%', zIndex: 4}}/> */}

      <ImageView
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 7,
          // resizeMode: "stretch",
        }}
      ></ImageView>
    </NativeAdView>
  );
};

export default AdItem;

const styles = StyleSheet.create({
  GalleryItemContainer: {
    backgroundColor: "transparent",
    width: 165,
    height: 205,
    borderRadius: 7,
    flexDirection: "column",
    justifyContent: "flex-start",
    overflow: "visible",

    // alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 14,
    zIndex: 2,

    // marginTop: 20,
    marginHorizontal: 15,
    marginBottom: 20,
  },
});
