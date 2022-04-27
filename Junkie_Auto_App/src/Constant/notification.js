import React from 'react';
import { Platform, AppState, AppStateStatus, InteractionManager } from 'react-native';
import messaging, { AuthorizationStatus } from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';
import PushNotification from 'react-native-push-notification';
import { AppConstant } from './AppConstant';
import { EventRegister, EventType } from './EventRegister';
import { NotificationType, ScreenTypes } from './Data';
import { getMyAuctionDetail } from '../Screens/Auctions/Utils';
import { getBidDetail } from '../Screens/Bids/Utils';


const Title = "Junkie Auto";

const checkPermission = async () => {
    try {
        const hasPermission = await firebase.messaging().hasPermission();
        if (hasPermission) {
            getDeviceToken();
        }
        else {
            requestPermission();
        }
    } catch (error) {
        console.log(error)
    }
}

const requestPermission = async () => {
    try {
        const isPermissionGranted = await messaging().requestPermission();
        if (isPermissionGranted) {
            checkPermission();
        }
    } catch (error) {
        console.log(error)
    }
}

const getDeviceToken = async () => {
    try {
        const token = await messaging().getToken();
        console.log("===============fcm token ============", token);
        if (token) {
            AppConstant.fcm_token = token;
        }
    } catch (error) {
        console.log(error)
    }
}

const getMessage = async () => {
    try {
        const msg = await messaging().onMessage(async (msg) => {
            console.log("=============Notification===========", msg);
            const data = typeof msg?.data == "object" && Object.keys(msg?.data).length > 0 ? msg?.data : msg?.notification;
            showNotification(data?.title, data?.body, data);
        })
    } catch (error) {
        console.log(error)
    }
}

export const showNotification = (title, message, user = {}) => {
    EventRegister.emit(EventType.new_notification);
    const channelId = "default_notification_channel_id"
    PushNotification.localNotification({
        title: Title,
        message: message,
        userInfo: user,
        channelId: channelId,
        playSound: true,

    });
}

function createNotificationChannel() {
    if (Platform.OS == 'android') {
        PushNotification.createChannel(
            {
                channelId: "default_notification_channel_id", // (required)
                channelName: "default_notification_channel_id", // (required)
                channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
                soundName: 'notification_sound.mp3',
                importance: 4, // (optional) default: 4. Int value of the Android notification importance
                vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
            },
            (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
        );
    }
    return
}

const getMyAuctionDetailByApi = (id) => {
    getMyAuctionDetail(id, ScreenTypes.myAuction);
}

const getMyBidDetailByApi = (id) => {
    getBidDetail(id, ScreenTypes.bid_list);
}

export const NotificationOnPress = (notification) => {
    InteractionManager.runAfterInteractions(() => {
        if (notification?.data && "type" in notification?.data) {

            if ([NotificationType.seller].includes(notification?.data?.type)) {
                getMyAuctionDetailByApi(notification?.data?.auction_id);
                return
            }

            if ([NotificationType.buyer].includes(notification?.data?.type)) {
                getMyBidDetailByApi(notification?.data?.auction_id);
                return
            }

            if ([NotificationType.auction_reject, NotificationType.auction_accept].includes(notification?.data?.type)) {
                getMyAuctionDetailByApi(notification?.data?.id);
            }
        }
    })
}

export const callNotification = () => {
    PushNotification.configure({
        onNotification: (notification) => {
            if (Platform.OS == "ios") {
                if (notification && notification?.userInteraction == true) {
                    EventRegister.emit(EventType.notificationClick, notification);
                    return
                }
            }
            else {
                EventRegister.emit(EventType.notificationClick, notification);
                return
            }
        }
    })
    checkPermission();
    createNotificationChannel();
    getMessage();
}



