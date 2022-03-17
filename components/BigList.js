import React from 'react';
import {View, StyleSheet, Text, Pressable, ScrollView} from 'react-native';
import SingleLargeGalleryItem from './SingleLargeGalleryItem';
const BigList = () => {
    return (
        <View style={{flex: 1, top: -20}}>
            <View style={styles.headerContainer}>
                <Text style={{fontFamily:"Sora_600SemiBold", fontSize: 16}}>Recent weeks</Text> 
            </View>
            <View style={{flex: 1, marginBottom: 50}}>
                <ScrollView contentContainerStyle={styles.container}>
                
                    <SingleLargeGalleryItem/>
                    <SingleLargeGalleryItem/>
                    <SingleLargeGalleryItem/>
                    <SingleLargeGalleryItem/>
                    <SingleLargeGalleryItem/>
                    <SingleLargeGalleryItem/>
                    <SingleLargeGalleryItem/>
                    <SingleLargeGalleryItem/>
                    <SingleLargeGalleryItem/>
                    <SingleLargeGalleryItem/>
                    <SingleLargeGalleryItem/>
                    <SingleLargeGalleryItem/>
                    <SingleLargeGalleryItem/>
                    <SingleLargeGalleryItem/>
                    <SingleLargeGalleryItem/>
                    <SingleLargeGalleryItem/>
                    <SingleLargeGalleryItem/>
                    <SingleLargeGalleryItem/>
                    <SingleLargeGalleryItem/>
                    <SingleLargeGalleryItem/>
                    <SingleLargeGalleryItem/>
                    <SingleLargeGalleryItem/>
                
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
    marginBottom: 30,
    justifyContent: 'space-between',
    alignItems: 'center'
}, container: {
    // flex: 1
    flexDirection: 'row', flexWrap: 'wrap'
}


})

export default BigList;
