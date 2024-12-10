import { StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
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
  const rotation = useSharedValue(0);

  const style = useAnimatedStyle(() => ({
    transform: [
      {
        rotateZ: `${rotation.get()}deg`,
      },
    ],
  }));

  return (
    <TouchableOpacity
      onPress={() => {
        onClick?.();
        rotation.set(
          withTiming((rotation.get() + 180) % 360, { duration: 200 }),
        );
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

const styles = StyleSheet.create({});
