import { StyleSheet, Text, View, ScrollView, Pressable, Image, Linking } from 'react-native'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faInstagram, faSnapchat, faSnapchatSquare, faTiktok, faTwitter, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faComment, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import Modal from "react-native-modal"
import Share, {Social} from 'react-native-share';
import * as FileSystem from 'expo-file-system';
import * as SMS from 'expo-sms';


const ShareFunc = async({dayObject, social}) => {
    if (social === "sms") {

        SMS.sendSMSAsync([], "", {attachments: {uri: FileSystem.documentDirectory + dayObject.video, mimeType: "video/mov", filename: 'dayinthelife.mov'}})
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
        title: 'title',
        message: '',
        url: FileSystem.documentDirectory + dayObject.video,
        social: social
    }
    await Share.shareSingle(shareOptions)

}
}

const OpenFunc = async() => {
    Share.open({title: 'Day In The Life Video', message: 'Day In The Life - Record your life', url: FileSystem.documentDirectory + dayObject.video}).catch(()=>{})
}


const ShareMenu = ({setShareVisable, ShareVisable, dayObject}) => {
    const buttonSize = 65
    const buttonSpacing = 13
  return (
    <Modal scrollHorizontal={true} propagateSwipe={true} useNativeDriverForBackdrop swipeDirection="down" onSwipeComplete={()=> setShareVisable(false)} isVisible={ShareVisable}  onBackdropPress={()=> {setShareVisable(false)}} style={{flex: 1, marginHorizontal: 0, marginBottom: 0, justifyContent: 'flex-end'}}>
                <View style={{height: 150, backgroundColor: 'white'}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <View></View>
                        <Text style={{fontFamily: "Sora_400Regular", fontSize: 14, textAlign: 'center', marginVertical: 5}}>Share Your Day</Text>
                        <View></View>
                    </View>
                    <ScrollView showsHorizontalScrollIndicator={false} scrollEnabled={true} horizontal={true} contentContainerStyle={{height: 100,  alignItems: 'center'}}>
                        {/* <Pressable style={{width: buttonSize, height: buttonSize, backgroundColor: 'red', marginLeft: buttonSpacing, borderRadius: 100, alignItems: 'center', justifyContent: 'center'}}
                        onPress={async()=> {await ShareFunc()}}
                        >
                        <FontAwesomeIcon icon={faTiktok} size={22}></FontAwesomeIcon></Pressable> */}
                        <View style={{flex: 1, flexDirection: 'column', alignItems:'center'}}>
                        <Pressable style={{width: buttonSize, height: buttonSize, backgroundColor: '#43CC47', marginLeft: buttonSpacing, borderRadius: 100, alignItems: 'center', justifyContent: 'center'}}
                        onPress={async()=> {await ShareFunc({dayObject, social: "sms"})}} >
                        <FontAwesomeIcon icon={faComment} size={36} color='white'> </FontAwesomeIcon>
                        </Pressable>
                        <Text style={{textAlign: 'center', left: 5, top: 3}}>Message</Text>
                        </View>

                        {/* <Pressable style={{width: buttonSize, height: buttonSize, backgroundColor: 'transparent', marginLeft: buttonSpacing, borderRadius: 100, alignItems: 'center', justifyContent: 'center'}}
                        onPress={async()=> {await ShareFunc({dayObject, social: Social.Snapchat})}}
                        >
                            <Image style={{width: '100%', height: '100%', borderRadius: 100}} source={require('../../../../../assets/icons/SnapchatLogo.jpg')}/>

                        </Pressable> */}
                        <View style={{flex: 1, flexDirection: 'column', alignItems:'center'}}>

                        <Pressable style={{ width: buttonSize, height: buttonSize, backgroundColor: 'transparent', marginLeft: buttonSpacing, borderRadius: 100, alignItems: 'center', justifyContent: 'center'}}
                        onPress={async()=> {await ShareFunc({dayObject, social: Share.Social.INSTAGRAM})}}
                        >
                        {/* <FontAwesomeIcon icon={faInstagram} size={22}></FontAwesomeIcon> */}
                        <Image style={{width: '100%', height: '100%', borderRadius: 100, resizeMode: 'cover'}} source={require('../../../../../assets/icons/InstagramLogo.png')}/>
                        
                        </Pressable>
                        <Text style={{textAlign: 'center', left: 5, top: 3}}>Instagram</Text>
                        </View>

                        {/* <Pressable style={{width: buttonSize, height: buttonSize, backgroundColor: '#25D366', marginLeft: buttonSpacing, borderRadius: 100, alignItems: 'center', justifyContent: 'center'}}
                        onPress={async()=> {await ShareFunc({dayObject, social: Share.Social.WHATSAPP})}}
                        >
                        <FontAwesomeIcon icon={faWhatsapp} size={39} color='white'> </FontAwesomeIcon></Pressable> */}

                        {/* <Pressable style={{width: buttonSize, height: buttonSize, backgroundColor: '#1DA1F2', marginLeft: buttonSpacing, borderRadius: 100, alignItems: 'center', justifyContent: 'center'}}
                        onPress={async()=> {await ShareFunc({dayObject, social: Share.Social.TWITTER})}}
                        >
                        <FontAwesomeIcon icon={faTwitter} size={35} color='white'></FontAwesomeIcon></Pressable> */}
                        <View style={{flex: 1, flexDirection: 'column', alignItems:'center'}}>

                        <Pressable style={{width: buttonSize, height: buttonSize, backgroundColor: '#00468B', marginLeft: buttonSpacing, borderRadius: 100, alignItems: 'center', justifyContent: 'center'}}
                        onPress={async()=> {await OpenFunc()} }>
                        <FontAwesomeIcon icon={faEllipsis} size={35} color='white'></FontAwesomeIcon></Pressable>
                        <Text style={{textAlign: 'center', left: 5, top: 3}}>More</Text>
                        </View>
                       
                    </ScrollView>
                    <View></View>
                </View>
            </Modal>
  )
}

export default ShareMenu

const styles = StyleSheet.create({})