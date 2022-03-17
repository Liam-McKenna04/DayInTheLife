import React from 'react';
import {View, StyleSheet, Text, Pressable} from 'react-native';



const MainContentRenderer = ({dayObject}) => {
    if (dayObject.image != null) {
        return (<View><Text>Hi</Text></View>)
    } else {
        return (<View style={styles.MainContentStyle}><Text style={{fontFamily:"Sora_400Regular", fontSize: 16, textAlign: 'center'}}>{dayObject.notes[0].title}</Text></View>)
    }
}

const TitleContentRenderer = ({dayObject, sectionType}) => {
    
    if (sectionType === "thisWeek") {
        const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        return (<Text style={{fontFamily: "Sora_600SemiBold", fontSize: 20}}>{weekday[dayObject.day.getDay()]}</Text>)
    }
}

const dayObjects = [{"day": new Date(),"image": null, "notes": [{"title": "Lorem ipsum dolor sit amet, consectetur deus"}]}]


const SingleLargeGalleryItem = () => {
    return (
        <Pressable style={styles.GalleryItemContainer}>

            <MainContentRenderer dayObject={dayObjects[0]}/>
            <TitleContentRenderer dayObject={dayObjects[0]} sectionType="thisWeek"/>
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
        alignItems: 'center',
        shadowOffset: {
            width: 2, 
            height: 2
        },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        
        // marginTop: 20,
        marginLeft: 30,
        marginBottom: 20

    },
    MainContentStyle : {
        height: 140, 
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

export default SingleLargeGalleryItem;
