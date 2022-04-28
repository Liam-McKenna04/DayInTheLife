import { Appearance } from 'react-native';

const colorScheme = Appearance.getColorScheme()
const dark1 = '#0e1111'
const dark2 = '#181818'
const light1 = '#FFFFFF'
const light2 = '#EEEEEE'
const primary1 = '#00468B'
const highlight1 = '#FFE45C'

//background


const neutral1 = () => {
    if (colorScheme ===  'light') {
        return light1
    } else {
        return dark1
    }
}

const neutral2 = () => {
    if (colorScheme ===  'light') {
        return light2
    } else {
        return dark2
    }
}