import React from 'react';
import { Store } from '..';
import { Types } from '../Types';
import { API } from '../../ServerCommunication/baseUrl';
import { GetRequest } from '../../ServerCommunication/Request';
import { AuctionStatusTypes } from '../../Constant/Data';
import { FilterConstant, UserConstant } from '../../Constant/AppConstant';
import { NewAuctionProperty } from '../../Constant/Data';
import { getAllCarCategory, getAllAuctionList, getMyExpiredAuctions } from '../../Screens/Auctions/Utils';
import { setSpinner } from './SpinnerAction';

const setDashboardData = ({ newly_listed = [], latest_offer = [], bannerImage = [], expiredAuctions = [] }) => {
    Store.dispatch({
        type: Types.SET_DASHBOARD_DATA,
        newly_listed: newly_listed,
        latest_offer: [],
        bannerImage: bannerImage,
        expired_auctions: expiredAuctions,
    });
}

const getActiveAuctions = (list = []) => {
    if (list) {
        const res = list.filter((item) => {
            return item?.status == AuctionStatusTypes.active && String(item?.user_id) !== String(UserConstant.user_id)
            //return true
        });
        return res;
    }
    return []
}

export const getDashboardData = async (_spinner = false) => {
    await setFilterData();
    setSpinner(true)
    const res = await Promise.all([
        GetRequest({
            url: API.dashboard,
            spinner: false,
        }),
        getAllAuctionList(),
        getMyExpiredAuctions(false),
    ]);
    setSpinner(false);

    if (res.length > 0) {
        // for dashboard
        const dashboardRes = res[0];
        const obj = {};
        if (dashboardRes && dashboardRes.status) {
            const item = dashboardRes?.data;
            obj['bannerImage'] = item?.banner_list ? item?.banner_list : [];
            obj['latest_offer'] = "latest_offer" in item ? getActiveAuctions(item?.latest_offer) : [];
            obj['newly_listed'] = item?.newly_listed ? getActiveAuctions(item?.newly_listed) : [];
        }

        //for auctions
        const auctionRes = res[1];

        if (auctionRes) {
            obj['auctions'] = getActiveAuctions(auctionRes.all_auction_list);
        }

        // for expired auctions
        const expiredRes = res[2];
        if (expiredRes) {
            obj['expiredAuctions'] = expiredRes;
        }

        setDashboardData(obj);

        return obj
    }
    return false
}



//============================== get filter data =======================

export const setFilterData = async (list = []) => {
    const res = await GetRequest({
        url: `${API.auction_filter_list}`,
        spinner: false,
    })
    if (res && res.status) {
        const data = getAuctionUsedTypeOptionsData(res?.data);
        FilterConstant.used_type = data;
    }
    else {
        FilterConstant.used_type = undefined;
    }

}

const getAuctionUsedTypeOptionsData = (data = []) => {
    let selectedData = undefined;
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (NewAuctionProperty.used_type.type == item?.type) {
            selectedData = item?.filter_name;
            break;
        }
    }

    if (selectedData) {
        if (Array.isArray(selectedData)) {
            const res = selectedData.map((item) => {
                return {
                    id: item?.id,
                    name: item?.name
                }
            });
            return res;
        }
    }
    return undefined
}