import React from "react";
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { colors, totalSize, w, shadow } from "../../Style/baseStyle";
import {
    HomeIcon,
    BottomArrow,
    AuctionListIcon,
    PlusIcon
} from './Resources/Icons';
import { Button } from '../../Utility/AppButton';
import { isUserLogged } from '../../Constant/Helper/UserHelper';

const iconSize = totalSize(3.9);
const activeColor = colors.primary;
const inActiveColor = colors.gray;
const tabHeight = totalSize(6.5);
const tabWidth = w(95);


const TabIcons = [
    {
        icon: (active) => <HomeIcon color={active ? activeColor : inActiveColor} size={iconSize} isActive={active} />
    },
    {
        icon: (active) => <PlusIcon color={active ? activeColor : inActiveColor} size={iconSize} />
    },
    {
        icon: (active) => <View style={{
            transform: [{ rotate: '42deg' }],
            top: 2
        }}><AuctionListIcon color={active ? activeColor : inActiveColor} size={iconSize} isActive={active} /></View>
    },
]

const getTabIcon = (index, isActive) => {
    return TabIcons[index].icon(isActive)
}

export const CustomTab = (props) => {

    const [selectedIndex, setIndex] = React.useState(0);

    const NavigateAction = (screen) => {
        props.navigation.navigate(screen);
    }

    const AnimatedSchema = React.useRef(new Animated.Value(0)).current;
    const Tabs = Array.isArray(props?.state?.routes) ? props?.state?.routes : [];

    const onTabPress = (index, screen) => {
        if (index == 1) {
            isUserLogged((res) => {
                if (res) {
                    navigateAction("AddNewAuction", index)
                }
            })
            return
        }
        navigateAction(screen, index)
    }

    const navigateAction = (screen, index) => {
        if (index !== 1) {
            Animated.spring(AnimatedSchema, {
                toValue: index,
                useNativeDriver: true,
            }).start();
            setIndex(index)
        }
        props.navigation.navigate(screen);
    }

    return (
        <View style={{
            backgroundColor: colors.white,

        }}>
            <View style={{
                ...styles.tabContainer,
                width: tabWidth,
            }}>
                {
                    Tabs.map((item, index) => {
                        return <RenderTabItem
                            index={index}
                            key={String(index)}
                            //translate={AnimatedSchema}
                            isActive={props.state.index == index}
                            onPress={() => { onTabPress(index, item?.name) }}
                            AnimatedSchema={AnimatedSchema}
                        />
                    })
                }
                {
                    props.state.index == selectedIndex && <BottomArrowView translate={AnimatedSchema} />
                }
            </View>
        </View>
    )
}

const RenderTabItem = ({
    onPress,
    isActive,
    translate,
    index,
    AnimatedSchema
}) => {
    return (
        <Button
            onPress={onPress}
            style={{
                alignItems: 'center',
                flex: 1,
                justifyContent: 'center',
                overflow: 'hidden',
            }}>
            {/* <Text>hello</Text> */}
            {
                getTabIcon(index, isActive)
            }
            {/* {
                isActive && <BottomArrowView translate={AnimatedSchema} />
            } */}
        </Button>
    )
}

const BottomArrowView = ({
    translate
}) => {
    const inputRange = [0, 1, 2];
    const outputRange = Platform.OS == "android" ? [tabWidth / 3 / 3.2, tabWidth / 3, (tabWidth / 3 / 3) + (tabWidth / 3) * 2] : [tabWidth / 3 / 3.1, tabWidth / 3, (tabWidth / 3 / 3) + (tabWidth / 3) * 2];

    const translateX = translate && translate.interpolate({ inputRange, outputRange, extrapolate: 'clamp' })
    return (
        <Animated.View style={{
            position: 'absolute',
            bottom: 0,
            transform: [{ translateX: translateX }]
        }}>
            <BottomArrow color={colors.primary} />
        </Animated.View>
    )
}


const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        height: tabHeight,
        backgroundColor: colors.white,
        ...shadow[1],
        margin: 10,
        borderRadius: 40,
    }
})