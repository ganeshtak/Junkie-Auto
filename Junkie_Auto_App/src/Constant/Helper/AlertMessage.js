import React from "react";
import { Alert } from 'react-native';

export const AlertMessage = ({
    title = "",
    message = "",
    text1 = "No",
    text2 = "Yes",
}, callback) => {

    Alert.alert(
        title,
        message,
        [
            {
                text: text1,
                onPress: () => { },
            },
            {
                text: text2,
                onPress: () => { callback && callback() },
            }
        ]

    )
}