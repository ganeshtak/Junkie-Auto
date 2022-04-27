import React from "react";
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppConstant, UserConstant } from "../../Constant/AppConstant";

export const StorageTypes = {
    appStorage: "appStorage",
    user: "user",
    app_lang: "app_lang",
}

const initialState = {
    user: undefined,
    app_lang: undefined,
}

export const setAppLanguageToAsync = async ({ data, type }) => {
    await setAppStorage({ data, type });
}

export const setAppStorage = async ({
    iState = initialState,
    data,
    type
}) => {

    const setStorage = ({ obj = {}, type, data }) => {
        obj[type] = data;
        AsyncStorage.setItem(StorageTypes.appStorage, JSON.stringify(obj));
    }

    const res = await getAppStorage();

    if (res && res[type]) {
        setStorage({
            obj: data,
            type,
            data
        })
    }
    else {
        setStorage({
            obj: iState,
            type,
            data
        })
    }
}

export const getAppStorage = async () => {
    const res = await AsyncStorage.getItem(StorageTypes.appStorage);
    if (res) {
        const data = JSON.parse(res);
        return data
    }
    return undefined
}

export const removeAppStorage = async () => {
    await AsyncStorage.removeItem(StorageTypes.appStorage);
    UserConstant.reSetData();
    AppConstant.reSetData();
}


