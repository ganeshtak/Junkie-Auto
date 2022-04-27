import React, { useRef } from 'react';
import { Animated, PanResponder, ScrollView, StyleSheet, Text } from 'react-native';
import { w } from '../Style/baseStyle';

let data = [];
for (let i = 0; i < 20; i += 1) data.push(i)

export function SwipableList({
    swipeOnPress
}) {
    return (
        <ScrollView>
            {data.map(item => (
                <SwipableItem key={item} swipeOnPress={swipeOnPress} />
            ))}
        </ScrollView>
    )
}

export function SwipableItem({
    swipeOnPress, children
}) {
    const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => false,
            onMoveShouldSetPanResponderCapture: (e, g) => Math.abs(g.dx) > 10,
            onMoveShouldSetPanResponder: (e, g) => false,
            onPanResponderGrant: () => { },
            onPanResponderMove: Animated.event([null, { dx: pan.x }], {
                useNativeDriver: false,
            }),
            onPanResponderRelease: (e, g) => {
                if (Math.abs(g.dx) > w(20)) {
                    swipeOnPress && swipeOnPress();
                }
                Animated.spring(pan, {
                    toValue: { x: 0, y: 0 },
                    useNativeDriver: true,
                }).start();
            },
            onPanResponderTerminate: (e, g) => {

                Animated.spring(pan, {
                    toValue: { x: 0, y: 0 },
                    useNativeDriver: true,
                }).start();
            },
        }),
    ).current;
    return (
        <Animated.View style={[styles.item, {
            transform: pan.getTranslateTransform()
        }]} {...panResponder.panHandlers} >
            {children}
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    item: {
        // height: 80,
        // width: '100%',
        // backgroundColor: '#193e82',
        // marginBottom: 5,
        // alignItems: 'center',
        // justifyContent: 'center'
    },
    txt: {
        color: '#fff',
        letterSpacing: 1
    }
})
