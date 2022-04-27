import React from "react";
import { Linking } from 'react-native';
import { term_and_condition } from "../../ServerCommunication/baseUrl";


export const openTermCondition = async (url = term_and_condition) => {
    const supported = await Linking.canOpenURL(url);
    try {
        await Linking.openURL(url);
    } catch (error) {
        console.log(error);
    }
}

export const openCallActivity = (mobile = undefined) => {
    if (mobile) {
        const URL = `tel:${mobile}`;
        Linking.canOpenURL(URL).then((supported) => {
            if (supported) {
                const res = Linking.openURL(URL);
            }
            else {
                Alert.alert('You have not installed call dialer, First install and try again')
            }
        }).catch((e) => {
            console.log(e);
        })

    }
}

export const openEmailActivity = (email = undefined) => {
    if (email) {
        const URL = `mailto:${email}`;
        Linking.canOpenURL(URL).then((supported) => {
            if (supported) {
                const res = Linking.openURL(URL);
            }
            else {
                Alert.alert('You have not installed Email App, First install and try again')
            }
        }).catch((e) => {
            console.log(e);
        })
    }
}