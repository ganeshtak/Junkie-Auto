
import React from "react";
import { Alert } from "react-native";
import { AppConstant } from '../Constant/AppConstant';
import { setSpinner } from '../Store/Actions/SpinnerAction';



const requestAbortTime = 15000;

const headerWithoutBearer = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
}

const headerWithBearer = () => {
    return {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AppConstant.bearer_token}`,
        'Accept-Language': `${AppConstant.selected_lang}`,
    }
}

const headerWithFile = () => {
    return {
        'Accept': 'application/json',
        //'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${AppConstant.bearer_token}`,
    };
};

export const GetRequest = async ({ url, header = headerWithBearer(), requestTime = requestAbortTime, spinner = true }) => {
    if (AppConstant.isNetworkConnected) {
        try {
            spinner && setSpinner(true);
            const controller = new AbortController();
            setTimeout(() => { controller.abort() }, requestTime);
            const config = {
                method: 'GET',
                headers: header,
                signal: controller.signal,
            };
            const res = await fetch(url, config);
            const result = await res.json();
            spinner && setSpinner(false);
            return result;
        } catch (error) {
            setSpinner(false);
            console.log(error)
            if (error.message == "Aborted") {
                maxRequestMessage();
            }
            return false
        }
    }
    else {
        showNetworkMessage();
        return false;
    }
}


export const PostRequest = async ({ url, body, header = headerWithBearer(), fileUpload = false, requestTime = requestAbortTime, spinner = true }) => {
    if (AppConstant.isNetworkConnected) {
        try {
            spinner && setSpinner(true);
            const controller = new AbortController();
            setTimeout(() => { controller.abort() }, requestTime);
            const config = {
                method: 'post',
                headers: fileUpload ? { ...headerWithFile() } : header,
                signal: controller.signal,
                body: fileUpload ? body : JSON.stringify(body)
            };
            const res = await fetch(url, config);
            const result = await res.json();
            spinner && setSpinner(false);
            return result;
        } catch (error) {
            setSpinner(false);
            console.log(error)
            if (error.message == "Aborted") {
                maxRequestMessage();
            }
            return false
        }
    }
    else {
        showNetworkMessage();
        return false;
    }
}

const showNetworkMessage = () => {
    Alert.alert("Not connected", "You are not connected to internet connection");
}

const maxRequestMessage = () => {
    Alert.alert("Error", "Service Time Out");
    return false;
}