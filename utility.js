
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DateTime } from 'luxon';
import {v4 as uuid} from 'uuid'
export const isFirstStartup = async() => {
    const mainDIR = await FileSystem.getInfoAsync(FileSystem.documentDirectory + "DayInTheLife")
  
    if (mainDIR.exists){
      
      return false
  
    } else {
      
      return true
  
  
  
    }
  }

export const createDirectory = async(filepath) => {
    const metaDataDir = await FileSystem.getInfoAsync(FileSystem.documentDirectory + filepath);
    const isDir = metaDataDir.isDirectory;
    if (!isDir) {
        try {
            await FileSystem.makeDirectoryAsync(
                FileSystem.documentDirectory + filepath,
                { intermediates: true }
                
            );
            console.log('success')
        } catch (e) {
            console.info("ERROR", e);
        }
    } else {
  }
  }
  

export const GetDays = async() => {
    const result = await AsyncStorage.getItem('days')
    return result != null ? JSON.parse(jsonValue) : null
}


export const AppendDayObject = async(dayObject) => {
    dayObject = [dayObject]
    const result =  await AsyncStorage.getItem('days', (err, result))
        if (result != null) {
            //Days exist
            console.log("Data found", result)
            let newDays = JSON.parse(result).concat(dayObject)
            await AsyncStorage.setItem('days', JSON.stringify(newDays))
        } else {
            //Days don't exist
           await AsyncStorage.setItem('days', JSON.stringify(dayObject))
        }
    
}

export const FinalizeVideo = async(VideoURIEnding) => {
    await FileSystem.moveAsync({from: FileSystem.documentDirectory + "DayInTheLife/Today/" + VideoURIEnding, to: FileSystem.documentDirectory + "DayInTheLife/Days/" + VideoURIEnding})
    return FileSystem.documentDirectory + "DayInTheLife/Days/" + VideoURIEnding
}



// export const UpdateVideoSegments = async(VideoList) => {
//     const metaDataDir = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'DayInTheLife/Today/');
//     const isDir = metaDataDir.isDirectory;
//     if (!isDir) {
//         console.log("DIRECTORY DOESN'T EXIST")
//     } else {

//   }
// }

export const UpdateTodayVideo = async(VideoList) => {

}

export const GetVideoSegments = async() => {
    const todaylist =  await FileSystem.readDirectoryAsync(FileSystem.documentDirectory + 'DayInTheLife/Today/')
    
    
    if (todaylist == null || todaylist == []|| todaylist == undefined) {
        return []
        
    } else {
        return todaylist.map((item)=> FileSystem.documentDirectory + 'DayInTheLife/Today/' + item )
    }

}


export const GetTodayNotes = async() => {
    const todaystr =  await AsyncStorage.getItem('today')
    const today = JSON.parse(todaystr) 
    
    if (today == null || today.notes == []|| today.notes == undefined) {
        return []
        
    } else {
        return await today.notes
    }

}

export const SetTodayNotes = async(NotesList) => {
    const today =  await AsyncStorage.getItem('today')
    
        if (today != null) {
            //Day exist
            
            let newToday = JSON.parse(today)
            console.log(NotesList)
            newToday["notes"] = NotesList
            console.log("SETTING NOTES")
            console.log(newToday)
            await AsyncStorage.removeItem('today');

            await AsyncStorage.setItem('today', JSON.stringify(newToday))
        } else {
            //Day don't exist
            console.log("today doesn't exist, err")
        }
    
}



export const CreateToday = async() => {
    const today =  await AsyncStorage.getItem('today')
    if (today != null) {
        //Day exist
        console.log('dayExists')
    } else {

        
        
        await AsyncStorage.setItem('today', JSON.stringify({day: DateTime.now(), video: "", thumbnail: "", notes: []}))
        //Day don't exist
        console.log("today created")
    }
}

export const UpdateToday = async() => {

}

export const GetToday = async() => {
    const today =  await AsyncStorage.getItem('today')
    if (today != null) {
        return await JSON.parse(today)
    }
    return null
}


export const DeleteToday = async() => {
    const today =  await AsyncStorage.getItem('today')
    const video = today.video
    FileSystem.deleteAsync(FileSystem.documentDirectory + "DayInTheLife/Today/")
    FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + "DayInTheLife/Today/")
       
}