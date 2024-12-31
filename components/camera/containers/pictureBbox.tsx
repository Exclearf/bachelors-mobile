import { PanResponder, StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { Canvas, Group, Rect } from "@shopify/react-native-skia";
import { AppDimensionsContext } from "@/contexts/appDimensions";
import Animated, {
  clamp,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

type Props = {};
type CornerCordinates = {
  x: SharedValue<number>;
  y: SharedValue<number>;
};

const PictureBbox = (props: Props) => {
  const { width, height } = useContext(AppDimensionsContext);
  const handleSize = 40;
  const handleHalfSize = handleSize / 2;
  const doubleHandleSize = handleSize * 2;
  const maxHeight = height * 0.11;
  const topLeft = {
    x: useSharedValue(width * 0.1),
    y: useSharedValue(height * 0.2),
  };
  const topRight = {
    x: useSharedValue(width * 0.9),
    y: useSharedValue(height * 0.2),
  };
  const bottomRight = {
    x: useSharedValue(width * 0.9),
    y: useSharedValue(height * 0.7),
  };
  const bottomLeft = {
    x: useSharedValue(width * 0.1),
    y: useSharedValue(height * 0.7),
  };

  const cropPath = useDerivedValue(() => {
    return `
    M ${topLeft.x.value} ${topLeft.y.value}
    L ${topRight.x.value} ${topRight.y.value}
    L ${bottomRight.x.value} ${bottomRight.y.value}
    L ${bottomLeft.x.value} ${bottomLeft.y.value}
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

  const pressed = useSharedValue<boolean>(false);

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
        pressed.value = true;
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
        pressed.value = false;
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
      <Canvas style={styles.container}>
        <Group clip={cropPath} invertClip>
          <Rect
            x={0}
            y={0}
            width={width}
            height={height}
            color="rgba(75,75,75,0.5)"
          />
        </Group>
      </Canvas>

      {(
        [
          [
            topLeft,
            bottomLeft,
            topRight,
            cornerAnimatedStyleCreator(topLeft, 0, 0),
            ([valueX, valueY]: [number, number]) => {
              "worklet";
              return normalizationFactory(
                valueX,
                valueY,
                0,
                0,
                topRight.x.value - doubleHandleSize,
                bottomLeft.y.value - doubleHandleSize,
              );
            },
          ],
          [
            bottomLeft,
            topLeft,
            bottomRight,
            cornerAnimatedStyleCreator(bottomLeft, handleSize, 0),
            ([valueX, valueY]: [number, number]) => {
              "worklet";
              return normalizationFactory(
                valueX,
                valueY,
                0,
                topLeft.y.value + doubleHandleSize,
                bottomRight.x.value - doubleHandleSize,
                height - maxHeight,
              );
            },
            0,
            -handleSize,
          ],
          [
            topRight,
            bottomRight,
            topLeft,
            cornerAnimatedStyleCreator(topRight, 0, handleSize),
            ([valueX, valueY]: [number, number]) => {
              "worklet";
              return normalizationFactory(
                valueX,
                valueY,
                topLeft.x.value + doubleHandleSize,
                0,
                width,
                bottomRight.y.value - doubleHandleSize,
              );
            },
            -handleSize,
            0,
          ],
          [
            bottomRight,
            topRight,
            bottomLeft,
            cornerAnimatedStyleCreator(bottomRight, handleSize, handleSize),
            ([valueX, valueY]: [number, number]) => {
              "worklet";
              return normalizationFactory(
                valueX,
                valueY,
                bottomLeft.x.value + doubleHandleSize,
                topRight.y.value + doubleHandleSize,
                width,
                height - maxHeight,
              );
            },
            -handleSize,
            -handleSize,
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
    backgroundColor: "red",
    position: "absolute",
  },
  panResponderCorner: {
    width: 40,
    height: 40,
  },
});
