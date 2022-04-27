import React from 'react';
import { AppScreens } from '../../Screens';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CustomTab } from './CustomTabBar';
import { colors } from '../../Style/baseStyle';


const Tab = createBottomTabNavigator();

const Tabs = [
    "Dashboard",
    "AddAuction",
    "AuctionList"
]


export const TabNavigator = () => (
    <Tab.Navigator
        initialRouteName="Dashboard"
        screenOptions={{
            headerShown: false,
            tabBarStyle: {

            },
            tabBarHideOnKeyboard: true
        }}
        tabBar={(props) => <CustomTab {...props} />}
    >
        <Tab.Screen name={Tabs[0]} component={AppScreens.Dashboard} />
        <Tab.Screen name={Tabs[1]} component={AppScreens.AddNewAuction} />
        <Tab.Screen name={Tabs[2]} component={AppScreens.AuctionList} />
    </Tab.Navigator>
)