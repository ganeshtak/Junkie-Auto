import React from 'react';
import { Store } from '..';
import { Types } from '../Types';
import {
    setAppStorage,
    getAppStorage,
    removeAppStorage,
    StorageTypes
} from '../AsyncStorage/AsyncStorage';
import {
    GetRequest, PostRequest
} from '../../ServerCommunication/Request';
import { API } from '../../ServerCommunication/baseUrl';
import { AppConstant, UserConstant } from '../../Constant/AppConstant';
import { setSpinner } from './SpinnerAction';
import {
    languageCode,
    English,
    Spanish,
    TextKey
} from '../../Constant/Language';
import { getDashboardData } from '../Actions/DashboardAction';
import { AppStatusType } from '../../Constant/Data';
import { getLangText, setAppLang } from './LangAction';
import { clearAppCatchImages } from '../../Utility/Modal/ImagePickerModel';
import { ShowSnakeBar } from '../../Utility/ShowMessage';
import { getImageUrl } from '../../Constant/Helper/ImageUrl';

export const setAppStatus = (status) => {
    Store.dispatch({
        type: Types.SETAPPSTATUS,
        payload: status
    });
}

export const logoutFromApp = async () => {
    removeAppStorage();
    clearAppCatchImages();
    Store.dispatch({
        type: Types.SETAPPSTATUS,
        payload: AppStatusType.auth
    });
    Store.dispatch({
        type: Types.LOGOUT,
    });
    if (UserConstant.user_id) {
        logoutApi();
    }
}

export const logoutApi = async () => {
    const res = await GetRequest({
        url: API.logout,
        spinner: false
    });
    console.log(res);
}

export const loginByApi = async ({ spinner = true, data }, callback) => {
    const res = await PostRequest({
        url: API.login,
        spinner,
        body: data
    });

    if (res && res.status) {
        getAsync(res?.data?.user, true);
    }
    callback && callback(res);
}

export const registerByApi = async ({ spinner = true, data }, callback) => {
    const res = await PostRequest({
        url: API.register,
        spinner,
        body: data,
        fileUpload: true
    })
    callback && callback(res);
}


export const getUserInfo = async (spinner = true, callback) => {
    const res = await GetRequest({
        url: API.get_user_info,
        spinner: spinner,
    });

    if (res && res.status) {
        if (Array.isArray(res?.data)) {
            dataSetter({ data: res?.data[0] });
            callback && callback(true, res);
            return
        }
    }
    callback && callback(false)
}


export const updateUserProfile = async (_spinner = true, data) => {
    const res = await PostRequest({
        url: API.update_profile,
        spinner: _spinner,
        body: data,
        fileUpload: true,
    });
    if (res && res.status) {
        getUserInfo();
        ShowSnakeBar(getLangText(TextKey.profile_updated_successfully));
    }
    return res
}

export const getAsync = async (data = undefined, isFromLogin = false, callback) => {
    if (isFromLogin && data) {
        dataSetter({ data })
        setAppStorage({ data: data, type: "user" });
        //go to dashboard
        setAppStatus(AppStatusType.dashboard);
    }
    else {
        const res = await getAppStorage();
        console.log("====async=====", res);
        if (res && res?.app_lang) {
            setAppLang(res?.app_lang, true);
        }

        if (res && res?.user) {
            if ("token" in res?.user) {
                AppConstant.setBearerToken(res?.user?.token);
            }
            callback && callback(true);
            //dataSetter({ data: res?.user });
            await getUserInfo(false);
            //go to dashboard
            callback && callback(false);
            setAppStatus(AppStatusType.dashboard);
        }
        else {
            //go to slider
            setAppStatus(AppStatusType.language);
        }
    }
}

const dataSetter = ({ data }) => {
    if (data) {
        //User detail
        UserConstant.user_id = data?.id;
        UserConstant.f_name = data?.first_name;
        UserConstant.l_name = data?.last_name;
        UserConstant.email = data?.email;
        UserConstant.address = data?.address;
        UserConstant.city = data?.city;
        UserConstant.state = data?.state;
        UserConstant.country = data?.country;
        UserConstant.user_status = data?.status;
        UserConstant.mobile = data?.mobile_number;
        UserConstant.user_image = getImageUrl(data?.profile_url);
        Store.dispatch({
            type: Types.SET_USER_IMAGE,
            payload: getImageUrl(data?.profile_url)
        })
        //token details
        if ("token" in data) {
            AppConstant.setBearerToken(data?.token);
        }
    }
}


export const VerifyEmail = async ({ spinner = true, data }, callback) => {

    const res = await PostRequest({
        url: API.forgot_password,
        spinner,
        body: data

    });

    callback && callback(res);
};

export const ChangePasswords = async ({ spinner = true, data }, callback) => {
    const res = await PostRequest({
        url: API.reset_password,
        spinner,
        body: data,
    });

    callback && callback(res);
};

export const OtpVerifications = async ({ spinner = true, data }, callback) => {


    const res = await PostRequest({
        url: API.otpVerify,
        spinner,
        body: data,
    });
    callback && callback(res);
};