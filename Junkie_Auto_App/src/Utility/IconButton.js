import React from "react";
import { View } from 'react-native';
import { colors } from "../Style/baseStyle";
import { Button } from "./AppButton";

export const IconButton = ({
    size = 40,
    icon,
    iconSize,
    leftSpace = 0,
    onPress
}) => {
    return (
        <Button
            onPress={onPress}
            style={{
                width: size,
                height: size,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 5,
                borderColor: colors.lightWhite,
                borderWidth: 1,
                marginLeft: leftSpace
            }}>
            {icon}
        </Button>
    )
}