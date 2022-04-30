import React from 'react';
import {View, StyleSheet, Text, Pressable, Image, Share} from 'react-native';
import { Video } from 'expo-av';
import { LogBox } from 'react-native';
import {DateTime} from 'luxon'
import { useNavigation } from '@react-navigation/native';
import { SharedElement } from 'react-navigation-shared-element';
import * as FileSystem from 'expo-file-system';
import {surfaceColor, elevatedColor, text1} from '../../../../utils/colors'

const MainContentRenderer = ({dayObject}) => {
    // console.log(dayObject)
    if (dayObject.thumbnail.length > 0) {
        
        // console.log(typeof(thumb))
        return (
        <SharedElement id={dayObject.id} style={{width: '100%', height: '75%'}}>
        <Image style={{height: "100%", width: '100%', resizeMode: 'cover', borderRadius: 10}} resizeMode='cover' source={{uri: FileSystem.documentDirectory + dayObject.thumbnail}}/>
        </SharedElement>
        )
    } else {
        return (<View style={styles.MainContentStyle}><Text style={{fontFamily:"Sora_400Regular", fontSize: 16, textAlign: 'center', color: text1()}}>{dayObject.notes[0].text}</Text></View>)
    }
}

const TitleContentRenderer = ({dayObject, sectionType}) => {
    
    if (sectionType === "thisWeek") {
        const weekday = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' , 'Sunday' ]
        return (<Text style={{fontFamily: "Sora_600SemiBold", fontSize: 18, color: text1()}}>{weekday[DateTime.fromISO(dayObject.day).weekday - 1]}</Text>)
    }
}

// const dayObjects = [{"day": new Date(),"image": null, "notes": [{"title": "Lthis is singlegall"}]}]



const SingleGalleryItem = ({dayObject, sectionType}) => {
    const navigation = useNavigation()
    return (
        
        <Pressable style={styles.GalleryItemContainer} onPress={(e) => {navigation.navigate('DayView', {dayObject})}}>

            <MainContentRenderer dayObject={dayObject}/>
            <TitleContentRenderer dayObject={dayObject} sectionType="thisWeek"/>
        </Pressable>
        
    );
}

const styles = StyleSheet.create({
    GalleryItemContainer :{
        
        backgroundColor: elevatedColor(),
        width: 133,
        height: 165,
        borderRadius: 10,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowOffset: {
            width: 2, 
            height: 2
        },
        shadowOpacity: 0,
        shadowRadius: 10,
        shadowColor: 'grey',
        elevation: 14,
        marginTop: 20,
        marginLeft: 30,
        padding: 10

    },
    MainContentStyle : {
        height: 113, 
        margin: 5,
        padding: 5,
        // backgroundColor: 'white',
        borderRadius: 10,

        justifyContent: 'center',
        shadowOffset: {
            width: 1, 
            height: 1
        },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    }
})

export default SingleGalleryItem;
