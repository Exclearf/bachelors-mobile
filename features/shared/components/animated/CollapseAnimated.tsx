import React from "react";
import {
    interpolate,
    SharedValue,
    useDerivedValue,
} from "react-native-reanimated";
import { Canvas, Path } from "@shopify/react-native-skia";
import { StyleProp, ViewStyle } from "react-native";

type Props = {
    size: number;
    color: string;
    value: SharedValue<number>;
    canvasStyle?: StyleProp<ViewStyle>;
};

const CollapseAnimated = ({ value, size, color, canvasStyle }: Props) => {
    const arrowSize = size / 3;
    const arrowPadding = 1;

    const leftArrow = {
        start: { x: arrowPadding, y: size - arrowSize - arrowPadding },
        middleExpand: { x: arrowPadding, y: size - arrowPadding },
        middleCollapse: {
            x: arrowSize + arrowPadding,
            y: size - arrowSize - arrowPadding,
        },
        end: { x: arrowSize + arrowPadding, y: size - arrowPadding },
    };

    const rightArrow = {
        start: { x: size - arrowSize - arrowPadding, y: arrowPadding },
        middleExpand: { x: size - arrowPadding, y: arrowPadding },
        middleCollapse: {
            x: size - arrowSize - arrowPadding,
            y: arrowSize + arrowPadding,
        },
        end: { x: size - arrowPadding, y: arrowSize + arrowPadding },
    };

    const leftArrowPath = useDerivedValue(() => {
        const leftArrowMiddleX = interpolate(
            value.get(),
            [0, 1],
            [leftArrow.middleExpand.x, leftArrow.middleCollapse.x],
        );
        const leftArrowMiddleY = interpolate(
            value.get(),
            [0, 1],
            [leftArrow.middleExpand.y, leftArrow.middleCollapse.y],
        );

        return `M ${leftArrow.start.x}, ${leftArrow.start.y}
L ${leftArrow.start.x}, ${leftArrow.start.y}
L ${leftArrowMiddleX}, ${leftArrowMiddleY} 
L ${leftArrow.end.x}, ${leftArrow.end.y}`;
    });

    const rightArrowPath = useDerivedValue(() => {
        const rightArrowMiddleX = interpolate(
            value.get(),
            [0, 1],
            [rightArrow.middleExpand.x, rightArrow.middleCollapse.x],
        );
        const rightArrowMiddleY = interpolate(
            value.get(),
            [0, 1],
            [rightArrow.middleExpand.y, rightArrow.middleCollapse.y],
        );

        return `M ${rightArrow.start.x}, ${rightArrow.start.y}
L ${rightArrow.start.x}, ${rightArrow.start.y}
L ${rightArrowMiddleX}, ${rightArrowMiddleY} 
L ${rightArrow.end.x}, ${rightArrow.end.y}`;
    });

    return (
        <Canvas style={[canvasStyle, { width: size, height: size }]}>
            <Path
                style="stroke"
                strokeCap="round"
                strokeJoin="round"
                strokeWidth={2}
                path={leftArrowPath}
                color={color}
            />
            <Path
                style="stroke"
                strokeCap="round"
                strokeJoin="round"
                strokeWidth={2}
                path={rightArrowPath}
                color={color}
            />
        </Canvas>
    );
};

export default CollapseAnimated;
