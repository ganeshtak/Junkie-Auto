import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ViewPropTypes } from 'react-native';
import { color } from "react-native-reanimated";
import { Fonts } from "../Asset/Font";
import { colors, FontSize, h, w } from "../Style/baseStyle";
import { AppText } from './AppText';


export const Button = ({
    children,
    onPress,
    activeOpacity = 0.8,
    style = ViewPropTypes,
    disable = false,
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={activeOpacity}
            style={style}
        >
            {children}
        </TouchableOpacity>
    )
}

export const AppButton = ({
    title = "title",
    onPress,
    activeOpacity = 0.8,
    backgroundColor = colors.primary,
    borderColor = colors.primary,
    textColor = colors.white,
    disabled = false,
}) => {
    return (
        <View style={{
            alignItems: 'center'
        }}>
            <TouchableOpacity
                onPress={onPress}
                disabled={disabled}
                activeOpacity={activeOpacity}
                style={{
                    ...styles.container,
                    backgroundColor: disabled ? colors.gray : backgroundColor,
                    borderColor: disabled ? colors.gray : borderColor,
                    borderWidth: 1,
                }}>
                <AppText style={{
                    ...styles.text,
                    color: textColor
                }}>{title}</AppText>
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.primary,
        borderRadius: 10,
        width: w(80),
        height: h(6),
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: FontSize.mdl,
        color: colors.white,
        fontFamily: Fonts.regular,
        textTransform: 'capitalize'
    }
})