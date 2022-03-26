import React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import BigList from '../../components/gallery/Lists/BigList';
import SmallList from '../../components/gallery/Lists/SmallList';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser, faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import data from '../../assets/data/DATA'
import {DateTime} from 'luxon'
import { StatusBar } from 'expo-status-bar';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';


function groupBy(collection, returnFunction) {
    var i = 0, val, index,
        values = [], result = [];
    for (; i < collection.length; i++) {

        val = returnFunction(collection[i]);
        index = values.indexOf(val);
        if (index > -1)
            result[index].push(collection[i]);
        else {
            values.push(val);
            result.push([collection[i]]);
        }
    }
    return result;
}

// var obj = groupBy(list, "group");

function GalleryScreen({DayObjects, setDayObjects}) {
    const navigation = useNavigation()

    const insets = useSafeAreaInsets();
    // const [DayObjects, setDayObjects] = useState([]);
    const [ThisWeekObjects, setThisWeekObjects] = useState([]);
    const [NotthisWeekDays, setNotthisWeekDays] = useState([]);
//     let yearObjects = groupBy(DayObjects, (x) => x['day'].startOf('week').year)
//     let WeekObjects = []
//     yearObjects.forEach(yearList => {
//         let y = groupBy(yearList, (x) => x['day']['weekNumber'])
//         y.forEach(z => WeekObjects.push(z))
// })
        // const notThisWeekObjects = WeekObjects.filter(x => !((x[0].day.weekNumber === DateTime.now().weekNumber) && (x[0].day.year === DateTime.now().year)))

    
    useEffect(async() => {
        const pastDaysSTR = await AsyncStorage.getItem('PastDays')
        const pastDays = await JSON.parse(pastDaysSTR)
         setDayObjects(pastDays)
          
    
    }, []);


    useEffect(async()=> {
        console.log('DAYOBJECTS')
         console.log(DayObjects)   
        //  await FileSystem.getInfoAsync(DayObjects[0].video)
         console.log('-----') 
         if (DayObjects != null){ 
        setThisWeekObjects(DayObjects.filter(Day => (DateTime.fromISO(Day.day).weekNumber === DateTime.now().weekNumber) && (DateTime.fromISO(Day.day).year === DateTime.now().year)))
        setNotthisWeekDays(DayObjects.filter(Day => !((DateTime.fromISO(Day.day).weekNumber === DateTime.now().weekNumber) && (DateTime.fromISO(Day.day).year === DateTime.now().year))))
         }  
         setNotthisWeekDays(DayObjects)
 

    }, [DayObjects])
    
    return (
    <View navigation={navigation} style={styles.GalleryContainer}>
        <StatusBar style='auto'/>
        <View navigation={navigation} style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: (insets.top + 5), marginLeft: 18, marginBottom: 10, marginRight: 18}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Pressable style={{justifyContent: 'center', alignItems: 'center', padding: 10}} onPress={ () => navigation.navigate('ProfileNav')}>
                    <FontAwesomeIcon icon={faUser} size={20}/>
                </Pressable>
                <Text style={{ fontFamily: "Sora_600SemiBold",  color: "#1A1A1A", fontSize: 24, marginLeft: 10, alignItems: 'center'}}>Gallery</Text>
            </View>

            <Pressable style={{justifyContent: 'center', alignItems: 'center', padding: 10}} onPress={ () => navigation.navigate('CameraNav')}>
                <FontAwesomeIcon icon={faSquarePlus} size={20}/>
            </Pressable>
        </View>

        <ScrollView>
        {ThisWeekObjects.length == 0 ? <View/>: <SmallList dayObjects={ThisWeekObjects} navigation={navigation}/> } 
        <BigList dayObjects={NotthisWeekDays}  navigation={navigation}/>  

        </ScrollView>  
    </View>
  )
}
export default GalleryScreen

const styles = StyleSheet.create({
    GalleryContainer:  {display: 'flex', flexDirection: 'column', backgroundColor: '#F2F2F6', flex: 1}


})
