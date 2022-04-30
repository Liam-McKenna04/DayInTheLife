import { Appearance } from 'react-native';

export const colorScheme = 'light'
const surfaceDark = '#121212'
const surfaceLight = '#EEEEEE'
const elevatedDark = 'rgba(255,255,255, 0.08)'
const dark1 = "#333"

const dark3 = "#1A1A1A"
const dark2 = '#181818'
const light1 = 'rgba(255,255,255, 0.87)'
const light2 = '#EEEEEE'
const primary1 = '#00468B'
const highlight1 = '#FFE45C'

//background


export const surfaceColor = () => {
    // console.log("scheme: " + colorScheme)
    if (colorScheme ===  'light') {
        return surfaceLight
    } else {
        return surfaceDark
    }
}


export const elevatedColor = () => {
    if (colorScheme ===  'light') {
        return light1
    } else {
        return elevatedDark
    }
}

export const neutral2 = () => {
    if (colorScheme ===  'light') {
        return light1
    } else {
        return dark1
    }
}

export const text1 = () => {
    if (colorScheme ===  'light') {
        return dark1
    } else {
        return light1
    }
}

export const text2 = () => {
    if (colorScheme ===  'light') {
        return dark3
    } else {
        return light1
    }
}


export const revNeutral2 = () => {
    if (colorScheme ===  'light') {
        return dark2
    } else {
        return light2
    }
}

export const placeholderColor = () => {
    if (colorScheme ===  'light') {
        return  '#a9a9a9'
    } else {
        return 'rgba(255,255,255,0.38)'
    }
   
}