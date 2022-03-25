import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import DateHeader from '../../components/gallery/DateHeader';
import LongListComponent from '../../components/gallery/Lists/LongListComponent';

const WeekScreen = ({route, navigation}) => {
    const {days} = route.params
    // console.log(days[0].day.startOf('week').toISODate())
    
    return (
        <View style={{flex: 1}}>
            
            <DateHeader navigation={navigation} headerContent={days[0].day.startOf('week').toFormat("'Week of' LLL dd yyyy")}/>
            <LongListComponent weekContent={days} navigation={navigation}/>
            
        </View>
    );
}

const styles = StyleSheet.create({})

export default WeekScreen;
