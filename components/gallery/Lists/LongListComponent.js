import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'
import SingleWideGalleryItem from '../Items/SingleWideGalleryItem'




const LongListComponent = ({navigation, weekContent}) => {
  return (
    <ScrollView  showsVerticalScrollIndicator={false}  style={{flex: 1, paddingTop: 20}} contentContainerStyle={{paddingBottom: 100, alignItems: 'center'}}>
        
        {weekContent.map(x => <SingleWideGalleryItem key={x.day} navigation={navigation} dayContent={x}/>)}
        
    </ScrollView>
  )
}

export default LongListComponent

const styles = StyleSheet.create({})