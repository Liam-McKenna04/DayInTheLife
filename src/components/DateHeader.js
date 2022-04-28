import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import { FontAwesome } from '@expo/vector-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import { faAnglesUp, faAngleRight, faShare, faUserGroup, faComment, faArrowUpFromBracket, faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';

const DateHeader = ({headerContent, setShareVisable}) => {
    const navigation = useNavigation()
    return (
        <View style={{alignItems: 'center'}}>
            <View style={styles.header}>
                
                    
                <FontAwesome.Button name="arrow-left"  onPress={() => {navigation.goBack()}} iconStyle={{color: "#1A1A1A" }} size={24} underlayColor="transparent" activeOpacity={0.2} backgroundColor="transparent"/>
                    
                
                
                <Text style={{fontFamily: 'Sora_600SemiBold', color: "#1A1A1A", fontSize: 26, textAlign: 'left', top: 2}}>{headerContent}</Text>
                
                <TouchableOpacity
                style={{

                alignItems:'center',
                justifyContent:'center',
                width:40,
                height:40,
                
              }} onPress={()=> {setShareVisable(true)}}>
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} size={22}></FontAwesomeIcon>

        </TouchableOpacity>
            </View>
            <View style={{ borderBottomColor: '#888888', borderBottomWidth: 1, width: "95%", marginTop: 10}}/>

        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 46,
        
        paddingHorizontal: 15 ,
        width: '100%'
    },
})

export default DateHeader;
