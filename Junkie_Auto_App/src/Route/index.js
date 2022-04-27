import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import {
    SplashNavigator,
    AuthNavigator,
    PromotionalSliderNavigator,
    LanguageNavigator
} from './StackNavigator';
import { Store } from '../Store';
import { AppRouteNavigator } from "./AppRoute";



export const RootNavigation = () => {
    const [appStatus, setAppStatus] = React.useState(Store.getState().UserReducer.app_status);

    Store.subscribe(() => {
        setAppStatus(Store.getState().UserReducer.app_status);
    });

    React.useEffect(() => {

    }, [appStatus]);


    const renderAppStack = () => {
        if (appStatus == 0) {
            return <SplashNavigator />
        }
        else if (appStatus == 1) {
            return <LanguageNavigator />
        }
        else if (appStatus == 2) {
            return <PromotionalSliderNavigator />
        }
        else if (appStatus == 3) {
            return <AuthNavigator />
        }
        else {
            return <AppRouteNavigator />
        }
    }

    return (
        <NavigationContainer>
            {renderAppStack()}
        </NavigationContainer>
    )
}