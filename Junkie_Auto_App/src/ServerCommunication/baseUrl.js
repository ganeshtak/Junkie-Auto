import React from "react";

const baseUrl = 'https://junkieauto.dnow.uk';
const apiUrl = `${baseUrl}/api/`;

export const api_key = "AIzaSyCoEUwl2kiIGmME4r6bKJb2H5QGX2w83iI"//AIzaSyAknLO_uvEmxeW4kSS2U5Jgs9pmq2CRx0E";
export const image_base_url = baseUrl;
export const term_and_condition = "http://google.com";


export const get_country = "https://countriesnow.space/api/v0.1/countries/positions";
export const get_state_by_country = "https://countriesnow.space/api/v0.1/countries/states";
export const get_city_by_state = "https://countriesnow.space/api/v0.1/countries/state/cities";


export const API = {
    login: `${apiUrl}login`,
    register: `${apiUrl}register`,
    logout: `${apiUrl}logout`,

    otpVerify: `${apiUrl}verify-otp`,
    forgot_password: `${apiUrl}forgot-password`,
    change_password: `${apiUrl}change-password`,
    reset_password: `${apiUrl}reset-password`,

    auction_filter_list: `${apiUrl}auction-list`,
    add_new_auction: `${apiUrl}new-auction`,
    my_auction_list: `${apiUrl}my-auction-list`,
    get_category: `${apiUrl}get-category`,
    get_model_by_category: `${apiUrl}get-sub-category/`, // category id
    auction_detail: `${apiUrl}auction-details/`, // auction id
    my_auction_details: `${apiUrl}my-auction-details/`, // auction id
    dashboard: `${apiUrl}dashboard`,
    all_auction_list: `${apiUrl}all-auction-list?page=`,// page number
    make_a_bid: `${apiUrl}bid`,
    bid_detail: `${apiUrl}bid-detail/`, //bid Id
    my_bid_list: `${apiUrl}my-bid-list`,
    my_auction_bid_list: `${apiUrl}my-auction-bid-list`,
    make_bid_winner: `${apiUrl}make-auction-winner`,
    get_user_info: `${apiUrl}users-data`,
    auction_search_filter: `${apiUrl}auction-search-filter`,
    get_wishlist: `${apiUrl}my-wish-list`,
    delete_wishlist: `${apiUrl}my-wish-delete`,
    add_wishlist: `${apiUrl}add-wish-list`,

    save_search: `${apiUrl}save-search`,
    get_search: `${apiUrl}get-search`,
    delete_search: `${apiUrl}delete-search`,

    update_profile: `${apiUrl}update-profile`,
    update_save_search: `${apiUrl}update-save-search`,

    close_auction: `${apiUrl}close-auction/`, //auction id
    reject_bid: `${apiUrl}reject-bid`,
    my_expired_auction: `${apiUrl}my-expried-auction`,

    update_auction: `${apiUrl}update-auction/`, // auction id
    remove_auction_image: `${apiUrl}remove-auction-media/`, // image id

}