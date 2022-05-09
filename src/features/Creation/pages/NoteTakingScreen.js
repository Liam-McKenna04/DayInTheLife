import React from "react";
import { useState, useRef, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Appearance,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faVideo,
  faVideoCamera,
  faCheck,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { DateTime } from "luxon";
import { StatusBar } from "expo-status-bar";
import { Keyboard } from "react-native";
import { GetTodayNotes, SetTodayNotes } from "../../../../utility";
import Swiper from "react-native-swiper";
import AppContext from "../../../../AppContext";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import {
  neutral2,
  text1,
  revNeutral2,
  surfaceColor,
  elevatedColor,
  colorScheme,
  placeholderColor,
} from "../../../utils/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const CompletedNote = ({
  FinishedEditing,
  title,
  textContent,
  date,
  index,
  setAnyEditable,
  AnyEditable,
  setIndexEditable,
  EditTitle,
  setEditTitle,
  EditText,
  setEditText,
}) => {
  const editTextBody = useRef();
  const [Editable, setEditable] = useState(true);
  useEffect(() => {
    setEditable(false);
  }, [FinishedEditing]);

  if (!Editable) {
    return (
      <Pressable
        style={{
          backgroundColor: elevatedColor(),
          marginBottom: 30,
          paddingTop: 15,
          paddingHorizontal: 20,
          paddingBottom: 30,
          justifyContent: "flex-start",
          alignItems: "flex-start",
          flexDirection: "column",
          width: "90%",
          borderRadius: 5,
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.15,
          shadowRadius: 10,
          elevation: 5,
        }}
        onPress={() => {
          if (AnyEditable) {
            console.log("There is already a button being edited");
          } else {
            setEditable(true);
            setAnyEditable(true);
            setIndexEditable(index);
            setEditTitle(title);
            setEditText(textContent);
            console.log(index);
          }
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ marginBottom: 5, color: text1() }}>
            {DateTime.fromISO(date).toFormat("t")}
          </Text>
        </View>
        <Text
          style={{
            fontFamily: "Sora_600SemiBold",
            fontSize: 36,
            marginBottom: 5,
            color: text1(),
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontFamily: "Sora_400Regular",
            fontSize: 16,
            marginHorizontal: 10,
            color: text1(),
          }}
        >
          {textContent}
        </Text>
      </Pressable>
    );
  } else {
    return (
      <View
        style={{
          backgroundColor: elevatedColor(),
          marginBottom: 30,
          paddingTop: 15,
          paddingHorizontal: 20,
          paddingBottom: 30,
          justifyContent: "flex-start",
          alignItems: "flex-start",
          flexDirection: "column",
          width: "90%",
          borderRadius: 5,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ marginBottom: 5, color: text1() }}>
            {DateTime.fromISO(date).toFormat("t")}
          </Text>
        </View>
        <TextInput
          style={{
            fontFamily: "Sora_600SemiBold",
            fontSize: 36,
            marginBottom: 5,
            width: "100%",
            color: text1(),
          }}
          multiline={true}
          onChangeText={setEditTitle}
          value={EditTitle}
          blurOnSubmit={true}
          autoFocus={true}
          keyboardAppearance={Appearance.getColorScheme()}
          onSubmitEditing={() => editTextBody.current.focus()}
          autoCapitalize="sentences"
        ></TextInput>
        <TextInput
          ref={editTextBody}
          style={{
            fontFamily: "Sora_400Regular",
            fontSize: 16,
            marginHorizontal: 10,
            width: "100%",
            color: text1(),
          }}
          multiline={true}
          onChangeText={setEditText}
          value={EditText}
          keyboardAppearance={Appearance.getColorScheme()}
        ></TextInput>
      </View>
    );
  }
};

