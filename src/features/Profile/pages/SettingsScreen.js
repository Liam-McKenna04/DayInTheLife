import React from 'react';
import {View, StyleSheet, Text, Pressable} from 'react-native';
import { FontAwesome } from '@expo/vector-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import { faAnglesUp, faAngleRight, faShare, faUserGroup, faComment } from '@fortawesome/free-solid-svg-icons';

 const SettingsContainer = props => {
    return (
        <View style={{backgroundColor: 'white', display: 'flex', flexDirection: 'column', width: '89%', alignItems: 'center', marginBottom: 52}}>
            <View style={{flexDirection: 'row', alignItems: 'center',  margin: 17, justifyContent: 'flex-start', width: '91%'}}>
                <FontAwesomeIcon icon={props.icon} size={30} style={{color: 'black', marginRight: 7}}/>
                <Text style={{textAlign: 'center', fontFamily: 'Sora_600SemiBold', fontSize: 16}}>{props.text}</Text>
                
            </View>
            <View style={{ borderBottomColor: '#888888', borderBottomWidth: 1, width: "91%", marginTop: 0}}/>
            <View style={{marginTop: 26, marginBottom: 26, position: 'relative', width: "100%"}}>
                {props.children}
            </View>
        </View>
    )
 }

const IndividualSettingNavigate = ({text, onPress}) => {
        return (
        <Pressable onPress={onPress} style={styles.press}>
            
               
            <Text style={{textAlign: "left", fontFamily: "Sora_400Regular", fontSize: 16, color: '#888888'}}>{text}</Text>

            
            <FontAwesomeIcon icon={faAngleRight} size={20} style={{color: '#888888'}}/>
        </Pressable>
        )
}

const IndividualSettingSwitch = () => {

}

const SettingsScreen = ({navigation}) => {
    return (
        <View style={{backgroundColor: '#F2F2F6'}}>
            <View style={styles.header}>
                
                    
                <FontAwesome.Button name="arrow-left"  onPress={() => {navigation.goBack()}} iconStyle={{color: "#1A1A1A" }} size={24} underlayColor="transparent" activeOpacity={0.2} backgroundColor="transparent"/>
                    
                
                
                <Text style={{fontFamily: 'Sora_600SemiBold', color: "#1A1A1A", fontSize: 24, textAlign: 'left', top: 0, left: -24}}>Settings</Text>
                <View></View>
            </View>


            
            <View style={styles.body}>
                <SettingsContainer icon={faAnglesUp} text='Account'>
                    <IndividualSettingNavigate text="Edit Profile"/>
                    <IndividualSettingNavigate text="Validate Email"/>
                    <IndividualSettingNavigate text="Change Password"/>
                    <IndividualSettingNavigate text="Privacy"/>
                </SettingsContainer>
                <SettingsContainer icon={faAnglesUp} text='Notifications'></SettingsContainer>
            </View>
            <View style={styles.footer}>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 55,
        marginBottom: 45,
        margin: 20 
    },
    body: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    page : {

    },
    press: {
        // backgroundColor: "blue", 
        paddingHorizontal: 20,
        
        
        height: 50, 
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "space-between", 
        
    }

})

export default SettingsScreen;
