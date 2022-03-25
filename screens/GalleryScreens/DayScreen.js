import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import DateHeader from '../../components/gallery/DateHeader';
import DayScrollViewComponent from '../../components/gallery/DayScrollViewComponent';
import { DateTime } from 'luxon';
const DayScreen = ({route, navigation}) => {
    const {dayObject} = route.params
    return (
        <View style={{flex: 1, backgroundColor: '#F2F2F6'}}>
            
            <DateHeader navigation={navigation} headerContent={DateTime.fromISO(dayObject.day).toFormat("cccc', ' LLL d")}/>
            <DayScrollViewComponent dayObject={dayObject} />
        </View>
    );  
}

const styles = StyleSheet.create({})

export default DayScreen;