const TopLeftButton = ({
  AnyEditable,
  Notes,
  setNotes,
  IndexEditable,
  setIndexEditable,
  setAnyEditable,
  swiperRef,
}) => {
  const navigation = useNavigation();
  if (AnyEditable) {
    return (
      <TouchableOpacity
        style={{ marginLeft: 12, padding: 5 }}
        onPress={() => {
          console.log(IndexEditable);
          let filteredNotes = Notes.filter((element, index) => {
            return index !== IndexEditable;
          });

          setNotes(filteredNotes);
          setIndexEditable(null);
          setAnyEditable(false);
          Keyboard.dismiss();
          swiperRef.current.scrollBy(1, true);
        }}
      >
        <FontAwesomeIcon icon={faTrash} size={22} color={text1()} />
      </TouchableOpacity>
    );
  }
  return (
    <FontAwesome.Button
      name="arrow-left"
      onPress={() => {
        navigation.navigate("GalleryNav");
      }}
      iconStyle={{ color: text1() }}
      size={24}
      underlayColor="transparent"
      activeOpacity={0.2}
      backgroundColor="transparent"
    />
  );
};

const TopRightButton = ({
  swiperRef,
  FinishedEditing,
  setFinishedEditing,
  NoteTitle,
  NoteText,
  Notes,
  setNotes,
  setNoteText,
  setNoteTitle,
  AnyEditable,
  EditTitle,
  EditText,
  IndexEditable,
  setIndexEditable,
  setAnyEditable,
}) => {
  if (AnyEditable) {
    return (
      <Pressable
        style={{ marginRight: 12, padding: 5 }}
        onPress={() => {
          setNotes([
            ...Notes.slice(0, IndexEditable),
            {
              title: EditTitle,
              text: EditText,
              date: Notes[IndexEditable].date,
            },
            ...Notes.slice(IndexEditable + 1),
          ]);
          setAnyEditable(false);
          setIndexEditable(null);
          setFinishedEditing(!FinishedEditing);
          Keyboard.dismiss();
          swiperRef.current.scrollBy(1, true);
        }}
      >
        <FontAwesomeIcon icon={faCheck} size={24} color={text1()} />
      </Pressable>
    );
  }
  return (
    <View>
      <TouchableOpacity
        style={{ marginRight: 12, padding: 5 }}
        onPress={() => {
          if (NoteTitle === "" && NoteText === "") {
            Keyboard.dismiss();
            if (swiperRef.current) {
              swiperRef.current.scrollBy(-1, true);
            } else {
              console.log("a");
            }
          } else {
            Keyboard.dismiss();

            if (NoteTitle === "") {
              var SubmitTitle = "Note " + (Notes.length + 1);
            } else {
              var SubmitTitle = NoteTitle;
            }
            setNotes([
              { title: SubmitTitle, text: NoteText, date: DateTime.now() },
              ...Notes,
            ]);
            setNoteText("");
            setNoteTitle("");
            console.log("aaaaaaaaa");

            swiperRef.current.scrollBy(1, true);
            Keyboard.dismiss();
          }
        }}
      >
        <FontAwesomeIcon
          icon={NoteTitle === "" && NoteText === "" ? faVideoCamera : faCheck}
          size={24}
          color={text1()}
        ></FontAwesomeIcon>
      </TouchableOpacity>
    </View>
  );
};

