import React from "react";
import { GetRequest, PostRequest } from '../../ServerCommunication/Request';
import { API } from '../../ServerCommunication/baseUrl';
import { AuctionStatusTypes, NewAuctionFieldType, NewAuctionProperty } from '../../Constant/Data';
import { getAddressByLatLng, getCurrentLatLng } from '../../ServerCommunication/Location';
import { AppConstant } from '../../Constant/AppConstant';
import { ScreenTypes } from '../../Constant/Data';
import { colors, spacer } from "../../Style/baseStyle";
import { getDateFormat, getDateFormateFromTimestamp } from "../../Constant/Helper/TimeAndDate";
import { getLangText } from "../../Store/Actions/LangAction";
import { TextKey } from "../../Constant/Language";


const AuctionSearchRange = 2;

export const getSearchQuery = ({
    lat,
    lng,
    km_range = AuctionSearchRange,
    make,
    model,
    year,
    mileage,
    damage_type,
    secondary_damage_type,
    drive_line_type,
    body_type,
    fuel_type,
    transmission,
    color,
    catalytic_convertor,
    bid_end,
    used_type,
    search_end
}) => {
    let qStr = String("?");
    if (km_range) {
        qStr = qStr.concat(`km_range=${km_range}&`)
    }
    if (lat && lng) {
        qStr = qStr.concat(`lat=${lat}&lng=${lng}&`)
    }
    if (make) {
        qStr = qStr.concat(`make=${make}&`)
    }
    if (model) {
        qStr = qStr.concat(`model=${model}&`)
    }
    if (year) {
        qStr = qStr.concat(`year=${year}&`)
    }
    if (mileage) {
        qStr = qStr.concat(`mileage=${mileage}&`)
    }
    if (damage_type) {
        qStr = qStr.concat(`damage_type=${damage_type}&`)
    }
    if (secondary_damage_type) {
        qStr = qStr.concat(`secondary_damage_type=${secondary_damage_type}&`)
    }
    if (drive_line_type) {
        qStr = qStr.concat(`drive_line_type=${drive_line_type}&`)
    }
    if (body_type) {
        qStr = qStr.concat(`body_type=${body_type}&`)
    }
    if (fuel_type) {
        qStr = qStr.concat(`fuel_type=${fuel_type}&`)
    }
    if (transmission) {
        qStr = qStr.concat(`transmission=${transmission}&`)
    }
    if (color) {
        qStr = qStr.concat(`color=${color}&`)
    }
    if (catalytic_convertor) {
        qStr = qStr.concat(`catalytic_convertor=${catalytic_convertor}&`)
    }
    if (bid_end) {
        qStr = qStr.concat(`bid_end=${bid_end}&`)
    }
    if (search_end) {
        qStr = qStr.concat(`search_end=${search_end}&`)
    }
    if (used_type) {
        qStr = qStr.concat(`used_type=${used_type}&`)
    }
    return qStr;
}

export const auctionFilterByLocation = async (lat, lng) => {
    const URL = `${API.auction_search_filter}${getSearchQuery({ lat, lng })}`;

    const res = await GetRequest({
        url: URL,
        spinner: true
    });

    if (res && res.status) {
        return res
    }
    return false
}

export const auctionFilterByQuery = async (query) => {
    const URL = `${API.auction_search_filter}${query}`;

    const res = await GetRequest({
        url: URL,
        spinner: true
    });

    if (res && res.status) {
        return res
    }
    return false
}

export const getAuctionStatusText = (status, isMeSeller = false) => {
    if (String(status) == String(AuctionStatusTypes.pending)) {
        return getLangText(TextKey.Pending);

    } else if (String(status) == String(AuctionStatusTypes.active)) {
        return getLangText(TextKey.Verified);

    } else if (String(status) == String(AuctionStatusTypes.cancel)) {
        return getLangText(TextKey.Canceled_by_admin);

    } else if (String(status) == String(AuctionStatusTypes.sold)) {
        return getLangText(TextKey.Sold);

    } else if (String(status) == String(AuctionStatusTypes.closed)) {
        return getLangText(TextKey.Closed);

    } else if (String(status) == String(AuctionStatusTypes.expired_close)) {
        return isMeSeller ? getLangText(TextKey.Canceled_by_you) : getLangText(TextKey.Closed);
    }
}

