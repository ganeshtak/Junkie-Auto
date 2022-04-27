import { Types } from '../Types';
import { languageCode, English } from '../../Constant/Language';


const iState = {
    selected_lang: languageCode.en,
    lang_content: English,
}



export const LangReducer = (state = iState, action) => {
    switch (action.type) {
        case Types.SET_APP_LANG:
            return {
                ...state,
                selected_lang: action.selected_lang,
                lang_content: action.lang_content,
            }
        default:
            return { ...state }
    }
}