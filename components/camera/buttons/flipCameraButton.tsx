import { TouchableOpacity } from "react-native";
import React, { useRef } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { CameraOverlayButtonProps } from "../cameraOverlay";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const AnimatedIcon = Animated.createAnimatedComponent(MaterialIcons);

const FlipCameraButton = ({
  color,
  size,
  onClick,
}: CameraOverlayButtonProps) => {
  const isRotated = useRef(false);
  const rotation = useSharedValue(0);
  const style = useAnimatedStyle(() => ({
    transform: [
      {
        rotateZ: `${rotation.get()}deg`,
      },
    ],
  }));

  const switchRotation = (state: boolean) => {
    "worklet";
    rotation.set(withTiming(state ? 0 : 180, { duration: 200 }));
    return !state;
  };

  return (
    <TouchableOpacity
      onPress={() => {
        onClick!();
        isRotated.current = switchRotation(isRotated.current);
      }}
      activeOpacity={1}
    >
      <AnimatedIcon
        style={style}
        name="flip-camera-android"
        size={size}
        color={color}
      />
    </TouchableOpacity>
  );
};

export default FlipCameraButton;
