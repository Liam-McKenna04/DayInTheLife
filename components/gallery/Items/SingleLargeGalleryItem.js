import React from 'react';
import {View, StyleSheet, Text, Pressable, Image, ImageBackground} from 'react-native';
import { DateTime } from 'luxon';
import { LinearGradient } from 'expo-linear-gradient'

function getNumberSuffix(num) {
    const th = 'th'
    const rd = 'rd'
    const nd = 'nd'
    const st = 'st'
  
    if (num === 11 || num === 12 || num === 13) return th
  
    let lastDigit = num.toString().slice(-1)
  
    switch (lastDigit) {
      case '1': return st
      case '2': return nd
      case '3': return rd
      default:  return th
    }
  }

const MainContentRenderer = ({dayObject}) => {
    if (dayObject.thumbnail != "") {
        return (<ImageBackground source={{uri: dayObject.thumbnail}} style={{height: "100%", width: '100%', resizeMode: 'cover', flex: 1, borderRadius: 10 }} imageStyle={{borderRadius: 10}}>
                        <LinearGradient
                         style={{height: '100%', width: '100%', borderRadius: 10, backgroundColor: 'transparent'}}
                             colors={['rgba(255,255,255, 0.43) ,','rgba(255,255,255, 0)) ']}
                             start={{ x: 0.0, y: 0.0 }}
                             end={{ x: 0.0, y:0.5}}/>
                    </ImageBackground>
                    
                )
    } else {
        if (DateTime.fromISO(dayObject.day).year != DateTime.now().year) {
            var topMargin = 75
        } else {
            var topMargin = 50
        }
        return (<View style={styles.MainContentStyle}><Text style={{fontFamily:"Sora_400Regular", fontSize: 16, textAlign: 'center', top: topMargin, overflow: 'hidden'}}>{dayObject.notes[0].title}</Text></View>)
    }
}

const TitleContentRenderer = ({dayObject, sectionType}) => {
    
    if (sectionType === "thisWeek") {
        const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        return (<Text style={{fontFamily: "Sora_600SemiBold", fontSize: 20}}>{weekday[DateTime.fromISO(dayObject.day).weekday - 1]}</Text>)
    } else if (sectionType === "weeks") {
        let suffix = getNumberSuffix(DateTime.fromISO(dayObject.day).startOf('week').day)
        let year = DateTime.fromISO(dayObject.day).weekYear == DateTime.now().weekYear ? "" : DateTime.fromISO(dayObject.day).weekYear
        return (<Text style={{fontFamily: "Sora_600SemiBold", fontSize: 20, textAlign: 'center'}}>{DateTime.fromISO(dayObject.day).startOf('week').toFormat('LLLL d')}{suffix} {year}</Text>)
    } else if (sectionType === "days") {
        let suffix = getNumberSuffix(DateTime.fromISO(dayObject.day).day)
        let year = DateTime.fromISO(dayObject.day).year == DateTime.now().year ? "" : DateTime.fromISO(dayObject.day).year
        //Should I include year? Yes for now but eventually include 
        return (<Text  style={{fontFamily: "Sora_600SemiBold", fontSize: 25, textAlign: 'left', position: 'absolute',  top: 12, left: 12, width: '90%', zIndex: 1}}>{DateTime.fromISO(dayObject.day).toFormat('LLL d')}{suffix} {year}</Text>)
    }
}



const SingleLargeGalleryItem = ({dayObject, sectionType, navigation}) => {
    // console.log(weekObject[0].day.toISODate())
    return (
        <Pressable style={styles.GalleryItemContainer} onPress={(e) => {navigation.navigate('DayView', {dayObject})}}>
            <TitleContentRenderer dayObject={dayObject} sectionType="days"/>
            <MainContentRenderer dayObject={dayObject}/>
            
        </Pressable>
    );
}

const styles = StyleSheet.create({
    GalleryItemContainer :{
        backgroundColor: 'white',
        width: 165,
        height: 205,
        borderRadius: 10,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        overflow: 'hidden',
        
        alignItems: 'center',
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

    },
    MainContentStyle : {
        height: 140, 
        justifyContent: 'flex-start',
        shadowOffset: {
            width: 1, 
            height: 1
        },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    
})

export default SingleLargeGalleryItem;
