import React from "react";
import { View, Text, Animated, LayoutAnimation, StyleSheet, UIManager, InteractionManager, PlatformColor, Platform } from 'react-native';
import { Fonts } from "../Asset/Font";
import { colors, FontSize, shadow, spacer, w } from "../Style/baseStyle";

let Ref = undefined;
const snakeBarHeight = 50;
const timeInterval = 3000;
const animationSpeed = 500

export const RenderSnakeBar = () => {
    return <ShowMessage ref={ref => Ref = ref} />
}

export const ShowSnakeBar = (msg) => {
    Ref && Ref?.showMessage(msg);
}

class ShowMessage extends React.Component {

    animHeight = new Animated.Value(snakeBarHeight);
    state = {
        msg: "",
    }

    componentDidMount() {

    }

    showMessage = (message) => {
        this.setState({
            msg: message
        }, () => {
            this.timeId && clearTimeout(this.timeId);
            setTimeout(() => {
                this.startAnimation(1);
            }, 100)
        })
    }

    startAnimation = (value = 1) => {
        Animated.timing(this.animHeight, {
            toValue: value,
            duration: animationSpeed,
            useNativeDriver: true
        }).start(() => {
            this.timeId = setTimeout(() => {
                if (value == 1) {
                    this.stopAnimation(0);
                }
            }, timeInterval);
        });
    }

    stopAnimation = (value = 0) => {
        Animated.timing(this.animHeight, {
            toValue: value,
            duration: animationSpeed,
            useNativeDriver: true
        }).start(() => {
            this.setState({ msg: "" });
        })
    }

    render() {
        const translateY = this.animHeight.interpolate({
            inputRange: [0, 1],
            outputRange: [snakeBarHeight, 0],
            extrapolate: 'clamp'
        });

        if (this.state.msg == "") {
            return null
        }
        return (
            <Animated.View style={{
                ...styles.container,
                transform: [{ translateY: translateY }]
            }}>
                <Text style={{ ...styles.text }} numberOfLines={1}>{this.state.msg}</Text>
            </Animated.View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.primary,
        height: snakeBarHeight,
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0,
        width: w(100),
        left: 0,
        ...shadow[1],
    },
    text: {
        fontFamily: Fonts.regular,
        color: colors.white,
        fontSize: FontSize.md,
        textTransform: 'capitalize',
        paddingHorizontal: spacer
    }
})