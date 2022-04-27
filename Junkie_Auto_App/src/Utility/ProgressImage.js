import React, { Component } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Svg, Circle, Text as SVGText } from 'react-native-svg';
import { colors, totalSize, UserIcon } from '../Style/baseStyle';



class CircularProgress extends Component {
    render() {
        const { size = 25, strokeWidth = 3, progressPercent } = this.props;
        const radius = (size - strokeWidth) / 2;
        const circum = radius * 2 * Math.PI;
        const svgProgress = 100 - progressPercent;
        if (progressPercent == 100) {
            return null
        }
        return (
            <>
                <Svg width={size} height={size}>
                    <Circle
                        stroke={colors.primary}
                        opacity={0.3}
                        fill="none"
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        {...{ strokeWidth: 1 }}
                    />
                    <Circle
                        stroke={colors.black}
                        fill="none"
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        strokeDasharray={`${circum} ${circum}`}
                        strokeDashoffset={radius * Math.PI * 2 * (svgProgress / 100)}
                        strokeLinecap="round"
                        transform={`rotate(-90, ${size / 2}, ${size / 2})`}
                        {...{ strokeWidth }}
                    />
                </Svg>
            </>
        )
    }
}



const Progress = Animated.createAnimatedComponent(CircularProgress);


export class ProgressImage extends Component {
    state = {
        hidde: false,
        error: false,
    }
    constructor() {
        super();
        this.progress = new Animated.Value(0);
        this.onProgress = this.onProgress.bind(this);
        this.onLoadEnd = this.onLoadEnd.bind(this);
    }

    componentDidMount() {

    }

    onProgress(event) {
        const progress = parseFloat(((event.nativeEvent.loaded * 100) / event.nativeEvent.total));
        this.progress.setValue(progress);
    }

    onLoadEnd() {
        this.progress.setValue(0);
        this.setState({ hidde: true });
    }

    render() {
        const { uri, style, resizeMode, user = false, asset = false, isBorderRadius = true, borderStyle,
        } = this.props;
        return (
            <View style={{ ...style, overflow: 'hidden' }}>
                {
                    !this.state.error ?
                        <FastImage
                            source={{ uri: uri }}
                            style={{
                                flex: 1, borderRadius: isBorderRadius ? 10 : 0, ...borderStyle,
                            }}
                            progressPercent
                            resizeMode={resizeMode}
                            onProgress={this.onProgress}
                            onLoadEnd={this.onLoadEnd}
                            onError={() => this.setState({ error: true })}
                        />
                        :
                        null
                }
                {
                    this.state.hidde ?
                        null
                        :
                        <View style={style2.ProgressCircleStyle}>
                            <Progress progressPercent={this.progress} />
                        </View>
                }
            </View>
        )
    }
}

const style2 = StyleSheet.create({
    ProgressCircleStyle: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

})


