import React from "react";
import { Platform, Dimensions, PixelRatio } from 'react-native';
import { Fonts } from "../Asset/Font";
import { shadows } from './shadow';

const { width, height } = Dimensions.get('screen');
const MAXWIDTH = width;
const MAXHEIGHT = height;

const w = (_width) => width * (_width / 100);
const h = (_height) => height * (_height / 100);
const totalSize = num => (Math.sqrt((height * height) + (width * width)) * num) / 100;
const spacer = totalSize(2);

const searchInputHeight = Platform.OS == "android" ? h(6) : h(7);
export const headerHeight = h(7);

const colors = {
    red: "#E20404",
    primary: "#0E1648",
    black: "#000000",
    white: "#FFFFFF",
    gray: "rgba(0, 0, 0,0.5)",
    lightWhite: 'rgba(216,216,216,0.8)',
    model: 'rgba(0,0,0,.3)',
    yellow: "#E5AC10",
    green: "#45AF3D"
}

const FontSize = {
    sm: totalSize(1),
    md: totalSize(1.5),
    mdl: totalSize(2),
    lg: totalSize(2.5),
    xlg: totalSize(3),
}

const Font = Fonts;

const shadow = shadows;

export {
    w,
    h,
    MAXHEIGHT,
    MAXWIDTH,
    colors,
    FontSize,
    Font,
    totalSize,
    shadow,
    spacer,
    searchInputHeight
}