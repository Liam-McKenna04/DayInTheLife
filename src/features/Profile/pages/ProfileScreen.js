import * as React from 'react';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { FontAwesome } from '@expo/vector-icons'
import profilepic from "../../assets/images/defaultPFP.jpg"
import {faPlus, faX} from "@fortawesome/free-solid-svg-icons"
import { faAnglesUp, faAngleRight, faShare, faUserGroup, faComment } from '@fortawesome/free-solid-svg-icons';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser'
//Get user data on app load and

const ProfileButton = ({icon, text, onPress}) => {
    return (
        <Pressable onPress={onPress} style={styles.press}>
            <View style={{margin: 0, display: "flex", flexDirection: "row", alignItems: "center"}}>
                {/* <FontAwesome name="arrow-right"/> */}
                <FontAwesomeIcon icon={icon} size={30} style={{color: 'black'}}/>
                <Text style={{textAlign: "center", marginLeft: 13, fontFamily: "Sora_400Regular", fontSize: 16}}>{text}</Text>

            </View>
            <FontAwesomeIcon icon={faAngleRight} size={20} style={{color: 'black'}}/>
        </Pressable>
    )
}


const OpenUrl = ({url, children}) => {
    const handlePress = React.useCallback(async () => {
        const supported = await Linking.canOpenURL(url)
            if (supported) {
            
            } else {
                Alert.alert(`Don't know how to open this URL: ${url}`);

        }
        } , [url]);

}





function ProfileScreen({navigation}) {
 


    return (
    <View style={{backgroundColor: '#F2F2F6'}}>
        <View style={styles.header}>
                <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                    <Pressable onPress={() => {navigation.goBack()}} style={{padding: 10}}>
                        <FontAwesomeIcon  icon={faX} iconStyle={{margin: 2, color: "#1A1A1A" }} size={22} underlayColor="transparent" activeOpacity={0.2} backgroundColor="blue" />
                    </Pressable>
                    <Text style={{fontFamily: 'Sora_600SemiBold', color: "#1A1A1A", fontSize: 24, marginLeft: 10}}>My Profile</Text>
                </View>
                
                <FontAwesome.Button name="gear" onPress={() => {navigation.navigate('Settings')}} iconStyle={{margin: 2, color: "#1A1A1A" }} size={24} underlayColor="transparent" activeOpacity={0.2} backgroundColor="transparent" />
        </View>
        <View style={styles.body}>
            {/* Create a function that uses social pfp and if not do default */}
            <Image source={profilepic} style={{width: 100, height: 100, borderRadius: 10}}/> 
            <Text style={{fontFamily: 'Sora_600SemiBold', color: "#1A1A1A", fontSize: 32, marginTop: 23}}>NAME LASTNAME</Text>
            <Text style={{fontFamily: 'Sora_400Regular', color: "#1A1A1A", fontSize: 14, marginTop: 6}}>email@email.com</Text>
            <View style={{ borderBottomColor: '#888888', borderBottomWidth: 3, width: "91%", marginTop: 25}}/>
            <ProfileButton icon={faAnglesUp}text={"Upgrade Account"} onPress={()=> {console.log("Press")}}/>
            <ProfileButton icon={faComment}text={"Frequently Asked Questions"} onPress={()=> {console.log("Press")}}/>
            <ProfileButton icon={faTwitter}text={"Follow My Twitter"} onPress={()=> {Linking.openURL("twitter://user?screen_name=Liam_McKennaa").catch(console.log(WebBrowser.openBrowserAsync("https://twitter.com/Liam_McKennaa")))}}/>
            <ProfileButton icon={faShare}text={"Share App"} onPress={()=> {console.log("Press")}}/>
            <ProfileButton icon={faUserGroup}text={"Join the Community"} onPress={()=> {console.log("Press")}}/>
        </View>
    </View>
  )
}
export default ProfileScreen

const styles = StyleSheet.create({
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 55,
        marginBottom: 20,
        marginRight: 20,
        marginLeft: 10,
    },
    body : {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    press: {
        backgroundColor: "white", 
        width: "89%", 
        marginTop: 22, 
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
