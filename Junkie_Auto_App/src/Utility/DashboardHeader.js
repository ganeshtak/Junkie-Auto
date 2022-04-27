import React from "react";
import {
    View, Text, Image, StyleSheet, StatusBar, Platform,
    Animated, Easing, InteractionManager, FlatList
} from 'react-native';
import { Icons } from '../Asset/Icon';
import { w, h, colors, totalSize, spacer, FontSize } from '../Style/baseStyle';
import { SearchInput } from "./SearchInput";
import { Button } from './AppButton';
import { AppHeading } from "./AppHeading";
import { Fonts } from "../Asset/Font";
import FastImage from "react-native-fast-image";
import { color } from "react-native-reanimated";
import { AppConstant } from '../Constant/AppConstant';
import { ProgressImage } from '../Utility/ProgressImage';
import { getLangText } from "../Store/Actions/LangAction";
import { TextKey } from "../Constant/Language";

const des = "Get it now for all car’s get quality bids and direct buyers in no time.";

const headerHeight = h(6);

const UserImage = ({
    size = headerHeight * 1,
    userImage,
    onPress
}) => {
    return (
        <Button
            activeOpacity={1}
            onPress={onPress}
            style={{
                width: size,
                height: size,
                borderRadius: size,
                backgroundColor: colors.white,
                //marginHorizontal: totalSize(2),
                alignItems: 'center',
                justifyContent: 'center',
                borderColor: colors.white,
                borderWidth: 1,
                marginLeft: spacer,
                overflow: "hidden"
            }}>
            {
                userImage && userImage !== "file:///" ?
                    <ProgressImage
                        style={{
                            width: size,
                            height: size,
                        }}
                        resizeMode='cover'
                        //source={{ uri: userImage }}
                        uri={userImage}
                    />
                    :
                    <Icons.ProfileIcon size={totalSize(Platform.OS == "android" ? 3 : 3.3)} color={colors.primary} />
            }

        </Button>
    )
}

export const DashboardHeader = ({
    Height = Platform.OS == "android" ? h(44) : h(44),
    menuOnPress,
    imageOnPress,
    editable,
    searchOnPress,
    images = [],
    userImage,
}) => {

    const transform = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        InteractionManager.runAfterInteractions(() => {
            transform.setValue(0);
            startAnimation(1);
        })
    }, [])

    const startAnimation = (value = 1) => {
        Animated.timing(transform, {
            toValue: value,
            useNativeDriver: true,
            duration: 1000,
            //easing
        }).start();
    }

    const translateX = transform.interpolate({
        inputRange: [0, 1],
        outputRange: [w(80), 0],
        //extrapolate: 'clamp'
    })

    return (
        <View
            style={{
                height: Height,
            }}>
            {/* for background mask */}
            <View
                style={{
                    top: Platform.OS == 'ios' ? -h(38) : -h(35),
                    left: Platform.OS == 'ios' ? -w(22) : -w(26),
                    position: 'absolute',
                    width: w(100),
                }}>
                <Icons.HomeHeaderMask color={colors.primary} />
                <Animated.View
                    style={{
                        transform: [{ translateX: translateX }],
                        // width: w(100),
                        // height: h(32),
                    }}>
                    {/* <FastImage
                        style={{
                            flex: 1,
                            width: w(100),
                            //height: h(32),
                            height: h(30),
                            alignSelf: 'flex-end',
                            top: Platform.OS == "ios" ? -h(24) : -h(20),
                            left: Platform.OS == "android" ? w(32) : w(32)
                        }}
                        resizeMode='contain'
                        //source={require('../Asset/Image/homeCar.png')}
                        source={{ uri: images[0] }}
                    /> */}
                </Animated.View>
            </View>

            {/* for header tab */}
            <View
                style={{
                    position: 'absolute',
                    zIndex: 1,
                    height: headerHeight,
                    //backgroundColor: colors.white,
                    width: w(100),
                    flexDirection: 'row',
                    alignItems: 'center',
                    top: Platform.OS == 'android' ? 0 : spacer,
                    //paddingHorizontal: spacer,
                    paddingRight: spacer,
                }}>
                <Button
                    onPress={menuOnPress}
                    style={{
                        paddingHorizontal: totalSize(2),
                    }}>
                    <Icons.MenuIcon size={totalSize(3)} color={colors.white} />
                </Button>
                <View style={{ flex: 1 }}>
                    <SearchInput
                        placeholder={getLangText(TextKey.DashBoardSearchText)}
                        editable={editable}
                        onPress={searchOnPress}
                    />
                </View>
                <UserImage onPress={imageOnPress} userImage={userImage} />
            </View>

            <View
                style={{
                    top:
                        Platform.OS == 'android'
                            ? headerHeight * 0.8 + StatusBar.currentHeight
                            : headerHeight + StatusBar.currentHeight + spacer * 2,
                    paddingHorizontal: spacer,
                }}>
                <AppHeading
                    title={getLangText(TextKey.Limited_special_offer)}
                    color={colors.white}
                />
                <Text
                    style={{
                        ...styles.text,
                    }}>
                    {des}
                </Text>
            </View>
            <Animated.View
                style={{
                    flex: 1,
                    position: 'absolute',
                    zIndex: 100,
                    top: Platform.OS == "android" ? h(20) : h(22),
                    height: Height * 0.5,
                    transform: [{ translateX: translateX }],
                    //backgroundColor: colors.red,
                    marginHorizontal: spacer,
                    borderRadius: 10,
                    overflow: 'hidden',
                }}>
                <HomeSlider images={[...images]} />
                {/* <FlatList

                    data={images}
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    pagingEnabled
                    renderItem={({ item }) => {
                        return <FastImage
                            style={{
                                flex: 1,
                                width: w(100),
                                //height: h(32),
                                height: h(28),
                                alignSelf: 'flex-end',
                                //top: Platform.OS == "ios" ? -h(24) : -h(20),
                                //left: Platform.OS == "android" ? w(32) : w(32)
                            }}
                            resizeMode='contain'
                            //source={require('../Asset/Image/homeCar.png')}
                            source={{ uri: item }}
                        />
                    }}
                /> */}
            </Animated.View>
        </View>
    );
}

