import React, { useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { Fonts } from '../Asset/Font';
import { colors, FontSize } from '../Style/baseStyle';
import { useIsFocused } from '@react-navigation/native';

export function AppGridButton({
    list = ['button 1', 'button 2', 'button 3'],
    onPress,
    selectedTab = "Active"
}) {
    const [active, setActive] = useState(1);
    return (
        <View style={styles.container}>
            <Button
                buttons={list}
                selectedTab={selectedTab}
                onClick={(i, btn) => {
                    setActive(i);
                    onPress && onPress(i, btn)
                }}
            />
        </View>
    );
}


function Button({ buttons = [], onClick, selectedTab }) {
    const [btnContainerWidth, setWidth] = useState(0);
    const btnWidth = btnContainerWidth / buttons.length;
    const translateX = useRef(new Animated.Value(0)).current;
    const translateXOpposit = translateX.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
    });
    const onPress = (i, btn) => {
        onClick(i + 1, btn);
        Animated.spring(translateX, {
            toValue: i * btnWidth,
            useNativeDriver: true,
            bounciness: 0,
        }).start();
    };

    React.useEffect(() => {
        resetTab();
    }, []);

    const resetTab = () => {
        const index = buttons.findIndex((item) => item == selectedTab);
        if (index > 0) {
            onPress(index)
        }
    }


    return (
        <View
            style={styles.btnContainer}
            onLayout={e => setWidth(e.nativeEvent.layout.width)}>
            {buttons.map((btn, i) => (
                <TouchableOpacity
                    key={btn}
                    style={styles.btn}
                    onPress={() => onPress(i, btn)}>
                    <Text style={{
                        ...styles.text
                    }}>{btn}</Text>
                </TouchableOpacity>
            ))}

            <Animated.View
                style={[
                    styles.animatedBtnContainer,
                    { width: btnWidth, transform: [{ translateX }] },
                ]}>
                {buttons.map(btn => (
                    <Animated.View
                        key={btn}
                        style={[
                            styles.animatedBtn,
                            { width: btnWidth, transform: [{ translateX: translateXOpposit }] },
                        ]}>
                        <Text style={{
                            ...styles.text,
                            color: colors.white
                        }}>{btn}</Text>
                    </Animated.View>
                ))}
            </Animated.View>
        </View>
    );
}
const Height = 45;

const styles = StyleSheet.create({
    container: {
        //paddingHorizontal: 20,
    },
    btnContainer: {
        height: Height,
        borderRadius: 50,
        overflow: 'hidden',
        flexDirection: 'row',
        backgroundColor: '#00000011',
        width: '100%',
    },
    btn: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    animatedBtnContainer: {
        height: Height,
        flexDirection: 'row',
        position: 'absolute',
        overflow: 'hidden',
        backgroundColor: colors.red,
        borderRadius: 50,
    },
    animatedBtn: {
        height: Height,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnTextActive: {
        color: '#fff',
        fontFamily: Fonts.regular
    },
    text: {
        fontFamily: Fonts.regular,
        color: colors.black,
        fontSize: FontSize.mdl * .8
    }
});
