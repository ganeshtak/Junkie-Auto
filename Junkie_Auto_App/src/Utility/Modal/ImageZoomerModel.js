import React from "react";
import { Modal, View } from 'react-native';
import FastImage from "react-native-fast-image";
import { Icons } from "../../Asset/Icon";
import { colors, spacer, totalSize, w } from "../../Style/baseStyle";
import { Button } from "../AppButton";
import { ProgressImage } from "../ProgressImage";



export const ImageZoomModel = ({
    closeOnPress,
    url,
    size = w(100),
}) => {
    React.useEffect(() => {

    }, [])
    return (
        <Modal
            onRequestClose={closeOnPress}
            animationType="slide"
        >
            <View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <ProgressImage
                    style={{
                        width: size,
                        height: size * 1,
                    }}
                    resizeMode="contain"
                    //source={{ uri: url }}
                    uri={url}
                />

            </View>
            <CloseButton
                onPress={closeOnPress}
            />
        </Modal>
    )
}

const CloseButton = ({
    onPress
}) => {
    return (
        <Button
            onPress={onPress}
            style={{
                position: 'absolute',
                zIndex: 1,
                padding: spacer * .8,
                right: 0,
                backgroundColor: colors.red,
                borderRadius: 50,
                margin: spacer
                // justifyContent: 'center',
                // alignItems: 'center'
            }}>
            <Icons.CrossIcon size={totalSize(2.4)} color={colors.white} />
        </Button>
    )
}