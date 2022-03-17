import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BigList from '../../components/BigList';
import SmallList from '../../components/SmallList';

function GalleryScreen() {
    return (
    <View style={styles.GalleryContainer}>
        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 61.5, marginLeft: 28, marginBottom: 10
     }}>
            <Text style={{ fontFamily: "Sora_600SemiBold",  color: "#1A1A1A", fontSize: 24,}}>Gallery</Text>
        </View>
        <SmallList/>
        <BigList/>
    </View>
  )
}
export default GalleryScreen

const styles = StyleSheet.create({
    GalleryContainer:  {display: 'flex', flexDirection: 'column', backgroundColor: '#F2F2F6', flex: 1}


})
