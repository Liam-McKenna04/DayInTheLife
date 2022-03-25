import React from 'react';
import {View, StyleSheet, Text, Pressable, Image} from 'react-native';
import { LogBox } from 'react-native';
import {DateTime} from 'luxon'

const MainContentRenderer = ({dayObject}) => {
    // console.log(dayObject)
    console.log('aaa')
    if (dayObject.thumbnail.length > 0) {
        console.log(typeof(dayObject.thumbnail))
        return (<Image style={{height: "75%", width: '100%', resizeMode: 'cover', borderRadius: 10}} source={{uri: dayObject.thumbnail}}/>)
    } else {
        return (<View style={styles.MainContentStyle}><Text style={{fontFamily:"Sora_400Regular", fontSize: 16, textAlign: 'center'}}>{dayObject.notes[0].title}</Text></View>)
    }
}

const TitleContentRenderer = ({dayObject, sectionType}) => {
    
    if (sectionType === "thisWeek") {
        const weekday = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' , 'Sunday' ]
        return (<Text style={{fontFamily: "Sora_600SemiBold", fontSize: 18}}>{weekday[DateTime.fromISO(dayObject.day).weekday - 1]}</Text>)
    }
}

// const dayObjects = [{"day": new Date(),"image": null, "notes": [{"title": "Lthis is singlegall"}]}]



const SingleGalleryItem = ({dayObject, sectionType, navigation}) => {
    return (
        <Pressable style={styles.GalleryItemContainer} onPress={(e) => {navigation.navigate('DayView', {dayObject})}}>

            <MainContentRenderer dayObject={dayObject}/>
            <TitleContentRenderer dayObject={dayObject} sectionType="thisWeek"/>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    GalleryItemContainer :{
        
        backgroundColor: 'white',
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
        shadowOpacity: 0.1,
        shadowRadius: 10,
        
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
