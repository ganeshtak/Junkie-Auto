import React from "react";
import { GetRequest, PostRequest } from '../../ServerCommunication/Request';
import { API } from '../../ServerCommunication/baseUrl';
import { AppConstant } from "../../Constant/AppConstant";



export const makeBidWinner = async (auction_id, bid_id) => {
    if (auction_id && bid_id) {
        const data = {
            "auction_id": auction_id,
            "bid_id": bid_id
        }

        const res = await PostRequest({
            url: API.make_bid_winner,
            spinner: true,
            body: data,
        });

        if (res && res.status) {
            return true
        }
        return false
    };
    return false
}


export const getMyBid = async (spinner = true) => {
    const res = await GetRequest({
        url: API.my_bid_list,
        spinner: spinner,
    });

    if (res && res.status) {
        return res?.data
    }
    return false
}


export const makeABid = async (spinner = true, data) => {
    const res = await PostRequest({
        url: API.make_a_bid,
        body: data,
        spinner: spinner
    });
    return res;
}

export const getBidDetail = async (id, screenType = undefined, spinner = true) => {
    const res = await GetRequest({
        url: `${API.bid_detail}${id}`,
        spinner: spinner,
    });
    if (res && res?.status) {
        if (screenType) {
            AppConstant.navigation && AppConstant.navigation.navigate('AuctionDetail', {
                data: res?.data,
                from: screenType
            });
        }
        return res;
    }
    return false
}

export const getWinnerBidDataPrice = (list = []) => {
    if (list && Array.isArray(list)) {
        let winnerBid = undefined;
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            if (String(item?.bid_winner) == "1") {
                winnerBid = item;
                break;
            }
        }

        if (winnerBid) {
            return winnerBid?.bid_amount;
        }
    }
    return false
}

export const rejectBidByApi = async (id, spinner = true) => {
    const data = {
        bid_id: id,
    }
    const res = await PostRequest({
        url: API.reject_bid,
        body: data,
        spinner: spinner,
    });
    return res;
}