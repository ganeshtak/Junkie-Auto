import { Types } from '../Types';



const iState = {
    bannerImage: [],

    latest_offer: [],

    newly_listed: [],

    filter_list: [], // all auction filter options

    expired_auctions: [],
}



export const DashboardReducer = (state = iState, action) => {
    switch (action.type) {
        case Types.SET_FILTER_OPTIONS:
            return {
                ...state,
                filter_list: action.payload
            }
        case Types.SET_DASHBOARD_DATA:
            return {
                ...state,
                bannerImage: action.bannerImage,
                latest_offer: action.latest_offer,
                newly_listed: action.newly_listed,
                expired_auctions: action.expired_auctions
            }
        default:
            return { ...state }
    }
}