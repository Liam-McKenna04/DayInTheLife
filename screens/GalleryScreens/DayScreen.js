import React, {useState} from 'react';
import {View, StyleSheet, Text, Pressable, Share, ScrollView} from 'react-native';
import DateHeader from '../../components/gallery/DateHeader';
import DayScrollViewComponent from '../../components/gallery/DayScrollViewComponent';
import { DateTime } from 'luxon';
import { SharedElement } from 'react-navigation-shared-element';
import ShareModal from '../../components/ShareModal';
import Modal from "react-native-modal"
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faInstagram, faSnapchat, faSnapchatSquare, faTiktok, faTwitter, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faComment } from '@fortawesome/free-solid-svg-icons';
const DayScreen = ({route, navigation}) => {
    const {dayObject} = route.params
    const [ShareVisable, setShareVisable] = useState(false)
    return (
        
        <View style={{flex: 1, backgroundColor: '#F2F2F6'}}>
            
            <DateHeader setShareVisable={setShareVisable} navigation={navigation} headerContent={DateTime.fromISO(dayObject.day).toFormat("cccc', ' LLL d")}/>

            <DayScrollViewComponent dayObject={dayObject} />
            <Modal scrollHorizontal={true} propagateSwipe={true} useNativeDriverForBackdrop swipeDirection="down" onSwipeComplete={()=> setShareVisable(false)} isVisible={ShareVisable}  onBackdropPress={()=> {setShareVisable(false)}} style={{flex: 1, marginHorizontal: 0, marginBottom: 0, justifyContent: 'flex-end'}}>
                <View style={{height: 150, backgroundColor: 'white'}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <View></View>
                        <Text style={{fontFamily: "Sora_400Regular", fontSize: 14, textAlign: 'center', marginVertical: 5}}>Share Your Day</Text>
                        <View></View>
                    </View>
                    <ScrollView scrollEnabled={true} horizontal={true} contentContainerStyle={{height: 100,  alignItems: 'center'}}>
                        <Pressable style={{width: 65, height: 65, backgroundColor: 'red', marginLeft: 15, borderRadius: 100, alignItems: 'center', justifyContent: 'center'}}
                        onPress={()=> {}}
                        >
                        <FontAwesomeIcon icon={faTiktok} size={22}></FontAwesomeIcon></Pressable>

                        <Pressable style={{width: 65, height: 65, backgroundColor: 'red', marginLeft: 15, borderRadius: 100, alignItems: 'center', justifyContent: 'center'}}>
                        <FontAwesomeIcon icon={faComment} size={22}></FontAwesomeIcon></Pressable>

                        <Pressable style={{width: 65, height: 65, backgroundColor: 'red', marginLeft: 15, borderRadius: 100, alignItems: 'center', justifyContent: 'center'}}>
                        <FontAwesomeIcon icon={faSnapchat} size={22}></FontAwesomeIcon></Pressable>

                        <Pressable style={{width: 65, height: 65, backgroundColor: 'red', marginLeft: 15, borderRadius: 100, alignItems: 'center', justifyContent: 'center'}}>
                        <FontAwesomeIcon icon={faInstagram} size={22}></FontAwesomeIcon></Pressable>

                        <Pressable style={{width: 65, height: 65, backgroundColor: 'red', marginLeft: 15, borderRadius: 100, alignItems: 'center', justifyContent: 'center'}}>
                        <FontAwesomeIcon icon={faWhatsapp} size={22}></FontAwesomeIcon></Pressable>

                        <Pressable style={{width: 65, height: 65, backgroundColor: 'red', marginLeft: 15, borderRadius: 100, alignItems: 'center', justifyContent: 'center'}}>
                        <FontAwesomeIcon icon={faTwitter} size={22}></FontAwesomeIcon></Pressable>
                       
                    </ScrollView>
                    <View></View>
                </View>
            </Modal>

        </View>
        
    );  
}

const styles = StyleSheet.create({})

export default DayScreen;
