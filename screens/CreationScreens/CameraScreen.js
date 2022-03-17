import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

function CameraScreen() {
    return (
    <View style={styles.exampleStyle}>
        <Text>cam</Text>
    </View>
  )
}
export default CameraScreen

const styles = StyleSheet.create({
    exampleStyle:  { flex: 1, alignItems: 'center', justifyContent: 'center' }


})
