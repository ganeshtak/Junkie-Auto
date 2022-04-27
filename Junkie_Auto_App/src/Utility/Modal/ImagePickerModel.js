import React, { Component, useState, useEffect } from 'react'
import {
    View, Modal, StyleSheet,
    Image, Text, TouchableOpacity,
    TextInput, Animated, Platform,
    Alert
} from 'react-native'
import ImagePicker from 'react-native-image-crop-picker';
import { check, openSettings, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { TextKey } from '../../Constant/Language';
import { getLangText } from '../../Store/Actions/LangAction';
import { colors, Font, FontSize, shadow, spacer, w } from '../../Style/baseStyle';
import { Button } from '../AppButton';



const denied = "denied";
const granted = "granted";


const imageType = {
    width: 200,
    height: 200,
}

export const getBlob_data = ({ uri }) => {
    const obj = {
        uri: uri, // Replace this to path in real build sourceURL
        name: 'photo.jpg',
        type: 'image/jpg'
    }
    return obj;
}

export const clearAppCatchImages = async () => {
    try {
        await ImagePicker.clean();
    } catch (error) {

    }
}


function checkStoragePermission(callback) {
    if (Platform.OS == 'android') {
        try {
            request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then((res) => {
                if (res == denied) {
                    callback(false)
                }
                else if (res == granted) {
                    callback(true)
                }
            })
        }
        catch (e) { callback(e) }
    }
    else {
        try {
            request(PERMISSIONS.IOS.PHOTO_LIBRARY).then((res) => {
                if (res === "granted") {
                    callback(true)
                }
                if (res === denied) {
                    callback(false)
                }
                else if (res === 'blocked') {
                    handleBlockCase();
                }

            })
        }
        catch (e) { callback(e) }
    }
}

const handleBlockCase = () => {
    Alert.alert(
        `${getLangText(TextKey.Permission_Blocked)}`,
        `${getLangText(TextKey.open_setting_provide_perm)}`,
        [
            {
                text: getLangText(TextKey.cancel),

                style: getLangText(TextKey.cancel),
            },
            {
                text: getLangText(TextKey.Open_Settings),
                onPress: () => openSettings(),
            },
        ],
        { cancelable: false },
    );
}
const openGallery = (isMultiple = true, callback) => {
    checkStoragePermission((permission) => {

        if (permission) {
            ImagePicker.openPicker({
                multiple: true,
                width: imageType.width,
                height: imageType.height
            }).then(images => {
                if (Array.isArray(images)) {
                    const img = images.map((item) => {
                        return getBlob_data({ uri: item?.path })
                    })
                    callback && callback(img)
                }
            }).catch((e) => {
                callback && callback(undefined)
                console.log(e)
            });
        }
    })

}

const openCamera = (callback) => {
    ImagePicker.openCamera({
        width: imageType.width,
        height: imageType.height
    }).then(image => {
        const img = getBlob_data({ uri: image?.path });
        callback && callback([img]);
    }).catch((e) => {
        callback && callback(undefined)
        console.log(e)
    });
}


export const ImagePickerModel = ({
    closeOnPress,
    galleryOnPress,
    cameraOnPress,
    isMultiple = true
}) => {

    const pickFromGallery = () => {
        openGallery(isMultiple, (img) => {
            if (img) {
                galleryOnPress && galleryOnPress(img);
            }
            closeOnPress && closeOnPress();
        });

    }

    const pickFromCamera = () => {
        openCamera((img) => {
            if (img) {
                galleryOnPress && galleryOnPress(img);
            }
            closeOnPress && closeOnPress();
        });

    }

    return (
        <Modal
            transparent
            onRequestClose={closeOnPress}
        >
            <Button
                onPress={closeOnPress}
                activeOpacity={1}
                style={{
                    flex: 1,
                    backgroundColor: colors.model
                }}>
                <View style={{
                    backgroundColor: colors.white,
                    position: 'absolute',
                    bottom: 0,
                    width: w(100),
                    paddingVertical: spacer,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    ...shadow[2],
                    zIndex: 1,
                }}>
                    <RenderBtn
                        title={getLangText(TextKey.Open_gallery)}
                        onPress={pickFromGallery}
                    />
                    <RenderBtn
                        title={getLangText(TextKey.Open_camera)}
                        topSpace={spacer}
                        onPress={pickFromCamera}
                    />
                </View>
            </Button>
        </Modal>
    )
}

const RenderBtn = ({
    title,
    onPress,
    topSpace = 0
}) => {
    return (
        <Button
            onPress={onPress}
            activeOpacity={0.8}
            style={{
                alignItems: 'center',
                marginTop: topSpace
            }}>
            <Text style={{
                fontFamily: Font.regular,
                color: colors.black,
                fontSize: FontSize.lg,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: colors.black,
                paddingHorizontal: spacer,
                paddingVertical: spacer * .5
            }}>{title}</Text>
        </Button>
    )
}