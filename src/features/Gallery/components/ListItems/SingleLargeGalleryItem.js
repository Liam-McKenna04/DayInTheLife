import React from 'react';
import {View, StyleSheet, Text, Pressable, Image, ImageBackground} from 'react-native';
import { DateTime } from 'luxon';
import { LinearGradient } from 'expo-linear-gradient'
import { SharedElement } from 'react-navigation-shared-element';
import { useFocusEffect } from '@react-navigation/native';
import { InteractionManager } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { elevatedColor, text1, colorScheme, text2 } from '../../../../utils/colors';



const gradientScheme = () => {
    if (colorScheme === 'light') {
        return 'rgba(255,255,255, 0.46)'
    } else {
        return 'rgba(255,255,255, 0.15)'
    }

}


const borderRad = 7 
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
    console.log(dayObject.thumbnail) 
    if (dayObject.thumbnail != "") {
        return (
        

<View style={{height: "100%", width: "100%"}}>
    
<SharedElement id={dayObject.id} style={{height: "100%", width: "100%"}}>
<Image source={{uri: FileSystem.documentDirectory + dayObject.thumbnail}} style={{height: "100%", width: '100%', resizeMode: 'cover', flex: 1, borderRadius: borderRad }} imageStyle={{borderRadius: 10}}>
                
</Image>
<LinearGradient
                         style={{height: '100%', width: '100%', borderRadius: borderRad, backgroundColor: 'transparent', position: 'absolute'}}
                             colors={[gradientScheme(),'rgba(255,255,255, 0)) ']}
                             start={{ x: 0.0, y: 0.0 }}
                             end={{ x: 0.0, y:0.5}}/>
</SharedElement>

</View>
                    
                )
    } else {
        if (DateTime.fromISO(dayObject.day).year != DateTime.now().year) {
            var topMargin = 75
        } else {
            var topMargin = 50
        }
        return (<View style={styles.MainContentStyle}><Text style={{fontFamily:"Sora_400Regular", fontSize: 16, textAlign: 'center', top: topMargin, overflow: 'hidden', color: text1()}}>{dayObject.notes[0].text}</Text></View>)
    }
}

const TitleContentRenderer = ({dayObject, sectionType}) => {
    const [Loaded, setLoaded] = React.useState(false);
    useFocusEffect(
        React.useCallback(() => {
          // Do something when the screen is focused
          const task = InteractionManager.runAfterInteractions(() => {
            // Expensive task
           setLoaded(true)
          });
            return () => {
            setLoaded(false)
          };
        }, []))
    
    
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
        if (Loaded){
            if (dayObject.thumbnail != "") {
                return (<Text  style={{fontFamily: "Sora_600SemiBold", fontSize: 25, textAlign: 'left', position: 'absolute',  top: 12, left: 12, width: '90%', zIndex: 1, color: text2()}}>{DateTime.fromISO(dayObject.day).toFormat('LLL d')}{suffix} {year}</Text>)

            }else {
        return (<Text  style={{fontFamily: "Sora_600SemiBold", fontSize: 25, textAlign: 'left', position: 'absolute',  top: 12, left: 12, width: '90%', zIndex: 1, color: text1()}}>{DateTime.fromISO(dayObject.day).toFormat('LLL d')}{suffix} {year}</Text>)
        }} else {
            return <View></View>
        }
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
        backgroundColor: elevatedColor(),
        width: 165,
        height: 205,
        borderRadius: borderRad,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        overflow: 'visible',
        
        alignItems: 'center',
        shadowOffset: {
            width: 0, 
            height: 8
        },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 14,
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
