import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Image,
  Linking,
} from "react-native";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faInstagram,
  faSnapchat,
  faSnapchatSquare,
  faTiktok,
  faTwitter,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import { faComment, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-native-modal";
import Share, { Social } from "react-native-share";
import * as FileSystem from "expo-file-system";
import * as SMS from "expo-sms";
import { surfaceColor, text1 } from "../../../../utils/colors";
import { FFmpegKit } from "ffmpeg-kit-react-native";
const SmallIcon = require("../../../../../assets/images/ShareIconSmall.png");
import { Asset, useAssets } from "expo-asset";

const ShareFunc = async ({ dayObject, social }) => {
  if (social === "sms") {
    SMS.sendSMSAsync([], "", {
      attachments: {
        uri: FileSystem.documentDirectory + dayObject.video,
        mimeType: "video/mov",
        filename: "dayinthelife.mov",
      },
    });
  }
  // else if (social === "snapchat") {
  //     RNStoryShare.isSnapchatAvailable().then(available => { if(available)  {
  //         RNStoryShare.shareToSnapchat({
  //             type: RNStoryShare.BASE64, // or RNStoryShare.FILE
  //     attributionLink: 'https://myproject.com',
  //     backgroundAsset: 'data:video/mov;base64,',
  //     stickerAsset: 'data:video/mov;base64,' + FileSystem.documentDirectory + dayObject.video,
  // captionText: 'text exemple',
  // media: "photo" // or "video"

  //     }).catch((err)=> console.log(err))

  // }})
  // }
  else {
    const shareOptions = {
      title: "title",
      message: "",
      url: FileSystem.documentDirectory + dayObject.video,
      social: social,
    };
    await Share.shareSingle(shareOptions);
  }
};

export const OpenFunc = async (dayObject) => {
  const x = await Asset.loadAsync(
    require("../../../../../assets/images/ShareIconSmall.png")
  );
  console.log(x);
  const ending = dayObject.video.split(".").pop();
  console.log("SMALL ICON");
  console.log(SmallIcon);
  const ffmpegCommand = `-i ${
    FileSystem.documentDirectory + dayObject.video
  } -i ${
    x[0].localUri
  } -filter_complex "overlay=x=(main_w-overlay_w-20):y=(main_h-overlay_h):enable='between(t,0,2)'"  ${
    FileSystem.cacheDirectory + "MadeWithJot." + ending
  }`;
  await FFmpegKit.executeAsync(ffmpegCommand);

  console.log("AAAAAAAAAAAA");
  Share.open({
    title: "Jot Video",
    message: "Jot - Record a day in your life",
    url: FileSystem.cacheDirectory + "MadeWithJot." + ending,
  }).catch(() => {});
  FileSystem.deleteAsync(
    FileSystem.cacheDirectory + "MadeWithJot." + ending
  ).catch(() => {});
};

const ShareMenu = ({ setShareVisable, ShareVisable, dayObject }) => {
  const buttonSize = 65;
  const buttonSpacing = 13;
  return (
    <Modal
      scrollHorizontal={true}
      propagateSwipe={true}
      useNativeDriverForBackdrop
      swipeDirection="down"
      onSwipeComplete={() => setShareVisable(false)}
      isVisible={ShareVisable}
      onBackdropPress={() => {
        setShareVisable(false);
      }}
      style={{
        flex: 1,
        marginHorizontal: 0,
        marginBottom: 0,
        justifyContent: "flex-end",
      }}
    >
      <View style={{ height: 150, backgroundColor: surfaceColor() }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View></View>
          <Text
            style={{
              fontFamily: "Sora_400Regular",
              fontSize: 14,
              textAlign: "center",
              marginVertical: 5,
              color: text1(),
            }}
          >
            Share Your Day
          </Text>
          <View></View>
        </View>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          scrollEnabled={true}
          horizontal={true}
          contentContainerStyle={{ height: 100, alignItems: "center" }}
        >
          {/* <Pressable style={{width: buttonSize, height: buttonSize, backgroundColor: 'red', marginLeft: buttonSpacing, borderRadius: 100, alignItems: 'center', justifyContent: 'center'}}
                        onPress={async()=> {await ShareFunc()}}
                        >
                        <FontAwesomeIcon icon={faTiktok} size={22}></FontAwesomeIcon></Pressable> */}
          <View
            style={{ flex: 1, flexDirection: "column", alignItems: "center" }}
          >
            <Pressable
              style={{
                width: buttonSize,
                height: buttonSize,
                backgroundColor: "#43CC47",
                marginLeft: buttonSpacing,
                borderRadius: 100,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={async () => {
                await ShareFunc({ dayObject, social: "sms" });
              }}
            >
              <FontAwesomeIcon
                icon={faComment}
                size={36}
                color="white"
              ></FontAwesomeIcon>
            </Pressable>
            <Text
              style={{ textAlign: "center", left: 5, top: 3, color: text1() }}
            >
              Message
            </Text>
          </View>

          {/* <Pressable style={{width: buttonSize, height: buttonSize, backgroundColor: 'transparent', marginLeft: buttonSpacing, borderRadius: 100, alignItems: 'center', justifyContent: 'center'}}
                        onPress={async()=> {await ShareFunc({dayObject, social: Social.Snapchat})}}
                        >
                            <Image style={{width: '100%', height: '100%', borderRadius: 100}} source={require('../../../../../assets/icons/SnapchatLogo.jpg')}/>

                        </Pressable> */}
          <View
            style={{ flex: 1, flexDirection: "column", alignItems: "center" }}
          >
            <Pressable
              style={{
                width: buttonSize,
                height: buttonSize,
                backgroundColor: "transparent",
                marginLeft: buttonSpacing,
                borderRadius: 100,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={async () => {
                await ShareFunc({ dayObject, social: Share.Social.INSTAGRAM });
              }}
            >
              {/* <FontAwesomeIcon icon={faInstagram} size={22}></FontAwesomeIcon> */}
              <Image
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 100,
                  resizeMode: "cover",
                }}
                source={require("../../../../../assets/icons/InstagramLogo.png")}
              />
            </Pressable>
            <Text
              style={{ textAlign: "center", left: 5, top: 3, color: text1() }}
            >
              Instagram
            </Text>
          </View>

          {/* <Pressable style={{width: buttonSize, height: buttonSize, backgroundColor: '#25D366', marginLeft: buttonSpacing, borderRadius: 100, alignItems: 'center', justifyContent: 'center'}}
                        onPress={async()=> {await ShareFunc({dayObject, social: Share.Social.WHATSAPP})}}
                        >
                        <FontAwesomeIcon icon={faWhatsapp} size={39} color='white'> </FontAwesomeIcon></Pressable> */}

          <Pressable
            style={{
              width: buttonSize,
              height: buttonSize,
              backgroundColor: "#1DA1F2",
              marginLeft: buttonSpacing,
              borderRadius: 100,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={async () => {
              await ShareFunc({ dayObject, social: Share.Social.TWITTER });
            }}
          >
            <FontAwesomeIcon
              icon={faTwitter}
              size={35}
              color="white"
            ></FontAwesomeIcon>
          </Pressable>
          <View
            style={{ flex: 1, flexDirection: "column", alignItems: "center" }}
          >
            <Pressable
              style={{
                width: buttonSize,
                height: buttonSize,
                backgroundColor: "#00468B",
                marginLeft: buttonSpacing,
                borderRadius: 100,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={async () => {
                await OpenFunc(dayObject);
              }}
            >
              <FontAwesomeIcon
                icon={faEllipsis}
                size={35}
                color="white"
              ></FontAwesomeIcon>
            </Pressable>
            <Text
              style={{ textAlign: "center", left: 5, top: 3, color: text1() }}
            >
              More
            </Text>
          </View>
        </ScrollView>
        <View></View>
      </View>
    </Modal>
  );
};

export default ShareMenu;

const styles = StyleSheet.create({});
