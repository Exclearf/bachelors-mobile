import { Canvas, Group, Rect } from "@shopify/react-native-skia";
import React, { useContext } from "react";
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
  HANDLE_HALF_SIZE,
  HANDLE_SIZE,
  HANDLE_THIRD_SIZE,
  HANDLE_TWO_THIRD_SIZE,
} from "./misc/constants";
import { CornerCoordinates, CornerRadius } from "./misc/types";

const PictureBbox = () => {
  // TODO: Split into sub-components
  const { width, height } = useContext(AppDimensionsContext);
  const cornerRadius = 3;
  const maxHeight = height * 0.11;

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

  const cropPath = useDerivedValue(() => {
    return `
    M ${topLeft.x.value + cornerRadius} ${topLeft.y.value}
    L ${topRight.x.value - cornerRadius} ${topRight.y.value}
    A ${cornerRadius} ${cornerRadius} 0 0 1 ${topRight.x.value} ${topRight.y.value + cornerRadius}
    L ${bottomRight.x.value} ${bottomRight.y.value - cornerRadius}
    A ${cornerRadius} ${cornerRadius} 0 0 1 ${bottomRight.x.value - cornerRadius} ${bottomRight.y.value}
    L ${bottomLeft.x.value + cornerRadius} ${bottomLeft.y.value}
    A ${cornerRadius} ${cornerRadius} 0 0 1 ${bottomLeft.x.value} ${bottomLeft.y.value - cornerRadius}
    L ${topLeft.x.value} ${topLeft.y.value + cornerRadius}
    A ${cornerRadius} ${cornerRadius} 0 0 1 ${topLeft.x.value + cornerRadius} ${topLeft.y.value}
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
        topLeft.x.value + event.changeX < 8 ||
        topRight.x.value + event.changeX > width - 8 ||
        topLeft.y.value + event.changeY < maxHeight + 8 ||
        bottomLeft.y.value + event.changeY > height - maxHeight - 8
      ) {
        return;
      }

      [topLeft, topRight, bottomRight, bottomLeft].forEach((corner) => {
        corner.x.value += event.changeX;
        corner.y.value += event.changeY;
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
      width: 23 * sx,
      height: 23 * sy,
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
          topRight.x.value - HANDLE_SIZE,
          bottomLeft.y.value - HANDLE_SIZE,
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
          topLeft.y.value + HANDLE_SIZE,
          bottomRight.x.value - HANDLE_SIZE,
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
          topLeft.x.value + HANDLE_SIZE,
          maxHeight + 8,
          width - 8,
          bottomRight.y.value - HANDLE_SIZE,
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
          bottomLeft.x.value + HANDLE_SIZE,
          topRight.y.value + HANDLE_SIZE,
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
};

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
