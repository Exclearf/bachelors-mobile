import { TouchableOpacity } from "react-native";
import React from "react";
import Entypo from "@expo/vector-icons/Entypo";
import { CameraOverlayButtonProps } from "../cameraOverlay";
import {
  interpolate,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Canvas, Path, StrokeCap } from "@shopify/react-native-skia";

const FlashlightButton = ({
  color,
  size,
  onClick,
}: CameraOverlayButtonProps) => {
  const flashState = useSharedValue(1);

  const xLeft = 5;
  const xRight = size - 5;

  const yTop = size - 5;
  const yBottom = 5;

  const derivedPath = useDerivedValue(() => {
    "worklet";
    const x = interpolate(flashState.get(), [0, 1], [xLeft, xRight]);
    const y = interpolate(flashState.get(), [0, 1], [yBottom, yTop]);
    return `M ${xLeft} ${yBottom} L ${x} ${y}`;
  });

  const derivedStrokeCap = useDerivedValue(() => {
    return flashState.get() === 0 ? "butt" : "round";
  });

  return (
    <TouchableOpacity
      onPress={() => {
        onClick?.();
        flashState.set(
          withTiming(flashState.get() === 0 ? 1 : 0, { duration: 200 }),
        );
      }}
      activeOpacity={1}
    >
      <Canvas
        style={{
          width: size,
          height: size,
          position: "absolute",
        }}
      >
        <Path
          path={derivedPath}
          color={"white"}
          strokeWidth={3}
          strokeCap={derivedStrokeCap}
          style={"stroke"}
        />
      </Canvas>
      <Entypo name="flash" size={size} color={color} />
    </TouchableOpacity>
  );
};

export default FlashlightButton;
