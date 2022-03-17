import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import GalleryScreen from "../screens/GalleryScreens/GalleryScreen";
import ProfileScreen from "../screens/ProfileScreens/ProfileScreen";
import CameraScreen from "../screens/CreationScreens/CameraScreen"
import { StyleSheet, Text, View, Image, TouchableOpacity, Modal } from "react-native";
import GalleryImage from '../assets/icons/images-regular.svg';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {faPlus} from "@fortawesome/free-solid-svg-icons"
import { faImages, faUser, faPlusSquare } from "@fortawesome/free-regular-svg-icons";
import ProfileNavHub from "../screens/ProfileScreens/ProfileNavHub";
import { createStackNavigator } from "@react-navigation/stack";
const Tab = createBottomTabNavigator()
const RootStack = createStackNavigator()

const Placeholder = () => <View/>

const CustomTabBarButton = ({children, onPress}) => (
    
    <TouchableOpacity style={{top: -18, justifyContent: 'center', alignItems: 'center',...styles.shadow}} onPress={onPress}>
        <View style={{width: 70, height: 70, borderRadius: 35, backgroundColor:'#00468B' }}>{children}</View>
    </TouchableOpacity>
)
const Camera = () => <View style ={{flex: 1, backgroundColor: 'red'}}/>

const Tabs = () => {
    
    return (
        <Tab.Navigator screenOptions={{tabBarShowLabel: false, headerShown: false, tabBarStyle: {position: 'absolute' }}}>
            
            <Tab.Screen name="Gallery" component={GalleryScreen} options={
                {tabBarIcon: ({focused}) => (<View><FontAwesomeIcon icon={faImages} size={27} style={{color: focused ? '#00468B' : '#888888'}}/></View>),}
                }/>

            <Tab.Screen name="Add" component={Placeholder} listeners={
                ({navigation})=>({tabPress: (e) => {
                    e.preventDefault(); 
                    navigation.navigate('CameraNav')
                }})} options={
                    {tabBarIcon: ({focused}) => (<FontAwesomeIcon icon={faPlus} size={20} style={{color: 'white'}} />), tabBarButton: (props) => (<CustomTabBarButton {...props} />)}
                    }/>

            <Tab.Screen name="ProfileNav" component={ProfileNavHub} options={
                {tabBarIcon: ({focused}) => (<View><FontAwesomeIcon icon={faUser} size={23} style={{color: focused ? '#00468B' : '#888888'}}/></View>),}
                }/>
                
        </Tab.Navigator>
    )
}

export default Tabs

const styles = StyleSheet.create({

})