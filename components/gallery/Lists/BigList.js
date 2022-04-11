import React from 'react';
import {View, StyleSheet, Text, Pressable, ScrollView} from 'react-native';
import SingleLargeGalleryItem from '../Items/SingleLargeGalleryItem'
import SpecialItem from "../Items/SpecialItem"
import AdItem from "../Items/AdItem"
import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';

function compareLuxonDates(a, b) {
    return a.toMillis() - b.toMillis()
  }

const BigList = ({navigation, dayObjects, objectCount}) => {
    //editing objects in list
    if (dayObjects === null) {
        dayObjects = []
    }
    dayObjects.sort((a, b) => compareLuxonDates(DateTime.fromISO(b.day), DateTime.fromISO(a.day)))
    let allObjects = []
    if (objectCount === 0) {
            const specialObject = {specialObject: true, text:"Preview Day", onClick: ()=> {navigation.navigate('CameraNav')}, id: uuidv4()}
            const adObject = {ad: true, id: uuidv4()}
            allObjects = [...dayObjects, specialObject, adObject]
    } else if (dayObjects.length === 0) {
        if (objectCount < 3) {
            const specialObject = {specialObject: true, text:"Rate on App Store",onClick: ()=> {}, id: uuidv4()}
            const adObject = {ad: true, id: uuidv4()}

            allObjects = [...dayObjects, specialObject, adObject]

        }else {
    const specialObject = {specialObject: true, text:"Share with your friends",onClick: ()=> {}}
    const adObject = {ad: true, id: uuidv4()}
    allObjects = [...dayObjects, specialObject, adObject]
        }
    } else {
    allObjects = [...dayObjects]
    allObjects.splice(1, 0, {ad: true, id: uuidv4()})
    console.log(allObjects)
    }
            
        
    
      
            
            
    



    




    return (
        <View  style={{flex: 1, top: -20}}>
            <View style={styles.headerContainer}>
                <Text style={{fontFamily:"Sora_600SemiBold", fontSize: 16}}>Recent days</Text> 
            </View>
            <View  style={{flex: 1}}>
                <ScrollView contentContainerStyle={styles.container}>
                    {allObjects.map(x => {
                    if (x.ad) {
                        return <AdItem key={x.id}/>
                    } else if (x.specialObject) {
                        return <SpecialItem key={x.id} onClick={()=>{x.onClick()}} text={x.text} Image=""></SpecialItem>
                    }
                     else { 
                        
                    return <SingleLargeGalleryItem key={x.day} dayObject={x} navigation={navigation}/>
                }
                    })} 
                    
                
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create(
    {headerContainer: {
    display: 'flex',
    // flex: 1,
    flexDirection: 'row',
    marginHorizontal: 30,
    marginTop: 25,
    marginBottom: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'visible'
}, container: {
    // flex: 1
    flexDirection: 'row', flexWrap: 'wrap', overflow: 'visible', paddingTop: 25, width: '100%', marginLeft: 10
}


})

export default BigList;
