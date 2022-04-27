import { Types } from '../Types';
import { languageCode, English } from '../../Constant/Language';

const iState = {
    // splash = 0,
    // Auth = 1,
    // dashboard = 2,
    app_status: 0,
    userImage: undefined,
}


export const UserReducer = (state = iState, action) => {
    switch (action.type) {
        case Types.SETAPPSTATUS:
            return {
                ...state,
                app_status: action.payload
            }
        case Types.SET_USER_IMAGE:
            return {
                ...state,
                userImage: action.payload
            }
        case Types.LOGOUT:
            return {
                ...state,
                userImage: undefined,
            }
        default:
            return { ...state }
    }
}