import moment from "moment";
import React from "react";
import {
    View, Text, DatePickerAndroid,
    Platform, Modal, DatePickerIOS, Dimensions,
    TouchableOpacity, TimePickerAndroid,
} from 'react-native';
import { colors } from "../Style/baseStyle";
import { shadows } from '../Style/shadow';

const { width } = Dimensions.get('screen');


const getPickerDate = (props, isRef = false) => {

    if (props?.action == "dismissedAction") {
        return false;
    }
    if (props.day && props.month && props.year) {
        const dateObj = new Date(props.year, props.month, props.day);
        const date = moment(dateObj).format('DD-MM-YYYY');
        return isRef ? dateObj : date
    }
    return false
}

export const getCustomDate = ({ month = undefined,
    year = undefined,
    day = undefined,
    dateRef = false,
    isPlatformIos = Platform.OS,
}) => {
    const dateObj = new Date();

    if (month) {
        const dateReference = new Date(dateObj.getFullYear(), dateObj.getMonth() + month, dateObj.getDay());
        const date = moment(dateReference).format('DD-MM-YYYY');
        return dateRef ? dateReference : date
    }
    else if (year) {
        const dateReference = new Date(dateObj.getFullYear() + year, dateObj.getMonth(), dateObj.getDay());
        const date = moment(dateReference).format('DD-MM-YYYY');
        return dateRef ? dateReference : date
    }
    else if (day) {
        const dateReference = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDay() + day);
        const date = moment(dateReference).format('DD-MM-YYYY');
        return dateRef ? dateReference : date
    }
    return undefined
}



export const AppDatePicker = ({
    minDate = getCustomDate({ month: -1, dateRef: true }),
    maxDate = getCustomDate({ month: 1, dateRef: true }),
    mode = "date",
    cancelOnPress,
    doneOnPress,
    visible = false
}) => {
    const [selectedPickerDate, setSelectedDate] = React.useState(new Date());

    React.useEffect(() => {
        if (Platform.OS == "android") {
            openAndroidDatePicker();
        }
    }, [])

    const openAndroidDatePicker = async () => {
        try {
            const date = await DatePickerAndroid.open({
                date: new Date(),
                minDate: minDate ? minDate : new Date(),
                maxDate: maxDate ? maxDate : new Date(),
                mode: 'calendar'
            })
            onDatePress(getPickerDate(date, true));
        } catch (error) {

        }
    }


    const closeOnPress = () => {
        cancelOnPress && cancelOnPress();
    }

    const onDatePress = (_date) => {
        if (_date) {
            const date = moment(_date).format('DD-MM-YYYY')
            doneOnPress && doneOnPress(date)
        }
        closeOnPress && closeOnPress()
    }

    if (Platform.OS == "android") {
        return null
    }

    return (
        <Modal
            visible={true}
            //animationType='slide'
            transparent
        >
            <View style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.1)',
                justifyContent: 'flex-end',
            }}>
                <View style={{
                    //height: 200,
                    backgroundColor: colors.white,
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    zIndex: 1,
                    width: width
                }}>
                    <IosDatePickerHeader
                        cancelOnPress={() => closeOnPress()}
                        doneOnPress={() => { onDatePress(selectedPickerDate) }}
                    />
                    <DatePickerIOS
                        mode={mode}
                        date={selectedPickerDate}
                        onDateChange={(date) => setSelectedDate(date)}
                        minimumDate={minDate ? minDate : new Date()}
                        maximumDate={maxDate ? maxDate : new Date()}
                        style={{ width: width }}
                    />
                </View>
            </View>
        </Modal>
    )
}

export const AppTimePicker = () => {
    React.useEffect(() => {
        openTimePicker()
    }, []);


    const openTimePicker = async () => {

        try {
            const timeObj = await TimePickerAndroid.open({
                hour: 12,
                minute: 0,
                is24Hour: false,
                mode: 'clock',
            })


        } catch (error) {
            console.log(error)
        }
    }

    return null
}


const IosDatePickerHeader = ({
    cancelOnPress,
    doneOnPress
}) => {
    return (
        <View style={{
            flex: 1,
            flexDirection: 'row'
        }}>
            <PickerButton
                onPress={cancelOnPress}
                title="Cancel"
            />
            <PickerButton
                onPress={doneOnPress}
                isLeft={false}
            />
        </View>
    )
}

const PickerButton = ({ title = "Done", onPress, space = 10, isLeft = true }) => {
    return (
        <View style={{
            flex: 1,
            paddingLeft: space,
            flexDirection: isLeft ? 'row' : 'row-reverse',
            ...shadows[0],
            backgroundColor: 'white',
            paddingVertical: 15
        }}>
            <Text
                onPress={onPress}
            >{title}</Text>
        </View>
    )
}