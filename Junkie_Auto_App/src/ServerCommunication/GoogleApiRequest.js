import React from 'react';
import { api_key } from './baseUrl';
import { GetRequest } from './Request';


const KEY = api_key;

const autoCompleteSearch = async (txt) => {
    const URL = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${txt}&types=geocode&key=${KEY}&regions=locality`
    const res = await GetRequest({
        url: URL,
        spinner: false
    });
    //this.setState({ place_list: res ? res.predictions : [], isCurrentLocation: false })
    return res ? res.predictions : [];

}

const geoCodeSelectedPlace = async (id) => {
    const URL = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${id}&key=${KEY}`;
    const res = await GetRequest({
        url: URL,
        spinner: false
    });
    //this.setState({ selected_place: res ? res.result : null })
    return res ? res.result : null
}

export async function getAddressList(txt) {
    const res = await autoCompleteSearch(txt);
    return res;
}

export async function getAddressById(place_id) {
    const address = await geoCodeSelectedPlace(place_id);
    return address
}