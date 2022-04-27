import React from "react";


let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export const checkEmail = (email, callback) => {
    if (reg.test(email) === false) {
        callback && callback("Invalid email")
        return false;
    }
    return true;
}