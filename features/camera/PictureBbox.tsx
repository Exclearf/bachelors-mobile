import { Canvas, Group, Rect } from "@shopify/react-native-skia";
import React, { forwardRef, useContext, useImperativeHandle } from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  clamp,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { colorKit } from "reanimated-color-picker";

import { AppDimensionsContext } from "../shared/contexts/appDimensions";
import { useTheme } from "../shared/hooks/useTheme";
import CornerGestureHandle, {
  CornerHandleConfig,
} from "./components/buttons/CornerGestureHandle";
import CornerPath from "./components/primitives/CornerPath";
import {
  HANDLE_SIZE,
  HANDLE_THIRD_SIZE,
  HANDLE_TWO_THIRD_SIZE,
} from "./misc/constants";
import { CornerCoordinates, CornerRadius } from "./misc/types";

type PictureBboxProps = object;

export type PictureBboxRef = {
  topLeft: CornerCoordinates;
  bottomRight: CornerCoordinates;
  cornerSize: number;
};

const PictureBbox = forwardRef<PictureBboxRef, PictureBboxProps>(
  (props, ref) => {
    const { width, height } = useContext(AppDimensionsContext);
    const cornerRadius = 3;
    const maxHeight = height * 0.11;
    const cornerSize = 23;
    const initialHeight = height * 0.1;
    const initialY = (height * 0.45 - 10) / 2 - initialHeight / 2;

    const topLeft = {
      x: useSharedValue(width * 0.1),
      y: useSharedValue(initialY),
    };
    const topRight = {
      x: useSharedValue(width * 0.9),
      y: useSharedValue(initialY),
    };
    const bottomRight = {
      x: useSharedValue(width * 0.9),
      y: useSharedValue(initialY + initialHeight),
    };
    const bottomLeft = {
      x: useSharedValue(width * 0.1),
      y: useSharedValue(initialY + initialHeight),
    };

    useImperativeHandle(
      ref,
      () => ({
        topLeft: {
          x: topLeft.x,
          y: topLeft.y,
        },
        bottomRight: {
          x: bottomRight.x,
          y: bottomRight.y,
        },
        cornerSize: cornerSize,
      }),
      [topLeft.x, topLeft.y, bottomRight.x, bottomRight.y],
    );

    const cropPath = useDerivedValue(() => {
      return `
    M ${topLeft.x.get() + cornerRadius} ${topLeft.y.get()}
    L ${topRight.x.get() - cornerRadius} ${topRight.y.get()}
    A ${cornerRadius} ${cornerRadius} 0 0 1 ${topRight.x.get()} ${topRight.y.get() + cornerRadius}
    L ${bottomRight.x.get()} ${bottomRight.y.get() - cornerRadius}
    A ${cornerRadius} ${cornerRadius} 0 0 1 ${bottomRight.x.get() - cornerRadius} ${bottomRight.y.get()}
    L ${bottomLeft.x.get() + cornerRadius} ${bottomLeft.y.get()}
    A ${cornerRadius} ${cornerRadius} 0 0 1 ${bottomLeft.x.get()} ${bottomLeft.y.get() - cornerRadius}
    L ${topLeft.x.get()} ${topLeft.y.get() + cornerRadius}
    A ${cornerRadius} ${cornerRadius} 0 0 1 ${topLeft.x.get() + cornerRadius} ${topLeft.y.get()}
    Z
  `;
    });

    const theme = useTheme();

    const cornerColor = colorKit.RGB(theme?.primaryForeground!).array();
    const cornerOpacity = useSharedValue<number>(0.5);

    const backgroundColor = colorKit
      .setAlpha(theme?.primaryBackground!, 0.5)
      .hex();

    const cornerStyle = useDerivedValue(() => {
      return `rgba(${cornerColor[0]},${cornerColor[1]},${cornerColor[2]},${cornerOpacity.get()})`;
    });

    const moveCropPathPan = Gesture.Pan()
      .onBegin(() => cornerOpacity.set(withTiming(1)))
      .onChange((event) => {
        if (
          topLeft.x.get() + event.changeX < 8 ||
          topRight.x.get() + event.changeX > width - 8 ||
          topLeft.y.get() + event.changeY < maxHeight + 8 ||
          bottomLeft.y.get() + event.changeY > height - maxHeight - 8
        ) {
          return;
        }

        [topLeft, topRight, bottomRight, bottomLeft].forEach((corner) => {
          corner.x.set(corner.x.get() + event.changeX);
          corner.y.set(corner.y.get() + event.changeY);
        });
      })
      .onFinalize(() => cornerOpacity.set(withTiming(0.5)));

    const normalizationFactory = (
      valueX: number,
      valueY: number,
      minX: number,
      minY: number,
      maxX: number,
      maxY: number,
    ) => {
      "worklet";
      return [clamp(valueX, minX, maxX), clamp(valueY, minY, maxY)] as [
        number,
        number,
      ];
    };

    function makeCornerConfig(
      corner: CornerCoordinates,
      sx: CornerRadius,
      sy: CornerRadius,
    ): Omit<
      React.ComponentProps<typeof CornerPath>,
      "cornerRadius" | "cornerStyle"
    > {
      return {
        corner,
        width: cornerSize * sx,
        height: cornerSize * sy,
        offsetX: -7 * sx,
        offsetY: -7 * sy,
        verticalCornerRadius: sy,
        horizontalCornerRadius: sx,
        sweepFlag: sx * sy === 1 ? 1 : 0,
      };
    }

    const rawCorners: [CornerCoordinates, CornerRadius, CornerRadius][] = [
      [topLeft, 1, 1],
      [topRight, -1, 1],
      [bottomRight, -1, -1],
      [bottomLeft, 1, -1],
    ];

    const cornerConfigs = rawCorners.map(([corner, sx, sy]) =>
      makeCornerConfig(corner, sx, sy),
    );

    const cornerGestureConfigs: CornerHandleConfig[] = [
      {
        primaryCorner: topLeft,
        secondaryHorizontalCorner: bottomLeft,
        secondaryVerticalCorner: topRight,
        topOffset: HANDLE_THIRD_SIZE,
        leftOffset: HANDLE_THIRD_SIZE,
        clamp: ([x, y]) => {
          "worklet";
          return normalizationFactory(
            x,
            y,
            8,
            maxHeight + 8,
            topRight.x.get() - HANDLE_SIZE,
            bottomLeft.y.get() - HANDLE_SIZE,
          );
        },
        xOffset: -HANDLE_THIRD_SIZE,
        yOffset: 0,
        cornerOpacity,
      },
      {
        primaryCorner: bottomLeft,
        secondaryHorizontalCorner: topLeft,
        secondaryVerticalCorner: bottomRight,
        topOffset: HANDLE_TWO_THIRD_SIZE,
        leftOffset: HANDLE_THIRD_SIZE,
        clamp: ([x, y]) => {
          "worklet";
          return normalizationFactory(
            x,
            y,
            8,
            topLeft.y.get() + HANDLE_SIZE,
            bottomRight.x.get() - HANDLE_SIZE,
            height - maxHeight - 8,
          );
        },
        xOffset: -HANDLE_THIRD_SIZE,
        yOffset: 0,
        cornerOpacity,
      },
      {
        primaryCorner: topRight,
        secondaryHorizontalCorner: bottomRight,
        secondaryVerticalCorner: topLeft,
        topOffset: HANDLE_THIRD_SIZE,
        leftOffset: HANDLE_TWO_THIRD_SIZE,
        clamp: ([x, y]) => {
          "worklet";
          return normalizationFactory(
            x,
            y,
            topLeft.x.get() + HANDLE_SIZE,
            maxHeight + 8,
            width - 8,
            bottomRight.y.get() - HANDLE_SIZE,
          );
        },
        xOffset: -HANDLE_THIRD_SIZE,
        yOffset: 0,
        cornerOpacity,
      },
      {
        primaryCorner: bottomRight,
        secondaryHorizontalCorner: topRight,
        secondaryVerticalCorner: bottomLeft,
        topOffset: HANDLE_TWO_THIRD_SIZE,
        leftOffset: HANDLE_TWO_THIRD_SIZE,
        clamp: ([x, y]) => {
          "worklet";
          return normalizationFactory(
            x,
            y,
            bottomLeft.x.get() + HANDLE_SIZE,
            topRight.y.get() + HANDLE_SIZE,
            width - 8,
            height - maxHeight,
          );
        },
        xOffset: -HANDLE_TWO_THIRD_SIZE,
        yOffset: -HANDLE_THIRD_SIZE,
        cornerOpacity,
      },
    ];

    return (
      <View style={styles.container}>
        <GestureDetector gesture={moveCropPathPan}>
          <Canvas style={styles.container}>
            <Group clip={cropPath} invertClip>
              <Rect
                x={0}
                y={0}
                width={width}
                height={height}
                color={backgroundColor}
              />
            </Group>
            {cornerConfigs.map((cfg, i) => (
              <CornerPath
                key={i}
                {...cfg}
                cornerRadius={cornerRadius}
                cornerStyle={cornerStyle}
              />
            ))}
          </Canvas>
        </GestureDetector>
        {cornerGestureConfigs.map((cfg, i) => (
          <CornerGestureHandle key={i} {...cfg} />
        ))}
      </View>
    );
  },
);

PictureBbox.displayName = "PictureBbox";

export default PictureBbox;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  innerContainer: {
    backgroundColor: "transparent",
    width: 100,
    height: 50,
  },
  panResponder: {
    zIndex: 2,
    position: "absolute",
  },
  panResponderCorner: {
    width: 60,
    height: 60,
  },
});
