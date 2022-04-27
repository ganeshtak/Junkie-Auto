import React from "react";
import { Share, ShareAction } from 'react-native';



export const openShareActivity = async (message) => {
    if (message) {
        try {
            const msg = message;
            const res = await Share.share({
                message: msg
            });

            console.log(res);
        } catch (error) {
            console.log(error)
        }
    }
}