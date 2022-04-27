import { Platform, Alert, Linking } from 'react-native';
import GeolocationIos from '@react-native-community/geolocation';
import GeolocationAndroid from 'react-native-geolocation-service'
import { api_key } from './baseUrl';
import { GetRequest } from './Request';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import { check, PERMISSIONS, RESULTS, request, openSettings } from 'react-native-permissions';

const Geolocation = Platform.select({
    ios: GeolocationIos,
    android: GeolocationAndroid
});

const GoogleKey = api_key;

export const already_enabled = "already-enabled";
export const enabled = "enabled";
const denied = "denied";
const granted = "granted";


function enableLocation(callback,) {
    if (Platform.OS == 'android') {
        try {
            request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(async (res) => {
                if (res == granted) {
                    try {
                        RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({ interval: 1000, fastInterval: 1000 })
                            .then(data => {
                                callback(data);
                            }).catch(err => {

                                callback('');
                            });

                    } catch (err) {

                        callback(err);
                    }
                }
                // else if (res == denied) {
                //     Alert.alert(
                //         "",
                //         'if you denied permission you can not use location service',
                //         [
                //             {
                //                 text: 'deny',
                //                 onPress: () => {

                //                 },
                //                 style: "cancel"
                //             },
                //             {
                //                 text: 'ask again', onPress: () => {
                //                     enableLocation(() => { })
                //                 }
                //             }
                //         ],
                //         { cancelable: false }
                //     );
                // }
            });
        }
        catch (e) { callback(e) }
    }
}


export const getAddressByLatLng = async ({
    lat = undefined,
    lng = undefined,
    spinner = true,
}) => {

    if (!lat && !lng) {
        return false
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&sensor=true&key=${GoogleKey}`;
    const response = await GetRequest({ url: url, spinner: spinner });
    if (response && response.results && response.results.length > 0) {

        const obj = {};
        let address = {
            pin_code: '',
            countery: '',
            state: '',
            city: '',
        }
        obj["formatted_address"] = response.results[0].formatted_address;

        response.results[0].address_components.map(item => {
            const TYPE = item.types[0];
            if (TYPE == 'postal_code') {
                address.pin_code = item.long_name;
            }
            else if (TYPE == 'country') {
                address.countery = item.long_name;
            }
            else if (TYPE == 'administrative_area_level_1') {
                address.state = item.long_name;
            }
            else if (TYPE == 'administrative_area_level_2') {
                address.city = item.long_name;
            }
        });
        obj["address"] = address;
        return obj
    }
    return false
}

export const getCurrentLatLng = async (callBack) => {
    const status = await checkLocationPermission();

    if (status == -1) {
        // when user blocked permission
        handleLocationBlockCase();
        return
    }

    if (status == true) {
        getPosition((coords) => {
            if (coords) {
                //callBack && callBack({ lat: -29.730959482113168, lng: 31.085299340895723 });
                callBack && callBack({ lat: coords.coords.latitude, lng: coords.coords.longitude });
                return
            }
            callBack && callBack(false);
            return
        });
    }

    else {
        requestForLocationPermission(() => {
            getPosition((coords) => {
                if (coords) {
                    //callBack && callBack({ lat: -29.730959482113168, lng: 31.085299340895723 });
                    callBack && callBack({ lat: coords.coords.latitude, lng: coords.coords.longitude });
                    return
                }
                callBack && callBack(false);
                return
            });
        });
    }
}

export const requestForLocationPermission = async (callBack) => {
    if (Platform.OS == 'ios') {
        //const status = await request(PERMISSIONS.IOS.LOCATION_ALWAYS);
        const status = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);


        if (status == RESULTS.GRANTED) {
            callBack && callBack(true);
        }
    }
    else {
        const status = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        if (status == RESULTS.GRANTED) {
            callBack && callBack();
        }
    }
}

export const checkLocationPermission = async () => {
    if (Platform.OS == 'ios') {
        const result = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

        if (result == RESULTS.GRANTED) {
            return true
        }
        if (result == RESULTS.BLOCKED) {
            return -1;
        }
    }
    else {
        const result = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

        if (result == RESULTS.GRANTED) {
            return true
        }
        if (result == RESULTS.BLOCKED) {
            return -1;
        }
    }
}

const getPosition = (callBack) => {
    if (Platform.OS == 'android') {
        enableLocation((respose) => {
            if (respose == enabled || respose == already_enabled) {
                Geolocation.getCurrentPosition(
                    // success callBack
                    (coords) => {

                        callBack && callBack(coords);
                    },
                    // error callBack
                    (error) => {

                        callBack && callBack(false);
                    },
                    {
                        enableHighAccuracy: true,
                        maximumAge: 5000,
                    }
                );
            }
            else {
                callBack && callBack(false);
            }
        });
    }
    else {


        Geolocation.getCurrentPosition(
            // success callBack
            (coords) => {

                callBack && callBack(coords);
            },
            // error callBack
            () => {

                callBack && callBack(false);
            },
            {
                enableHighAccuracy: true,
                maximumAge: 5000,
            }
        );
    }
}


export const handleLocationBlockCase = () => {
    Alert.alert(
        "Permission Blocked",
        "open setting and provide permission for location",
        [
            {
                text: "Cancel",

                style: "cancel"
            },
            { text: "Open Settings", onPress: () => openSettings() }
        ],
        { cancelable: false }
    );
}
