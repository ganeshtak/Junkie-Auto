import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { w } from "../../../Style/baseStyle"

export function Mask1({ size, color }) {
    return (
        <Svg
            xmlns="http://www.w3.org/2000/svg"
            width={w(100)}
            height={500}
        >
            <Path
                data-name="Path 3"
                d="M428.192 426.788s-21.743 54.385-63.362 63.188-52.981-51.142-112.409-87.05c-32.749-19.786-42.692 47.384-87.626 60.439s-51.317-42.151-73.578-36.577c-1.526-.648-30.405 13.352-53.21 4.994S0 393.357 0 393.357V0h427.52z"
                fill="#cfcfd1"
            />
        </Svg>
    )
}

export function Mask2({ size, color }) {
    return (
        <Svg
            xmlns="http://www.w3.org/2000/svg"
            width={428.192}
            height={541.297}
        >
            <Path
                data-name="Path 3"
                d="M0 471.019s21.743 60.022 63.362 69.737 88.746-115.703 145.71-95.337 61.243-78.611 110.821-64.912 108.3 53.617 108.3 53.617V0H.672z"
                fill="#cfcfd1"
            />
        </Svg>
    )
}

export function Mask3({ size, color }) {
    return (
        <Svg
            xmlns="http://www.w3.org/2000/svg"
            width={427.687}
            height={551.855}
        >
            <Path
                data-name="Path 3"
                d="M0 377.887s15.415 78.066 57.034 87.781 86.19-83.759 144.165-51.826 40.376 60.154 100.622 103.919 125.7 32.9 125.7 32.9.374-57.991 0-550.658H0z"
                fill="#cfcfd1"
            />
        </Svg>
    )
}
