import React from 'react';
import { Types } from '../Types';
import {
    languageCode,
    English,
    Spanish,
    Arabic,
    TextKey as textKey
} from '../../Constant/Language';
import { Store } from '..';
import { AppConstant } from '../../Constant/AppConstant';
import { setAppStatus } from './UserAction';
import { AppStatusType } from '../../Constant/Data';
import { setAppLanguageToAsync, StorageTypes } from '../AsyncStorage/AsyncStorage';


export const TextKey = textKey;

const getAppLangContent = (lang_code) => {
    if (lang_code == languageCode.en) {
        return English
    }
    else if (lang_code == languageCode.sp) {
        return Spanish
    }
    else if (lang_code == languageCode.ar) {
        return Arabic
    }
}

const setUtilityByLanguage = (lan_code) => {
    AppConstant.selected_lang = lan_code;
}

export const getEnglishText = (key) => {
    const text = English[key];
    if (text) {
        return text
    }
    return "Not found"
}

export const getSpanishText = (key) => {
    const text = Spanish[key];
    if (text) {
        return text
    }
    return "Not found"
}

export const getLangText = (key) => {
    const lang = getLangContent(AppConstant.selected_lang);
    const text = lang[key];
    if (text) {
        return text
    }
    return "Not found"
}


const getLangContent = (key) => {
    if (languageCode.en == key) {
        return English
    }
    else if (languageCode.sp == key) {
        return Spanish
    }
}


export const getDataForLang = (data = []) => {
    if (data) {
        if (AppConstant.selected_lang == lang_code.en) {
            return data[lang_code.en];
        }
        else if (AppConstant.selected_lang == lang_code.sp) {
            return data[lang_code.sp];
        }
    }
    return []
}



// use this action to change app language

export const lang_code = languageCode;

export const setAppLang = (lan_code, fromAnyAction = false) => {

    const content = getAppLangContent(lan_code);
    setUtilityByLanguage(lan_code);
    Store.dispatch({
        type: Types.SET_APP_LANG,
        selected_lang: lan_code,
        lang_content: content,
    });

    if (fromAnyAction == false) {
        setAppStatus(AppStatusType.slider);
        setAppLanguageToAsync({ data: lan_code, type: StorageTypes.app_lang })
    }
}
