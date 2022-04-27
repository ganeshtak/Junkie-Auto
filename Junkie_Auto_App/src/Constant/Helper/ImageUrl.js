import React from "react";
import { image_base_url } from '../../ServerCommunication/baseUrl';


export const getImageUrl = (url = undefined) => {
    if (["", undefined, null].includes(url)) {
        return "file:///"
    }
    else {
        return image_base_url + url;
    }
}