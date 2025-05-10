import React from "react";
import { StyleSheet } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated, { SharedValue } from "react-native-reanimated";

import useCornerAnimatedStyle from "../../hooks/useAnimatedStyleCorner";
import useCornerGesture from "../../hooks/useGestureFactory";
import { CornerCoordinates } from "../../misc/types";

export interface CornerHandleConfig {
  primaryCorner: CornerCoordinates;
  secondaryHorizontalCorner: CornerCoordinates;
  secondaryVerticalCorner: CornerCoordinates;
  topOffset: number;
  leftOffset: number;
  clamp: (point: [number, number]) => [number, number];
  xOffset: number;
  yOffset: number;
  cornerOpacity: SharedValue<number>;
}

const CornerGestureHandle = ({
  primaryCorner,
  secondaryHorizontalCorner,
  secondaryVerticalCorner,
  topOffset,
  leftOffset,
  clamp,
  xOffset,
  yOffset,
  cornerOpacity,
}: CornerHandleConfig) => {
  const animatedStyle = useCornerAnimatedStyle(
    primaryCorner,
    topOffset,
    leftOffset,
  );

  const gesture = useCornerGesture(
    primaryCorner,
    secondaryHorizontalCorner,
    secondaryVerticalCorner,
    clamp,
    xOffset,
    yOffset,
    cornerOpacity,
  );

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[styles.panResponder, styles.panResponderCorner, animatedStyle]}
      />
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  panResponder: {
    zIndex: 2,
    position: "absolute",
  },
  panResponderCorner: {
    width: 60,
    height: 60,
  },
});

export default CornerGestureHandle;
