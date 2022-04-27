import React from "react";
import { GetRequest, PostRequest } from '../../ServerCommunication/Request';
import { API } from '../../ServerCommunication/baseUrl';
import { AppConstant, WishlistConstant } from "../../Constant/AppConstant";
import { ShowSnakeBar } from '../../Utility/ShowMessage';
import { setSpinner } from "../../Store/Actions/SpinnerAction";
import { getLangText, TextKey } from '../../Store/Actions/LangAction';


export const addToWishList = async (id) => {
    if (id) {
        const data = {
            auction_id: id
        }
        setSpinner(true);
        const res = await Promise.all([
            await PostRequest({
                url: API.add_wishlist,
                spinner: false,
                body: data,
            }),
            getWishList(),
        ]);
        setSpinner(false);
        if (res.length > 0) {
            const addRes = res[0];
            if (addRes && addRes.status); {
                ShowSnakeBar(getLangText(TextKey.auction_added_to_wishlist))
            }
            return addRes
        }
    }
    return false
}

export const removeFromWishList = async (id) => {
    if (id) {
        const data = {
            auction_id: id
        }
        setSpinner(true);
        const res = await Promise.all([
            PostRequest({
                url: API.delete_wishlist,
                spinner: false,
                body: data,
            }),
            getWishList(),
        ]);
        setSpinner(false);
        if (res.length > 0) {
            const deleteRes = res[0];
            if (deleteRes && deleteRes.status) {
                ShowSnakeBar(getLangText(TextKey.auction_removed_from_wishlist))
            }
            return deleteRes;
        }
    }
    return false
}


export const getWishList = async (onlyId = true) => {
    const res = await GetRequest({
        url: API.get_wishlist,
        spinner: true
    });

    if (res && res.status) {
        if (Array.isArray(res?.data)) {
            const data = res.data.map((item) => item?.id);
            WishlistConstant.wishListId = data;
            if (onlyId) {
                return data;
            }
            return res?.data
        }
    }
    return false
}