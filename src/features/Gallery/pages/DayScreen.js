import React, {useState} from 'react';
import {View, StyleSheet, Text, Pressable, ScrollView} from 'react-native';
import DateHeader from '../../../components/DateHeader';
import DayScrollViewComponent from '../components/dayView/DayScrollViewComponent';
import ShareMenu from '../components/dayView/ShareMenu';
import { DateTime } from 'luxon';
import { SharedElement } from 'react-navigation-shared-element';
import Modal from "react-native-modal"
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faInstagram, faSnapchat, faSnapchatSquare, faTiktok, faTwitter, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faComment, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import Share, {Social} from 'react-native-share';


import { text1, surfaceColor } from '../../../utils/colors';

const DayScreen = ({route, navigation}) => {
    const {dayObject} = route.params
    const [ShareVisable, setShareVisable] = useState(false)
  
    return (
        
        <View style={{flex: 1, backgroundColor: surfaceColor()}}>
            
            <DateHeader setShareVisable={setShareVisable} navigation={navigation} headerContent={DateTime.fromISO(dayObject.day).toFormat("cccc', ' LLL d")}/>

            <DayScrollViewComponent dayObject={dayObject} />

            <ShareMenu ShareVisable={ShareVisable} setShareVisable={setShareVisable} dayObject={dayObject}/>
            
            

        </View>
        
    );  
}

const styles = StyleSheet.create({})

export default DayScreen;
