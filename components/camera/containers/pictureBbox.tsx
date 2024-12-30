import { PanResponder, StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { Canvas, Group, Rect } from "@shopify/react-native-skia";
import { AppDimensionsContext } from "@/contexts/appDimensions";
import Animated, {
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

  const isValidSquare = useDerivedValue(() => {
    const handlePadding = handleSize * 2;
    console.log(`Bottom left y: ${bottomLeft.y.value}`);
    console.log(`Top left y: ${topLeft.y.value}`);
    return (
      topLeft.x.value + handlePadding < topRight.x.value &&
      topLeft.y.value + handlePadding < bottomLeft.y.value
    );
  });

  const cropPath = useDerivedValue(() => {
    return `
    M ${topLeft.x.value} ${topLeft.y.value}
    L ${topRight.x.value} ${topRight.y.value}
    L ${bottomRight.x.value} ${bottomRight.y.value}
    L ${bottomLeft.x.value} ${bottomLeft.y.value}
    Z
  `;
  });

  const topLeftAnimatedStyle = useAnimatedStyle(() => {
    return {
      top: topLeft.y.value,
      left: topLeft.x.value,
    };
  });

  const bottomLeftAnimatedStyle = useAnimatedStyle(() => {
    return {
      top: bottomLeft.y.value - handleSize,
      left: bottomLeft.x.value,
    };
  });

  const topRightAnimatedStyle = useAnimatedStyle(() => {
    return {
      top: topRight.y.value,
      left: topRight.x.value - handleSize,
    };
  });

  const bottomRightAnimatedStyle = useAnimatedStyle(() => {
    return {
      top: bottomRight.y.value - handleSize,
      left: bottomRight.x.value - handleSize,
    };
  });

  const pressed = useSharedValue<boolean>(false);

  const gestureFactory = (
    primaryCorner: CornerCordinates,
    secondaryHorizontalCorner: CornerCordinates,
    secondaryVerticalCorner: CornerCordinates,
  ) =>
    Gesture.Pan()
      .onBegin(() => {
        pressed.value = true;
      })
      .onChange((event) => {
        const verticalDistance =
          event.absoluteY - secondaryHorizontalCorner.y.value;
        const horizontalDistance =
          event.absoluteX - secondaryVerticalCorner.x.value;
        if (
          !isValidSquare.get() &&
          verticalDistance * event.translationY > 0 &&
          horizontalDistance * event.translationX > 0
        ) {
          return;
        }
        console.log(``);
        console.log("valid square");
        primaryCorner.x.value = event.absoluteX - handleHalfSize;
        primaryCorner.y.value = event.absoluteY - handleHalfSize;

        secondaryHorizontalCorner.x.value = event.absoluteX - handleHalfSize;
        secondaryVerticalCorner.y.value = event.absoluteY - handleHalfSize;
      })
      .onFinalize(() => {
        pressed.value = false;
      });

  return (
    <View style={styles.container}>
      <Canvas style={styles.container}>
        <Group clip={cropPath} invertClip>
          <Rect
            x={0}
            y={0}
            width={width}
            height={height}
            color="rgba(75,75,75,0.85)"
          />
        </Group>
      </Canvas>

      {(
        [
          [topLeft, bottomLeft, topRight, topLeftAnimatedStyle],
          [bottomLeft, topLeft, bottomRight, bottomLeftAnimatedStyle],
          [topRight, bottomRight, topLeft, topRightAnimatedStyle],
          [bottomRight, topRight, bottomLeft, bottomRightAnimatedStyle],
        ] as const
      ).map(
        (
          [
            primaryCorner,
            secondaryHorizontalCorner,
            secondaryVerticalCorner,
            cornerStyle,
          ],
          index,
        ) => (
          <GestureDetector
            key={index}
            gesture={gestureFactory(
              primaryCorner,
              secondaryHorizontalCorner,
              secondaryVerticalCorner,
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
