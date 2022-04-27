import React from "react";
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, FontSize, searchInputHeight, spacer, totalSize, w } from '../../Style/baseStyle';
import { Icons } from '../../Asset/Icon';
import { Fonts } from "../../Asset/Font";
import { Button } from '../../Utility/AppButton';
import { getLangText } from "../../Store/Actions/LangAction";
import { TextKey } from "../../Constant/Language";


const radius = 40;

export const LocationSearchInput = ({
    placeholder = "Search location",
    changeOnPress,
    editable,
    backOnPress,
    searchOnPress,
    value,
}) => {
    return (
        <View style={{
            ...styles.inputContainer,
            flexDirection: 'row',
            alignItems: 'center',
        }}>
            <Button
                onPress={backOnPress}
                style={{
                    paddingLeft: spacer,
                    paddingRight: 0
                }}>
                <Icons.BackIcon size={totalSize(2.5)} color={colors.black} />
            </Button>
            <Button
                onPress={searchOnPress}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 1,
                }}>
                <View style={{
                    paddingLeft: spacer,
                    paddingRight: spacer * .2
                }}>
                    <Icons.SearchIcon size={totalSize(1.8)} color={colors.gray} />
                </View>
                <View style={{ flex: 1, }}>
                    <TextInput
                        placeholder={placeholder}
                        editable={editable}
                        value={value}
                    />
                </View>
            </Button>
            <View>
                <Btn
                    onPress={changeOnPress}
                />
            </View>
        </View>
    )
}

const Btn = ({
    title = getLangText(TextKey.change),
    onPress
}) => {
    return (
        <Button
            onPress={onPress}
            style={{
                backgroundColor: colors.primary,
                borderRadius: radius,
                paddingHorizontal: spacer,
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
            <Text style={{
                ...styles.text
            }}>{title}</Text>
        </Button>
    )
}


const styles = StyleSheet.create({
    inputContainer: {
        width: '100%',
        height: searchInputHeight,
        backgroundColor: colors.white,
        borderRadius: 40,
    },
    text: {
        fontFamily: Fonts.regular,
        color: colors.white,
        fontSize: FontSize.md
    }
})