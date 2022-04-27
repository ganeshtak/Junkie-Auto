import React from "react";
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Fonts } from "../Asset/Font";
import { Icons } from '../Asset/Icon';
import { w, h, colors, totalSize, searchInputHeight } from '../Style/baseStyle';
import { Button } from "./AppButton";


const iconSize = totalSize(2);

export const SearchInput = ({
    placeholder = "Search",
    textColor,
    editable,
    onPress,
    onChangeText
}) => {
    return (
        <Button
            onPress={onPress}
            style={{
                ...styles.inputContainer,
                borderColor: textColor ? textColor : colors.white,
            }}>
            <View style={{
                paddingHorizontal: totalSize(1)
            }}>
                <Icons.SearchIcon size={iconSize} color={textColor ? textColor : colors.white} />
            </View>
            <TextInput
                placeholder={placeholder}
                style={{
                    ...styles.inputStyle,
                    color: textColor,

                }}
                onChangeText={onChangeText}
                editable={editable}
                placeholderTextColor={textColor ? textColor : colors.white}
            />
        </Button>
    )
}

const styles = StyleSheet.create({
    inputContainer: {
        borderRadius: 40,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: searchInputHeight,
        //justifyContent: 'center'
    },
    inputStyle: {
        fontFamily: Fonts.regular,
        color: colors.white
    }
})