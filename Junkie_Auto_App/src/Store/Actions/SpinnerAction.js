import React from "react";
import { Types } from "../Types";
import { Store } from '../index';

export const setSpinner = (status = false) => {
    Store.dispatch({
        type: Types.SET_SPINNER,
        payload: status
    });
}
