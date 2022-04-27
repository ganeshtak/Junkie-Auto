import React from 'react';
import { AppScreens } from '../Screens';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { HeaderOptions } from './AppRoute';

const Stack = createStackNavigator();


export const SplashNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Splash"
                component={AppScreens.Splash}
                options={{
                    headerShown: false
                }}
            />
        </Stack.Navigator>
    )
}

export const LanguageNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="LanguageScreen">
            <Stack.Screen name="LanguageScreen"
                component={AppScreens.LanguageScreen}
                options={{
                    headerTitle: "Select language",
                    headerTitleAlign: 'center'
                }}
            />
        </Stack.Navigator>
    )
}

export const AuthNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="AuthNavigator" screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerTitleAlign: 'center'
        }}>
            <Stack.Screen name="Login" component={AppScreens.Login}
                options={{ headerShown: false }}
            />
            <Stack.Screen name="Register" component={AppScreens.Register}
                options={{
                    ...HeaderOptions({ title: "" })
                }}
            />

            <Stack.Screen
                component={AppScreens.ForgotPassword}
                name="forgotPassword"
                options={{
                    ...HeaderOptions({ title: '' }),
                }}
            />
            <Stack.Screen
                component={AppScreens.OtpVerification}
                name="OtpVerification"
                options={{
                    ...HeaderOptions({ title: '' }),
                }}
            />
            <Stack.Screen
                component={AppScreens.ChangePassword}
                name="ChangePassword"
                options={{
                    ...HeaderOptions({ title: '' }),
                }}
            />
        </Stack.Navigator>
    )
}

export const PromotionalSliderNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Slider" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Slider" component={AppScreens.Slider} />
        </Stack.Navigator>
    )
}