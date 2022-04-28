import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'

const MainContentRenderer = ({Image}) => {
        if (Image.length > 1) {
        return (<Image style={{height: "75%", width: '100%', resizeMode: 'cover', borderRadius: 10}} resizeMode='cover' source={Image}/>)
        } else {
            return <View/>
        }

}

const TitleContentRenderer = ({text}) => {
    
    
        
        return (<Text  style={{fontFamily: "Sora_600SemiBold", fontSize: 25, textAlign: 'left', position: 'absolute',  top: 12, left: 12, width: '90%', zIndex: 1}}>{text}</Text>)
    
}





const SpecialItem = ({onClick,text, Image}) => {
  return (
    <Pressable style={styles.GalleryItemContainer} onPress={onClick}>
            <TitleContentRenderer text={text}/>
            <MainContentRenderer Image={Image}/>
            
        </Pressable>
  )
}

export default SpecialItem

const styles = StyleSheet.create({ GalleryItemContainer :{
    backgroundColor: 'white',
    width: 165,
    height: 205,
    borderRadius: 10,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    overflow: 'hidden',
    
    alignItems: 'center',
    shadowOffset: {
        width: 2, 
        height: 2
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
    zIndex: 2,
    
    
    // marginTop: 20,
    marginHorizontal: 15,
    marginBottom: 20

},
MainContentStyle : {
    height: 140, 
    justifyContent: 'flex-start',
    shadowOffset: {
        width: 1, 
        height: 1
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
},})