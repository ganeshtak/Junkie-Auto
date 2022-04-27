import React from "react";
import { View, Text } from 'react-native';
import { Icons } from "../Asset/Icon";
import { AppConstant } from "../Constant/AppConstant";
import { styles } from '../Route/AppRoute';
import { colors, spacer, totalSize, w, headerHeight, shadow } from "../Style/baseStyle";
import { Button } from "./AppButton";

export const AppHeader = ({
    title = "Hello",
    onPress
}) => {
    const backOnPress = () => {
        if (onPress) {
            onPress && onPress();
            return
        }
        if (AppConstant.navigation) {
            AppConstant.navigation.goBack();
        }
    }
    return (
        <>
            <View style={{
                alignItems: 'center',
                flexDirection: 'row',
                width: w(100),
                paddingHorizontal: spacer,
                height: headerHeight,
                backgroundColor: colors.white,
                ...shadow[0],
            }}>

                <View style={{
                    position: 'absolute',
                    width: w(100),
                    height: headerHeight,

                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Text style={{
                        ...styles.titleStyle,
                        textAlign: 'center'
                    }}>{title}</Text>
                </View>

                <Button
                    onPress={backOnPress}
                    style={{
                        position: 'absolute',
                        width: headerHeight,
                        height: headerHeight,
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 10,
                    }}>
                    <Icons.BackIcon size={totalSize(2.3)} color={colors.black} />
                </Button>
            </View>

        </>
    )
}