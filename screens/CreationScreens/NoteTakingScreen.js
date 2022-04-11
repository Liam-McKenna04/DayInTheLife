import React from 'react';
import { useState, useRef, useEffect } from 'react';
import {View, StyleSheet, Text, Pressable, ScrollView, TextInput, TouchableOpacity} from 'react-native';
import { FontAwesome } from '@expo/vector-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faVideo, faVideoCamera, faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
import { DateTime } from 'luxon';
import { StatusBar } from 'expo-status-bar';
import { Keyboard } from 'react-native'
import { GetTodayNotes, SetTodayNotes } from '../../utility';
//https://reactnative.dev/docs/appstate
const CompletedNote = ({FinishedEditing, title, textContent, date, index, setAnyEditable, AnyEditable, setIndexEditable, EditTitle, setEditTitle, EditText, setEditText, }) => {
    const editTextBody = useRef()
    const [Editable, setEditable] = useState(true);
    useEffect(() => {
        setEditable(false)
    }, [FinishedEditing]);
    if (!Editable) {
    
    return (
        <Pressable style={{backgroundColor: "white", marginBottom: 30, paddingTop: 15, paddingHorizontal: 20, paddingBottom: 30, justifyContent: 'flex-start', alignItems:'flex-start', flexDirection: 'column', width: '90%', borderRadius: 5}}
        
        onPress ={() => {
            if (AnyEditable) {
                console.log("There is already a button being edited")
            } else {
                setEditable(true)
            setAnyEditable(true)
            setIndexEditable(index)
            setEditTitle(title)
            setEditText(textContent)
            console.log(index)
            }
            
            }}
        >
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{marginBottom: 5}}>
                    {DateTime.fromISO(date).toFormat("t")}
                    
                </Text>
            </View>
            <Text style={{fontFamily: 'Sora_600SemiBold', fontSize: 36, marginBottom: 5}}>{title}</Text>
            <Text style={{fontFamily: 'Sora_400Regular', fontSize: 16, marginHorizontal: 10}}>{textContent}</Text>
        </Pressable>
    )
    } else {
        
        return (
            <View style={{backgroundColor: "white", marginBottom: 30, paddingTop: 15, paddingHorizontal: 20, paddingBottom: 30, justifyContent: 'flex-start', alignItems:'flex-start', flexDirection: 'column', width: '90%', borderRadius: 5}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{marginBottom: 5}}>
                    {DateTime.fromISO(date).toFormat("t")}
                    
                    </Text>
                </View>
                <TextInput style={{fontFamily: 'Sora_600SemiBold', fontSize: 36, marginBottom: 5, width: '100%'}} multiline={true} 
                    onChangeText={setEditTitle} value={EditTitle} blurOnSubmit={true}
                    onSubmitEditing={()=> editTextBody.current.focus()}
                    autoCapitalize='sentences' autoFocus={true}></TextInput>
                <TextInput ref={editTextBody} style={{fontFamily: 'Sora_400Regular', fontSize: 16, marginHorizontal: 10, width: '100%'}} multiline={true} 
                    onChangeText={setEditText} value={EditText}
                >

                </TextInput>
            </View>
        )
    }
}





const TopLeftButton = ({navigation, AnyEditable, Notes, setNotes, IndexEditable, setIndexEditable, setAnyEditable}) => {
    if (AnyEditable) {
        return (
        <TouchableOpacity style={{marginLeft: 12, padding: 5}} onPress={() => {
            console.log(IndexEditable)
            let filteredNotes = Notes.filter((element, index) => {
                
                
                 return index !== IndexEditable})
            
            setNotes(filteredNotes)
                setIndexEditable(null)
                setAnyEditable(false)
        }}
            
            >
            <FontAwesomeIcon icon={faTrash} size={22} />
        </TouchableOpacity>

        )
    }
    return (
        <FontAwesome.Button name="arrow-left"  onPress={() => {navigation.navigate('GalleryNav')}} iconStyle={{color: "#1A1A1A" }} size={24} underlayColor="transparent" activeOpacity={0.2} backgroundColor="transparent"/>
    )   
}

const TopRightButton = ({FinishedEditing, setFinishedEditing, NoteTitle, NoteText, navigation, Notes, setNotes, setNoteText, setNoteTitle, AnyEditable, EditTitle, EditText, IndexEditable, setIndexEditable, setAnyEditable}) => {
    if (AnyEditable){
        return  (
            <Pressable style={{marginRight: 12, padding: 5}} onPress={() => {setNotes([...Notes.slice(0, IndexEditable), 
                                                                        {title: EditTitle, text: EditText, date: Notes[IndexEditable].date},
                                                                        ...Notes.slice(IndexEditable + 1)
                                                                        
                                                                        ])
                                                                setAnyEditable(false)
                                                                setIndexEditable(null)
                                                                setFinishedEditing(!FinishedEditing)
                                                                        }}>
                <FontAwesomeIcon icon={faCheck} size={24} />
            </Pressable>
    
            )
    }
return (
    <View>

                    
                    <TouchableOpacity style={{marginRight: 12, padding: 5}} onPress={(NoteTitle === "" ) && (NoteText === "") ? 
                    () => navigation.navigate('Camera') :
                    () => {
                        if (NoteTitle === "") {
                            var SubmitTitle = "Note " + (Notes.length + 1)
                        } else {
                            var SubmitTitle = NoteTitle
                        }
                        
                        setNotes([{title: SubmitTitle, text: NoteText, date: DateTime.now()}, ...Notes])
                        setNoteText("")
                        setNoteTitle("")
                        Keyboard.dismiss()
                
                }
                    }>
                        <FontAwesomeIcon icon={(NoteTitle === "" ) && (NoteText === "") ?  faVideoCamera : faCheck} size = {24}></FontAwesomeIcon>
                    </TouchableOpacity>


                </View>
)
}











