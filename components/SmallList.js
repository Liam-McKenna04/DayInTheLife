import React from 'react';
import {View, StyleSheet, Button, ScrollView, Text, Pressable} from 'react-native';
import SingleGalleryItem from './SingleGalleryItem';
const SmallList = () => {
    return (
        <View>
            <View style={styles.headerContainer}>
                <Text style={{fontFamily:"Sora_600SemiBold", fontSize: 16}}>This week</Text>
                <Pressable style={{fontFamily: "Sora_600SemiBold", fontSize: 450, padding: 10}} onPress={() => {console.log('a')}}>
                    <Text style={{fontFamily:"Sora_600SemiBold", color: "#4285F4"}}>See More</Text>
                </Pressable>
            </View>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingBottom: 20}}>
                {/*snapToInterval */}
                <SingleGalleryItem/>
                <SingleGalleryItem/>
                <SingleGalleryItem/>
                <SingleGalleryItem/>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginHorizontal: 30,
        marginTop: 5,
        justifyContent: 'space-between',
        alignItems: 'center'
    }
})

export default SmallList;