import React from "react";
import { SafeAreaView, View, StatusBar } from 'react-native';
import { colors } from "../Style/baseStyle";



export const AppContainer = ({
    children,
    backgroundColor = colors.white
}) => {
    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: backgroundColor
            }}
        >
            {children}
        </SafeAreaView>
    )
}