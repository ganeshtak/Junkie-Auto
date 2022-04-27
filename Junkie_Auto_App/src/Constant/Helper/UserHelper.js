import React from "react";
import {
    AppConstant,
    UserConstant,
} from '../AppConstant';
import { AlertMessage } from './AlertMessage';
import { MSG } from '../Message';
import { UserStatus } from '../Data';
import { getUserInfo } from '../../Store/Actions/UserAction';
import { getLangText } from "../../Store/Actions/LangAction";
import { TextKey } from "../Language";



const showMessage = (msg, title = getLangText(TextKey.required), callback) => {
    AlertMessage({
        title: title,
        message: msg,
        text1: "",
        text2: getLangText(TextKey.ok)
    }, () => {
        callback && callback()
    });
}

const getLatestUserData = (callback) => {
    getUserInfo(true, (res) => {
        console.log(UserConstant.user_status)
        if (res) {
            if (String(UserConstant.user_status) == String(UserStatus.reject)) {
                showMessage(getLangText(TextKey.you_reject));
                return false
            }
            if (String(UserConstant.user_status) == String(UserStatus.pending)) {
                showMessage(getLangText(TextKey.you_not_verify));
                return false
            }
            if (String(UserConstant.user_status) == String(UserStatus.active)) {
                callback && callback(true);
            }
        }
    })
}

export const isUserLogged = (callback) => {
    if (UserConstant.user_id !== undefined) {
        if (String(UserConstant.user_status) == String(UserStatus.active)) {
            callback && callback(true);
            return
        }
        else if (String(UserConstant.user_status) == String(UserStatus.pending)) {
            getLatestUserData((res) => {
                if (res) {
                    callback && callback(false);
                    return
                }
            });
        }
        else if (String(UserConstant.user_status) == String(UserStatus.reject)) {
            getLatestUserData((res) => {
                if (res) {
                    callback && callback(false);
                    return
                }
            });
        }

        callback && callback(false)
    }
    else {
        showMessage(getLangText(TextKey.you_need_to_login), getLangText(TextKey.required), () => {

        });
        callback && callback(false)
    }
}