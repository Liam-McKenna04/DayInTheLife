import { StyleSheet, Text, View, Pressable, Image } from 'react-native'
import React from 'react'
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
    // console.log(dayObject)
    if (dayObject.thumbnail != "") {
        // console.log(typeof(dayObject.thumbnail))
        return (<Image style={{height: "75%", width: '100%', resizeMode: 'cover', borderRadius: 10}} source={dayObject.thumbnail}/>)
    } else {
        return (
        <View>
            <Text style={{fontFamily:"Sora_600SemiBold", fontSize: 18, textAlign: 'center'}}>{dayObject.notes[0].title}</Text>
            <Text style={{fontFamily:"Sora_400Regular", fontSize: 16, textAlign: 'center', height: 150}}>{dayObject.notes[0].text}</Text>
        </View>)
    }
}



const TitleContentRenderer = ({dayObject, sectionType}) => {
    
    if (sectionType === "thisWeek") {
        const suffix = getNumberSuffix(dayObject.day.day)
        return (<View style={{justifyContent:'center', height: 70}}><Text style={{fontFamily: "Sora_600SemiBold", fontSize: 30}}>{dayObject.day.toFormat("cccc', ' LLL d")}{suffix}</Text></View>)
    }
}
const SingleWideGalleryItem = ({navigation, dayContent}) => {
    const dayObject = dayContent
  return (
    
        <Pressable style={styles.ItemContainer} onPress={() => navigation.navigate('DayView', {dayObject})}>
            <MainContentRenderer dayObject={dayContent}/>

            <TitleContentRenderer sectionType='thisWeek' dayObject={dayContent}/>
        </Pressable>
    
  )
}

export default SingleWideGalleryItem

const styles = StyleSheet.create({
        ItemContainer: {
            width: "90%",
            backgroundColor: 'white',
            borderRadius: 10,
            height: 280,
            justifyContent: 'space-between',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 10, 
            marginHorizontal: 10,
            marginBottom: 20,
            shadowOffset: {
                width: 2, 
                height: 2
            },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            
            
            
            
    }


})