const Notetakingscreen = ({navigation}) => {
    const [NoteTitle, setNoteTitle] = useState("")
    const [NoteText, setNoteText] = useState("");
    const textBody = useRef()
    
    const [Notes, setNotes] = useState([]);
    const [AnyEditable, setAnyEditable] = useState(false);
    const [IndexEditable, setIndexEditable] = useState(null);
    const [EditTitle, setEditTitle] = useState("");
    const [EditText, setEditText] = useState("");
    const [FinishedEditing, setFinishedEditing] = useState(false);
    const [Loaded, setLoaded] = useState(false);

    useEffect(() => {
        // setNotes(() => GetTodayNotes())
        GetTodayNotes().then((value)=> {setNotes(value)
        setLoaded(true)
        })
        

       
    }, []);

    useEffect(()=> {
        if (Loaded) {
            SetTodayNotes(Notes)
        }


    }, [Notes])
    return (
        <View style={{flex: 1, backgroundColor: '#F2F2F6'}}>
            <StatusBar style='auto'/>
            <View style={{alignItems: 'center'}}>
            <View style={styles.header}>
                
                    
                <TopLeftButton setAnyEditable={setAnyEditable} setIndexEditable={setIndexEditable} navigation={navigation} AnyEditable={AnyEditable} Notes={Notes} setNotes={setNotes} IndexEditable={IndexEditable}/>
                
                
                <Text style={{fontFamily: 'Sora_600SemiBold', color: "#1A1A1A", fontSize: 36, textAlign: 'left', top: 2,}}>Notes</Text>
                <TopRightButton FinishedEditing={FinishedEditing} setFinishedEditing={setFinishedEditing} setIndexEditable={setIndexEditable} setAnyEditable={setAnyEditable} IndexEditable={IndexEditable} EditText={EditText} EditTitle={EditTitle} AnyEditable={AnyEditable} navigation={navigation} NoteTitle={NoteTitle} NoteText={NoteText} Notes={Notes} setNotes={setNotes} setNoteTitle={setNoteTitle} setNoteText={setNoteText}/>
            </View>
            <View style={{ borderBottomColor: '#888888', borderBottomWidth: 1, width: "95%", marginTop: 10, marginBottom: 20}}/>

            </View>


            <ScrollView style={{width: "100%", flex: 1}} contentContainerStyle={{alignItems:'flex-start'}}>
                <View style={{width: '100%', paddingHorizontal: 40, display: AnyEditable ? 'none': 'flex'}}>
                    <TextInput multiline={true} style={{fontFamily: 'Sora_600SemiBold', color: "#1A1A1A", fontSize: 32, textAlign: 'left', width:"100%"}} 
                    onChangeText={setNoteTitle} value={NoteTitle} placeholder="New Note" blurOnSubmit={true} autoFocus={true}
                    onSubmitEditing={()=> textBody.current.focus()}
                    autoCapitalize='sentences'
                    />

                    
                    <TextInput ref={textBody} multiline={true}
                    style={{marginTop:10, fontFamily: 'Sora_400Regular', color: "#1A1A1A", fontSize: 16, textAlign: 'left', paddingBottom: 150}}
                    onChangeText={setNoteText} value={NoteText} blurOnSubmit={false}
                    onSubmitEditing={() => {
                        
                        // setNotes([{title: NoteTitle, text: NoteText, date: DateTime.now()}, ...Notes])
                        // setNoteText("")
                        // setNoteTitle("")
                
                }}
                    />
                    
                    
                </View>
                <View style={{width: '100%', alignItems: 'center'}}>
                {Notes.map((note, index)=> <CompletedNote 
                FinishedEditing={FinishedEditing} 
                EditText={EditText}
                 EditTitle={EditTitle} 
                 setEditTitle={setEditTitle} 
                 setEditText={setEditText} 
                 setIndexEditable={setIndexEditable} 
                 AnyEditable={AnyEditable} 
                 setAnyEditable={setAnyEditable} 
                 key={note.date} 
                 textContent={note.text} 
                 title={note.title} 
                 date={note.date} 
                 index={index}/>)
                
                }
                </View>
            </ScrollView>



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

export default Notetakingscreen;