const HomeSlider = ({
    images = [1, 2],
    size = h(22),
    width = w(91)
}) => {

    const sliderRef = React.createRef();
    const [index, setIndex] = React.useState(0);

    React.useEffect(() => {

    }, [index]);

    const onScroll = (_index) => {
        sliderRef && sliderRef?.current?.scrollToIndex({ index: _index });
        setIndex(_index);
    }

    const slideOnPress = (isLeftPress) => {
        if (isLeftPress) {
            if (index > 0) {
                onScroll(index - 1)
            }
        }
        else {

            if (index < images.length - 1) {
                onScroll(index + 1)
            }
        }
    }

    const renderItem = ({ item, index }) => {

        return (
            <ProgressImage
                style={{
                    //flex: 1,
                    width: w(100) - spacer,
                    height: size,
                    //marginRight: spacer
                    //borderRadius: spacer,

                }}
                resizeMode='stretch'
                //source={require('../Asset/Image/homeCar.png')}
                //source={{ uri: item }}
                uri={item}
            />
        )
    }
    return (
        <View style={{
            width: width,
            height: size,
            borderRadius: spacer,
        }}>
            <FlatList
                ref={sliderRef}
                contentContainerStyle={{
                    borderRadius: spacer,
                }}
                data={images}
                renderItem={renderItem}
                horizontal
                scrollEnabled={false}
                //scrollEventThrottle={32}
                pagingEnabled
                keyExtractor={(I, i) => String(i)}
            />
            <View style={{
                position: 'absolute',
                bottom: 0,
                width: width,
                justifyContent: 'space-between',
                flexDirection: 'row',
                paddingHorizontal: spacer,
                paddingBottom: spacer * .5
            }}>
                {
                    true ?
                        <ArrowButton
                            onPress={() => { slideOnPress(true) }}
                            isLeftIcon
                        />
                        :
                        <View />
                }

                {
                    true && (
                        <ArrowButton
                            onPress={() => { slideOnPress(false) }}

                        />
                    )
                }

            </View>
        </View>
    )
}

export const ArrowButton = ({
    size = 40,
    onPress,
    icon,
    isLeftIcon = false
}) => {
    return (
        <Button
            onPress={onPress}
            style={{
                width: size,
                height: size,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 50,
                backgroundColor: colors.model,
                paddingLeft: spacer * .3,
                borderColor: colors.lightWhite,
                borderWidth: 1,
            }}>
            {
                isLeftIcon ?
                    <Icons.LeftArrowIcon size={totalSize(2)} color={colors.white} />
                    :
                    <Icons.RightArrowIcon size={totalSize(2)} color={colors.white} />

            }
        </Button>
    )
}


const styles = StyleSheet.create({
    text: {
        fontSize: FontSize.md,
        color: colors.white,
        fontFamily: Fonts.regular
    }
})