import React from 'react';
import { View, TextInput, StyleSheet, Text, Platform, Animated, InteractionManager } from 'react-native'
import { color } from 'react-native-reanimated';
import { Fonts } from '../Asset/Font';
import { Icons } from '../Asset/Icon';
import { colors, FontSize, h, MAXWIDTH, searchInputHeight, spacer, totalSize, w } from '../Style/baseStyle';
import { Button } from './AppButton';

export const AppTextInput = ({
    placeholder = "Enter Email",
    onChangeText,
    icon,
    value,
    iconOnPress,
    onPress,
    keyboardType = "email-address" || "numeric",
    secureTextEntry,
    leftIcon,
    editable = true,
    autoCapitalize = false,
    textAlign = "auto",
    Height = searchInputHeight,
    textAndIconAlignCenter = false,
    centerIcon,
    textAlignVertical,
    additionalInfoInput = false,
    bottom = spacer,
    onBlur,
    onFocus,
    animateLabel = true,
}) => {

    React.useEffect(() => { }, []);

    const anim = React.useRef(new Animated.Value(0)).current;

    const opacity = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });
    const scale = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    const startAnimation = (value = 1) => {
        Animated.spring(anim, {
            toValue: value,
            useNativeDriver: true,
            stiffness: 80,
            damping: 40
        }).start();
    }

    return (
        <Button
            onPress={onPress}
            style={{
                ...styles.containerStyle,
                height: Height,
                alignItems: additionalInfoInput ? 'flex-start' : 'center',
                marginBottom: bottom,
            }}>
            {
                value ? (
                    <Animated.View style={{
                        position: 'absolute',
                        top: -spacer * .6,
                        marginLeft: spacer * .7,
                        //transform: [{ scale: editable ? animateLabel ? scale : 1 : 1 }]
                    }}>
                        <Text style={{
                            ...styles.inputStyle,
                            fontSize: FontSize.mdl * .9,
                            backgroundColor: colors.white,
                            paddingLeft: 0,
                            color: colors.gray
                        }}>{placeholder}</Text>
                    </Animated.View>
                )
                    :
                    null
            }
            {
                leftIcon && (
                    <View style={{
                        paddingLeft: spacer,
                        top: 1,
                    }}>
                        {leftIcon}
                    </View>
                )
            }
            <View style={{
                flex: 1,
                alignItems: textAndIconAlignCenter ? 'center' : 'flex-start'
            }}>
                {
                    editable ?
                        <TextInput
                            style={{
                                width: '100%',
                                ...styles.inputStyle,
                                paddingVertical: spacer * .15,
                                paddingTop: additionalInfoInput ? spacer * .5 : 0,
                                //backgroundColor: colors.red
                                textTransform: autoCapitalize ? keyboardType == "email-address" ? "none" : 'capitalize' : "none"
                            }}
                            placeholder={placeholder}
                            onChangeText={onChangeText}
                            value={value}
                            // selection={undefined}
                            keyboardType={keyboardType}
                            secureTextEntry={secureTextEntry}
                            autoCapitalize={autoCapitalize ? "words" : "none"}
                            returnKeyType="done"
                            editable={editable}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            placeholderTextColor={colors.gray}
                            textAlignVertical={textAlignVertical}
                        />
                        :
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            flex: 1,

                        }}>
                            {
                                centerIcon && (
                                    <View style={{ paddingRight: 0, top: 3 }}>
                                        {centerIcon}
                                    </View>
                                )
                            }
                            <Text style={{
                                ...styles.inputStyle,
                                color: value ? colors.black : colors.gray,

                            }} numberOfLines={1}>{value ? value : placeholder}</Text>
                        </View>
                }
            </View>
            {
                icon && (
                    <Button
                        onPress={iconOnPress}
                        style={{
                            paddingRight: spacer,
                            top: 2,
                        }}>
                        {icon}
                    </Button>
                )
            }
        </Button>
    )
};

const styles = StyleSheet.create({
    containerStyle: {
        borderColor: colors.lightWhite,
        borderRadius: 10,
        borderWidth: 1,
        flexDirection: 'row',

        width: '100%',
    },
    inputStyle: {
        paddingLeft: Platform.OS == "android" ? spacer * .7 : spacer,
        fontFamily: Fonts.regular,
        color: colors.black,
        fontSize: FontSize.mdl * .9,

    }
});