export const getAuctionStatusColor = (status) => {

    if (String(status) == String(AuctionStatusTypes.pending)) {
        return "gray";
    }
    else if (String(status) == String(AuctionStatusTypes.active)) {
        return "green";
    }
    else if (String(status) == String(AuctionStatusTypes.cancel)) {
        return colors.red;
    }
    else if (String(status) == String(AuctionStatusTypes.sold)) {
        return "green";
    }
    else if (String(status) == String(AuctionStatusTypes.closed)) {
        return colors.red;
    }
    else if (String(status) == String(AuctionStatusTypes.expired_close)) {
        return colors.red;
    }
}




export const getAuctionFilterList = async (spinner = true) => {
    const res = await GetRequest({ url: API.auction_filter_list, spinner });
    let result = [];
    if (res && res.status && res?.data) {
        if (Array.isArray(res?.data)) {
            const data = res?.data;
            data.map((item) => {
                const label_name = item?.filter_lable && "label_name" in item?.filter_lable ? item?.filter_lable?.label_name : undefined;

                const obj = {};
                obj['name'] = label_name ? label_name : item?.type;
                obj['type'] = item?.type;
                obj['options'] = item?.filter_name;
                obj['value'] = undefined;
                obj['child_id'] = undefined;
                result.push(obj);
            });
        }
    }
    return result

    return undefined
}

// this is for Edit Post


export const getAuctionEditData = async (selectedAuction = undefined) => {
    //Note : all obj field name are state name of AddNewAuction screen states


    const filterList = await getAuctionFilterList();
    const obj = {};
    const item = selectedAuction;
    //this is for make
    if (item?.make_name && item?.make_name.length > 0) {
        const _item = item?.make_name[0];
        obj['make'] = _item?.name;
        obj['make_id'] = _item?.caregory_id;
    }

    //this is for model
    if (item?.model_name && item?.model_name.length > 0) {
        const _item = item?.model_name[0];
        obj['model'] = _item?.name;
        obj['model_id'] = _item?.caregory_id;
    }


    // this is for auction images
    if (item?.auction_image && item?.auction_image.length > 0) {
        obj['auction_images'] = item?.auction_image
    }

    obj['id'] = String(item?.id);
    obj['milage'] = item?.mileage;
    obj['location'] = item?.address;
    obj['startPrice'] = String(item?.bid_price);
    obj['endPrice'] = String(item?.bid_closed_price);
    obj['salePrice'] = String(item?.sale_price);

    obj['lat'] = item?.lat;
    obj['lng'] = item?.lng;
    obj['country'] = item?.country;
    obj['state'] = item?.state;
    obj['city'] = item?.city;
    obj['add_info'] = item?.details;
    obj['vin'] = item?.vin;
    obj['year'] = item?.year;
    obj['startDate'] = getDateFormateFromTimestamp(item?.bid_start, true);
    obj['endDate'] = getDateFormateFromTimestamp(item?.bid_end, true);
    // obj['titleStatus'] = item?.title_status;
    // obj['cleanTitle'] = item?.clean_title;

    const auctionProperty = Object.values(NewAuctionProperty);
    const res = filterList.map((Item) => {
        const index = auctionProperty.findIndex((I) => I.type == Item?.type);
        if (index > -1) {
            const currentDataProperty = auctionProperty[index];
            let key = String(currentDataProperty?.editType)
            const itemData = selectedAuction[key];


            if (itemData && itemData.length > 0) {
                return {
                    ...Item,
                    child_id: itemData[0]?.id,
                    value: itemData[0]?.name,
                }
            }
        }
        return Item

    })

    if (res.length > 0) {
        obj['data'] = res;
    }

    return obj

}

export const removeAuctionImage = async (spinner = true, id) => {
    const URL = `${API.remove_auction_image}${id}`;
    const res = await PostRequest({
        url: URL,
        spinner,
    });
    return res;
}


export const updateAuction = async (spinner = true, id, data) => {
    const URL = `${API.update_auction}${id}`;

    const res = await PostRequest({
        spinner,
        url: URL,
        body: data,
        fileUpload: true
    });
    console.log(res, data);
    if (res && res.status) {
        return true
    }
    return false
}




