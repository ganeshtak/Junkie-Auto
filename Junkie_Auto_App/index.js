/**
 * @format
 */

import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import App from './App';
import { name as appName } from './app.json';
import { Store } from './src/Store';
import messaging from '@react-native-firebase/messaging';
import { showNotification } from './src/Constant/notification';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';// Req


messaging().setBackgroundMessageHandler(async msg => {
    console.log("=============BackgroundNotification===========", msg);
    const data = typeof msg?.data == "object" && Object.keys(msg?.data).length > 0 ? msg?.data : msg?.notification;
    showNotification(data?.title, data?.body, data);
});


const RootApp = () => {
    return (
        <Provider store={Store}>
            <App />
        </Provider>
    )
}

AppRegistry.registerComponent(appName, () => gestureHandlerRootHOC(RootApp));
