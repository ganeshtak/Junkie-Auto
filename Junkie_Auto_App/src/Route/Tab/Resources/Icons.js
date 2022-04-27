import * as React from "react";
import Svg, { Path, G } from "react-native-svg";

export function HomeIcon({ size, color, isActive }) {
    return (
        <Svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
        >
            <Path
                d="M26.8 14.851a1.71 1.71 0 01-1.254.52 1.687 1.687 0 01-1.241-.507l-.4-.4v11.181a1.662 1.662 0 01-.494 1.2 1.629 1.629 0 01-1.214.507h-5.119v-7.684a.867.867 0 00-.854-.854H11.1a.867.867 0 00-.854.854v7.685H5.123a1.629 1.629 0 01-1.214-.507 1.66 1.66 0 01-.493-1.2V14.464l-.4.4a1.687 1.687 0 01-1.241.507 1.71 1.71 0 01-1.254-.52A1.71 1.71 0 010 13.597a1.687 1.687 0 01.507-1.241L12.355.508a1.69 1.69 0 011.307-.506 1.69 1.69 0 011.308.506l11.847 11.848a1.687 1.687 0 01.507 1.241 1.71 1.71 0 01-.52 1.254z"
                //fill={color}
                stroke={color}
                fill={isActive ? color : "none"}
            />
        </Svg>
    )
}

export function BottomArrow({ size, color }) {
    return (
        <Svg
            xmlns="http://www.w3.org/2000/svg"
            width={38.115}
            height={9.001}
        >
            <Path
                data-name="Subtraction 5"
                d="M38.115 11H0a22.127 22.127 0 017.9-7.966A21.979 21.979 0 0119.057 0a21.98 21.98 0 0111.156 3.035 22.129 22.129 0 017.9 7.965z"
                fill={color}
            />
        </Svg>
    )
}


export function AuctionListIcon({ size, color, isActive }) {
    return (
        <Svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
        >
            <Path
                data-name="Path 392"
                d="M25.955 7.571H11.331a12.441 12.441 0 01.715-2.392 1.771 1.771 0 001.417-1.733V1.089A.589.589 0 0012.874.5H1.089a.589.589 0 00-.589.589v2.357a1.77 1.77 0 001.359 1.719 12.49 12.49 0 010 9.524A1.77 1.77 0 00.5 16.409v2.357a.589.589 0 00.589.589h11.785a.589.589 0 00.589-.589v-2.357a1.771 1.771 0 00-1.417-1.733 12.44 12.44 0 01-.715-2.392h14.624a2.357 2.357 0 000-4.714zM2.266 15.82h0s-.324.001 0 0z"
                fill={isActive ? color : "none"}
                stroke={color}
            />
        </Svg>
    )
}

export function PlusIcon({ size, color }) {
    return (
        <Svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
        >
            <G data-name="Group 1381" fill="none" stroke={color} strokeWidth={1.5}>
                <Path data-name="Path 10" d="M13.552 0v27.1" />
                <Path data-name="Path 11" d="M0 13.552h27.1" />
            </G>
        </Svg>
    )
}


