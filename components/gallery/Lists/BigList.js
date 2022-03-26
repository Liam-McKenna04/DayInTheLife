import React from 'react';
import {View, StyleSheet, Text, Pressable, ScrollView} from 'react-native';
import SingleLargeGalleryItem from '../Items/SingleLargeGalleryItem'
import { DateTime } from 'luxon';
function compareLuxonDates(a, b) {
    return a.toMillis() - b.toMillis()
  }

const BigList = ({navigation, dayObjects}) => {
    if (dayObjects === null) {
        dayObjects = []
    }
    dayObjects.sort((a, b) => compareLuxonDates(DateTime.fromISO(b.day), DateTime.fromISO(a.day)))
    const exampleObject1 = {specialObject: true, otherdatahere: false}
    const exampleObject2 = {}
    x = 2
    dayObjects.splice(x, 0, exampleObject1)
    return (
        <View  style={{flex: 1, top: -20}}>
            <View style={styles.headerContainer}>
                <Text style={{fontFamily:"Sora_600SemiBold", fontSize: 16}}>Recent days</Text> 
            </View>
            <View  style={{flex: 1}}>
                <ScrollView contentContainerStyle={styles.container}>
                    {dayObjects.map(x => {
                    if (x.specialObject) {
                    } else { 
                        
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
