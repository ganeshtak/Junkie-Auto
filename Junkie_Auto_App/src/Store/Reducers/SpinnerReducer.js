import { Types } from "../Types";

const iState = {
    loader: false,
}

export const SpinnerReducer = (state = iState, action) => {
    switch (action.type) {
        case Types.SET_SPINNER: return {
            ...state,
            loader: action.payload
        }
        default: return state
    }
}