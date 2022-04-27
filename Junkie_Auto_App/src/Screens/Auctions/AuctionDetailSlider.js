import React from "react";
import { View, Text, Image, FlatList } from 'react-native';
import { Fonts } from "../../Asset/Font";
import { colors, h, shadow, spacer, totalSize, w } from "../../Style/baseStyle";
import {
    Icons
} from '../../Asset/Icon';
import { Button } from '../../Utility/AppButton';
import { getUsedTypeColor } from '../../Utility/Card/CarAuctions';
import { ArrowButton } from '../../Utility/DashboardHeader';
import { getLangText } from "../../Store/Actions/LangAction";

const radius = 20

const ShowStatus = ({
    status,
    status_key
}) => {
    return (
        <View style={{
            paddingVertical: spacer * .5,
            paddingHorizontal: spacer,
            backgroundColor: getUsedTypeColor(status_key),
            position: 'absolute',
            zIndex: 1,
            borderTopLeftRadius: radius,
            borderBottomLeftRadius: radius,
            right: 0,
            top: spacer
        }}>
            <Text style={{
                fontFamily: Fonts.regular,
                color: colors.white,
                textTransform: 'capitalize'
            }}>{status}</Text>
        </View>
    )
}

const BackButton = ({
    size = h(5),
    onPress
}) => {
    return (
        <Button
            onPress={onPress}
            style={{
                width: size,
                height: size,
                backgroundColor: colors.red,
                position: 'absolute',
                top: spacer,
                left: spacer,
                borderRadius: size,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
            <Icons.BackIcon size={totalSize(2)} color={colors.white} />
        </Button>
    )
}

const SlideButton = ({
    size = h(8),
    leftOnPress,
    rightOnPress,
    isLeftShow = true,
    isRightShow = true
}) => {

    return (
        <View style={{
            position: 'absolute',
            bottom: 0,
            zIndex: 1,
            width: w(100),
            alignItems: 'center',
            //top: w(70)
            //backgroundColor: 'red'
        }}>
            <View style={{
                width: size,
                height: size,
                borderRadius: size,
                backgroundColor: colors.white,
                ...shadow[2],
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    left: spacer * .3
                }}>
                    {
                        isLeftShow && (
                            <Button onPress={leftOnPress}>
                                <Icons.LeftArrowIcon size={totalSize(3)} color={colors.red} />
                            </Button>
                        )
                    }
                    {
                        isRightShow && (
                            <Button onPress={rightOnPress}>
                                <Icons.RightArrowIcon size={totalSize(3)} color={colors.red} />
                            </Button>
                        )
                    }
                </View>
            </View>
        </View>
    )
}

export const AuctionDetailSlider = ({
    size = w(100),
    backOnPress,
    Height = size * 1,
    status = "Used",
    _images = []
}) => {
    const images = [..._images]
    const sliderRef = React.createRef();
    const [index, setIndex] = React.useState(0);

    React.useEffect(() => {
        console.log(index, images.length)
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

    return (
        <View>
            <View style={{
                width: size,
                height: Height * .8,
                overflow: 'hidden',
                top: -size * .19,
                //transform: [{ scaleX: 1.1 }]
            }}>

                {/* mask */}
                <View style={{
                    flex: 1,
                    backgroundColor: colors.primary,
                }} >

                    <View style={{
                        flex: 1,
                    }}>
                        <FlatList
                            ref={sliderRef}
                            //ref={(ref)=>ref.}
                            data={images}
                            keyExtractor={(I, i) => String(i)}
                            pagingEnabled
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            scrollEnabled={false}
                            renderItem={({ item }) => {
                                return <Image
                                    style={{
                                        //flex: 1,
                                        width: size,
                                        height: Height * 2 * .55,
                                        //top: h(7),
                                        resizeMode: 'contain',
                                        transform: [{ scaleY: 1.3 }],
                                        backgroundColor: 'rgba(0,0,0,0.3)'
                                    }}
                                    //source={require('../../Asset/Image/MaskGroup1.png')}
                                    source={{ uri: item }}
                                />
                            }}
                        />
                        <View style={{
                            position: 'absolute',
                            bottom: 0,
                            width: w(100),
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingHorizontal: spacer,
                            paddingBottom: spacer
                        }}>
                            {
                                index > 0 ?
                                    <ArrowButton
                                        onPress={() => { slideOnPress(true) }}
                                        isLeftIcon
                                    />
                                    :
                                    <View />
                            }

                            {
                                index !== images.length - 1 && (
                                    <ArrowButton
                                        onPress={() => { slideOnPress(false) }}

                                    />
                                )
                            }

                        </View>

                    </View>

                </View>




            </View>
            <ShowStatus
                status={getLangText(status)}
                status_key={status}
            />

            <BackButton
                onPress={backOnPress}
            />
            {/* {
                images.length > 1 && (
                    <SlideButton
                        leftOnPress={() => slideOnPress(true)}
                        rightOnPress={() => slideOnPress(false)}
                        isLeftShow={index > 0}
                        isRightShow={index !== images.length - 1}
                    />
                )
            } */}
        </View>
    )
}