export const getCurrentAddressFromLatLng = (callback) => {
    getCurrentLatLng((coord) => {
        if (coord) {
            getAddressByLatLng({
                lat: coord?.lat,
                lng: coord?.lng
            }).then((res) => {

                callback && callback(
                    res?.formatted_address,
                    coord,
                    res?.address?.city,
                    res?.address?.state,
                    res?.address?.countery,
                );
            })
        }
        callback && callback(undefined)
    })
}

export const getAuction = async () => {
    const res = await GetRequest({
        url: API.my_auction_list,
    });
    return res;
}

export const addNewAuction = async ({ data }) => {
    const res = await PostRequest({
        url: API.add_new_auction,
        spinner: true,
        fileUpload: true,
        body: data
    });
    console.log(res);
    return res
}

export const getAllCarCategory = async (spinner = true) => {
    const res = await GetRequest({
        spinner: spinner,
        url: API.get_category,
    });
    console.log(res);
    if (res && res.status) {
        const arr = Array.isArray(res?.data?.category) ? res?.data?.category : [];
        const result = arr.map((item) => {
            const obj = {}
            obj['parent_id'] = item?.id;
            if ("cateogry_name" in item) {
                obj['id'] = item?.cateogry_name?.caregory_id;
                obj['name'] = item?.cateogry_name?.name
            }
            return obj
        });
        return result;
    }
    return false
}

export const getSubCategory = async (id) => {
    const res = await GetRequest({
        spinner: true,
        url: `${API.get_model_by_category}${id}`,
    });

    if (res && res.status) {
        const arr = Array.isArray(res?.data?.category) ? res?.data?.category : [];
        const result = arr.map((item) => {
            const obj = {}
            obj['parent_id'] = item?.id;
            if ("cateogry_name" in item) {
                obj['id'] = item?.cateogry_name?.caregory_id;
                obj['name'] = item?.cateogry_name?.name;
            }
            return obj
        });
        return result;
    }
    return false
}

export const getAuctionDetail = async (id, screenType = undefined) => {
    const res = await GetRequest({
        spinner: true,
        url: `${API.auction_detail}${id}`,
    });
    if (res && res.status) {
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

export const getMyAuctionDetail = async (id, screenType = undefined) => {
    const res = await GetRequest({
        spinner: true,
        url: `${API.my_auction_details}${id}`,
    });
    if (res && res.status) {
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

export const getAllAuctionList = async (page = 1, spinner = true) => {
    const res = await GetRequest({
        url: `${API.all_auction_list}${page}`,
        spinner: spinner,
    });

    if (res && res.status) {
        const obj = {
            last_page: res?.data?.meta?.last_page,
            all_auction_list: res?.data?.data,
        }
        return obj;
    }
    return false
}






//======================================== Saved search====================================


export const saveSearch = async (qry) => {
    if (qry) {
        const URL = `${API.save_search}${qry}`;
        const res = await GetRequest({
            url: URL,
            spinner: true,
        });
        return res;
    }
    return false
}


export const getSavedSearch = async () => {
    const res = await GetRequest({
        url: API.get_search,
        spinner: true,
    });
    return res;
}

export const deleteSearch = async (_id) => {
    const data = {
        id: _id
    }
    const res = await PostRequest({
        url: API.delete_search,
        spinner: false,
        body: data
    });
    return res;
}


export const closeAuctionByApi = async (id, spinner = true) => {
    const data = {
        status: String(AuctionStatusTypes.closed),
    }
    const res = await PostRequest({
        url: `${API.close_auction}${id}`,
        spinner: spinner,
        body: data,
    });

    if (res && res.status) {
        return res;
    }
    return false
}

export const cancelExpiredAuctionByApi = async (id, spinner = true) => {
    const data = {
        status: String(AuctionStatusTypes.expired_close),
    }
    const res = await PostRequest({
        url: `${API.close_auction}${id}`,
        spinner: spinner,
        body: data,
    });

    if (res && res.status) {
        return res;
    }
    return false
}


export const updateSearch = async (id, qry) => {
    if (qry) {
        const URL = `${API.update_save_search}${qry}update_id=${id}`;

        const res = await GetRequest({
            url: URL,
            spinner: true,
        });
        return res;
    }
    return false
}

export const getMyExpiredAuctions = async (spinner = true) => {
    const res = await GetRequest({
        url: API.my_expired_auction,
        spinner: spinner,
    });

    if (res && res.status) {
        return res?.data;
    }
    return false
}