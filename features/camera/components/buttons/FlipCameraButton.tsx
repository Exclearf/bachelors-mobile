import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useRef } from "react";
import { Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { CameraOverlayButtonProps } from "../../CameraOverlay";

const FlipCameraButton = ({
  color,
  size,
  onClick,
}: CameraOverlayButtonProps) => {
  const isRotated = useRef(false);
  const rotation = useSharedValue(0);
  const style = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${rotation.get()}deg` }],
  }));

  const switchRotation = (state: boolean) => {
    "worklet";
    rotation.set(withTiming(state ? 0 : 180, { duration: 200 }));
    return !state;
  };

  return (
    <Animated.View style={style}>
      <Pressable
        onPress={() => {
          onClick!();
          isRotated.current = switchRotation(isRotated.current);
        }}
      >
        <MaterialIcons name="flip-camera-android" size={size} color={color} />
      </Pressable>
    </Animated.View>
  );
};

export default FlipCameraButton;
