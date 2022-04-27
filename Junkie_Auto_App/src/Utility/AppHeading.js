import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Fonts } from "../Asset/Font";
import { colors, FontSize, h, totalSize, w } from "../Style/baseStyle";



export const AppHeading = ({
    title,
    color = colors.black,
    fontSize = FontSize.lg,
    fontFamily = Fonts.regular,
}) => {
    return (
        <View style={{
            marginBottom: totalSize(1)
        }}>
            <Text style={{
                fontFamily: fontFamily,
                fontSize: fontSize,
                color: color
            }}>
                {title}
            </Text>
        </View>
    )
}

