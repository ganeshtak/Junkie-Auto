import React from "react";
import { GetRequest, PostRequest } from './Request';
import {
    get_country,
    get_city_by_state,
    get_state_by_country
} from './baseUrl';


export const getAllCountry = async () => {
    const res = await GetRequest({
        url: get_country,
        spinner: true
    });

    if (res?.data && res?.data.length > 0) {
        const country = res.data.map((item) => item?.name);
        return country.length > 0 ? country : false
    }
    return false;
}


export const getStateByCountry = async (country = undefined) => {
    if (country) {
        const data = {
            country: country
        }
        const res = await PostRequest({
            url: get_state_by_country,
            spinner: true,
            body: data
        })

        if (res?.data && res?.data?.states) {
            const state = res?.data?.states.map((item) => item?.name);
            return state.length > 0 ? state : false;
        }
    }
    return false
}

export const getCityByState = async (country = undefined, state = undefined) => {
    if (country && state) {
        const data = {
            country: country,
            state: state
        }
        const res = await PostRequest({
            url: get_city_by_state,
            spinner: true,
            body: data
        })

        if (res?.data && res?.data.length > 0) {
            return res?.data;
        }
    }
    return false
}