const Notetakingscreen = ({ swiperRef }) => {
  const [NoteTitle, setNoteTitle] = useState("");
  const [NoteText, setNoteText] = useState("");
  const textBody = useRef();
  const [Notes, setNotes] = useState([]);
  const [AnyEditable, setAnyEditable] = useState(false);
  const [IndexEditable, setIndexEditable] = useState(null);
  const [EditTitle, setEditTitle] = useState("");
  const [EditText, setEditText] = useState("");
  const [FinishedEditing, setFinishedEditing] = useState(false);
  const [Loaded, setLoaded] = useState(false);
  const { DayObjects, setDayObjects } = useContext(AppContext);

  useEffect(() => {
    GetTodayNotes().then((value) => {
      setNotes(value);
      setLoaded(true);
    });
  }, []);
  useEffect(() => {
    GetTodayNotes().then((value) => {
      setNotes(value);
      setLoaded(true);
    });
  }, [DayObjects]);

  useEffect(() => {
    if (Loaded) {
      SetTodayNotes(Notes);
    }
  }, [Notes]);
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{ flex: 1, backgroundColor: surfaceColor() }}
      keyboardShouldPersistTaps={"always"}
    >
      {/* <StatusBar style='dark'/> */}
      <View style={{ alignItems: "center" }}>
        <View style={[styles.header, { marginTop: insets.top + 7 }]}>
          <TopLeftButton
            setAnyEditable={setAnyEditable}
            setIndexEditable={setIndexEditable}
            AnyEditable={AnyEditable}
            Notes={Notes}
            setNotes={setNotes}
            IndexEditable={IndexEditable}
            swiperRef={swiperRef}
          />

          <Text
            style={{
              fontFamily: "Sora_600SemiBold",
              color: text1(),
              fontSize: 36,
              textAlign: "left",
              top: 2,
            }}
            onPress={() => {
              Keyboard.dismiss();
            }}
          >
            Notes
          </Text>
          <TopRightButton
            swiperRef={swiperRef}
            FinishedEditing={FinishedEditing}
            setFinishedEditing={setFinishedEditing}
            setIndexEditable={setIndexEditable}
            setAnyEditable={setAnyEditable}
            IndexEditable={IndexEditable}
            EditText={EditText}
            EditTitle={EditTitle}
            AnyEditable={AnyEditable}
            NoteTitle={NoteTitle}
            NoteText={NoteText}
            Notes={Notes}
            setNotes={setNotes}
            setNoteTitle={setNoteTitle}
            setNoteText={setNoteText}
          />
        </View>
        <View
          style={{
            borderBottomColor: "#888888",
            borderBottomWidth: 1,
            width: "95%",
            marginTop: 10,
          }}
        />
      </View>

      <ScrollView
        style={{ width: "100%", flex: 1, paddingTop: 20 }}
        contentContainerStyle={{ alignItems: "flex-start" }}
        keyboardShouldPersistTaps={"always"}
        nestedScrollEnabled={true}
      >
        <View
          style={{
            width: "100%",
            paddingHorizontal: 40,
            display: AnyEditable ? "none" : "flex",
          }}
        >
          <TextInput
            multiline={true}
            style={{
              fontFamily: "Sora_600SemiBold",
              color: text1(),
              fontSize: 32,
              textAlign: "left",
              width: "100%",
            }}
            onChangeText={setNoteTitle}
            value={NoteTitle}
            placeholder="New Note"
            blurOnSubmit={true}
            keyboardAppearance={Appearance.getColorScheme()}
            onSubmitEditing={() => textBody.current.focus()}
            placeholderTextColor={placeholderColor()}
            autoCapitalize="sentences"
          />

          <TextInput
            ref={textBody}
            multiline={true}
            style={{
              marginTop: 10,
              fontFamily: "Sora_400Regular",
              color: text1(),
              fontSize: 16,
              textAlign: "left",
              paddingBottom: 150,
            }}
            onChangeText={setNoteText}
            value={NoteText}
            blurOnSubmit={false}
            keyboardAppearance={Appearance.getColorScheme()}
            onSubmitEditing={() => {
              // setNotes([{title: NoteTitle, text: NoteText, date: DateTime.now()}, ...Notes])
              // setNoteText("")
              // setNoteTitle("")
            }}
          />
        </View>
        <View style={{ width: "100%", alignItems: "center" }}>
          {Notes.map((note, index) => (
            <CompletedNote
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
              index={index}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 46,

    paddingHorizontal: 15,
    width: "100%",
  },
});

export default Notetakingscreen;
