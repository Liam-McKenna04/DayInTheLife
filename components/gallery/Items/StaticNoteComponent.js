import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'

const StaticNoteComponent = ({NoteClickHandler, title, time, text}) => {
  // console.log(NoteClickHandler())
  return (
    <Pressable style={styles.container} onPress={() => {NoteClickHandler()}}>
      <Text style={{fontFamily: 'Sora_400Regular', fontSize: 16 }}>{time}</Text>
      <Text style={{fontFamily: 'Sora_600SemiBold', fontSize: 36}}>{title}</Text>
      <Text style={{fontFamily: 'Sora_400Regular', fontSize: 16}}>{text}</Text>
    </Pressable>
  )
}

export default StaticNoteComponent

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        width: "90%", 
        backgroundColor: 'white',
        marginTop: 25,
        padding: 15,
        borderRadius: 5,
    }
})