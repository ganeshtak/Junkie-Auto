import React, { useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { Fonts } from '../../Asset/Font';
import { Icons } from '../../Asset/Icon';
import { Price_Format } from '../../Constant/Helper/PriceFormat';
import { colors, FontSize, h, shadow, spacer, totalSize, w } from '../../Style/baseStyle';
import { Button } from '../AppButton';
import { getImageUrl } from '../../Constant/Helper/ImageUrl';
import { ProgressImage } from '../../Utility/ProgressImage';





export const ExpiredAuction = ({
    title = "Your Lexus - Ls430 - 2004 post has been expired today",
    image,
    onPress
}) => {
    const _image = getImageUrl(image);


    return (
        <Button
            onPress={onPress}
            style={{
                ...styles.container,
            }}>
            <View style={{
                width: '30%',
                height: '100%',
            }}>
                <ProgressImage
                    style={{
                        flex: 1,
                        width: undefined,
                        height: undefined,
                        borderRadius: 5,
                    }}
                    resizeMode="cover"
                    uri={_image}
                />
            </View>
            <View style={{
                flex: 1,
                flexDirection: 'row',
                //alignItems: 'center',
                paddingLeft: spacer * .6,
            }}>
                <Text style={{
                    ...styles.text,
                    width: '85%',
                }}>{title}</Text>
            </View>
            <View style={{
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Icons.RightArrowIcon size={totalSize(2)} color={colors.gray} />
            </View>
        </Button>
    )
}


const styles = StyleSheet.create({
    container: {
        borderRadius: 8,
        borderColor: colors.lightWhite,
        borderWidth: 1,
        padding: spacer * .5,
        flexDirection: 'row',
        //alignItems: 'center',
        width: w(100) - spacer * 2,
        height: h(13),
        //marginRight: spacer
    },
    text: {
        fontFamily: Fonts.regular,
        color: colors.black,
        fontSize: FontSize.lg * .7,
    }
})