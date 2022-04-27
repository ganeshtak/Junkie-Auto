import React from "react";
import { SafeAreaView, View, StatusBar, Platform } from 'react-native';
import { colors } from "../Style/baseStyle";


export const AppStatusBar = () => {
    return (
        <SafeAreaView style={{
            backgroundColor: colors.primary
        }}>
            <StatusBar
                backgroundColor={colors.primary}
                barStyle={Platform.OS == "android" ? 'light-content' : "light-content"}
            />
        </SafeAreaView>
    )
}