import React from 'react';
import { View, Text, } from 'react-native'
import { color } from 'react-native-reanimated';
import { Fonts } from '../Asset/Font';
import { Icons } from '../Asset/Icon';
import { colors, FontSize, h, MAXWIDTH, searchInputHeight, spacer, totalSize, w } from '../Style/baseStyle';



export const AppNoDataFound = ({
    message = "No result found",
    Height = h(2),
}) => {
    return (
        <View style={{
            alignItems: 'center',
            height: Height,
            justifyContent: 'center'
        }}>
            <Text style={{
                fontFamily: Fonts.regular,
                color: colors.gray,
                fontSize: FontSize.mdl,
                textAlign: 'center'
            }}>{message}</Text>
        </View>
    )
}