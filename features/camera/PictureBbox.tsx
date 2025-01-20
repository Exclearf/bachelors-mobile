import { StyleSheet, View } from "react-native";
import React, { useContext } from "react";
import { Canvas, Group, Path, Rect } from "@shopify/react-native-skia";
import Animated, {
  clamp,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { AppDimensionsContext } from "../shared/contexts/appDimensions";
import { useTheme } from "../shared/hooks/useTheme";
import { colorKit } from "reanimated-color-picker";

type CornerCordinates = {
  x: SharedValue<number>;
  y: SharedValue<number>;
};

const PictureBbox = () => {
  // TODO: Split into sub-components
  const { width, height } = useContext(AppDimensionsContext);
  const handleSize = 60;
  const handleHalfSize = handleSize / 2;
  const handleThirdSize = handleSize / 3;
  const handleTwoThirdSize = (handleSize * 2) / 3;
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

  const cornerAnimatedStyleCreator = (
    corner: CornerCordinates,
    topOffset: number,
    leftOffset: number,
  ) =>
    useAnimatedStyle(() => {
      return {
        top: corner.y.value - topOffset,
        left: corner.x.value - leftOffset,
      };
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

  const gestureFactory = (
    primaryCorner: CornerCordinates,
    secondaryHorizontalCorner: CornerCordinates,
    secondaryVerticalCorner: CornerCordinates,
    clampingFunc: ([valueX, valueY]: [number, number]) => [number, number],
    xOffset: number,
    yOffset: number,
  ) =>
    Gesture.Pan()
      .onBegin(() => {
        cornerOpacity.set(withTiming(1, { duration: 100 }));
      })
      .onChange((event) => {
        const [clampedX, clampedY] = clampingFunc([
          event.absoluteX - handleHalfSize - xOffset,
          event.absoluteY - handleHalfSize - yOffset,
        ]);
        primaryCorner.x.value = clampedX;
        primaryCorner.y.value = clampedY;

        secondaryHorizontalCorner.x.value = clampedX;
        secondaryVerticalCorner.y.value = clampedY;
      })
      .onFinalize(() => {
        cornerOpacity.set(withTiming(0.5));
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

  const cornerCreator = (
    corner: CornerCordinates,
    width: number,
    height: number,
    offsetX: number,
    offsetY: number,
    verticalCornerRadius: 1 | -1,
    horizontalCornerRadius: 1 | -1,
    sweepFlag: number,
  ) =>
    useDerivedValue(() => {
      const cornerRadiusInner = cornerRadius + Math.abs(offsetX);
      return `
    M ${corner.x.value + offsetX} ${corner.y.value + offsetY + height}
    L ${corner.x.value + offsetX} ${corner.y.value + offsetY + cornerRadiusInner * verticalCornerRadius}
    A ${cornerRadiusInner} ${cornerRadiusInner} 0 0 ${sweepFlag} ${corner.x.value + offsetX + cornerRadiusInner * horizontalCornerRadius} ${corner.y.value + offsetY}
    L ${corner.x.value + width + offsetX} ${corner.y.value + offsetY}
    `;
    });

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
          {(
            [
              [topLeft, 23, 23, -7, -7, 1, 1, 1],
              [topRight, -23, 23, 7, -7, 1, -1, 0],
              [bottomRight, -23, -23, 7, 7, -1, -1, 1],
              [bottomLeft, 23, -23, -7, 7, -1, 1, 0],
            ] as const
          ).map(
            (
              [
                corner,
                width,
                height,
                offsetX,
                offsetY,
                verticalCornerRadius,
                horizontalCornerRadius,
                sweepFlag,
              ],
              index,
            ) => (
              <Path
                key={index}
                style={"stroke"}
                strokeWidth={2}
                strokeCap={"round"}
                color={cornerStyle}
                path={cornerCreator(
                  corner,
                  width,
                  height,
                  offsetX,
                  offsetY,
                  verticalCornerRadius,
                  horizontalCornerRadius,
                  sweepFlag,
                )}
              />
            ),
          )}
        </Canvas>
      </GestureDetector>

      {(
        [
          [
            topLeft,
            bottomLeft,
            topRight,
            cornerAnimatedStyleCreator(
              topLeft,
              handleThirdSize,
              handleThirdSize,
            ),
            ([valueX, valueY]: [number, number]) => {
              "worklet";
              return normalizationFactory(
                valueX,
                valueY,
                8,
                maxHeight + 8,
                topRight.x.value - handleSize,
                bottomLeft.y.value - handleSize,
              );
            },
            -handleThirdSize,
            -handleThirdSize,
          ],
          [
            bottomLeft,
            topLeft,
            bottomRight,
            cornerAnimatedStyleCreator(
              bottomLeft,
              handleTwoThirdSize,
              handleThirdSize,
            ),
            ([valueX, valueY]: [number, number]) => {
              "worklet";
              return normalizationFactory(
                valueX,
                valueY,
                8,
                topLeft.y.value + handleSize,
                bottomRight.x.value - handleSize,
                height - maxHeight - 8,
              );
            },
            -handleThirdSize,
            -handleTwoThirdSize,
          ],
          [
            topRight,
            bottomRight,
            topLeft,
            cornerAnimatedStyleCreator(
              topRight,
              handleThirdSize,
              handleTwoThirdSize,
            ),
            ([valueX, valueY]: [number, number]) => {
              "worklet";
              return normalizationFactory(
                valueX,
                valueY,
                topLeft.x.value + handleSize,
                maxHeight + 8,
                width - 8,
                bottomRight.y.value - handleSize,
              );
            },
            -handleTwoThirdSize,
            -handleThirdSize,
          ],
          [
            bottomRight,
            topRight,
            bottomLeft,
            cornerAnimatedStyleCreator(
              bottomRight,
              handleTwoThirdSize,
              handleTwoThirdSize,
            ),
            ([valueX, valueY]: [number, number]) => {
              "worklet";
              return normalizationFactory(
                valueX,
                valueY,
                bottomLeft.x.value + handleSize,
                topRight.y.value + handleSize,
                width - 8,
                height - maxHeight,
              );
            },
            -handleTwoThirdSize,
            -handleTwoThirdSize,
          ],
        ] as const
      ).map(
        (
          [
            primaryCorner,
            secondaryHorizontalCorner,
            secondaryVerticalCorner,
            cornerStyle,
            clampingFunc,
            xOffset = 0,
            yOffset = 0,
          ],
          index,
        ) => (
          <GestureDetector
            key={index}
            gesture={gestureFactory(
              primaryCorner,
              secondaryHorizontalCorner,
              secondaryVerticalCorner,
              clampingFunc,
              xOffset,
              yOffset,
            )}
          >
            <Animated.View
              style={[
                styles.panResponder,
                styles.panResponderCorner,
                cornerStyle,
              ]}
            />
          </GestureDetector>
        ),
      )}
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
