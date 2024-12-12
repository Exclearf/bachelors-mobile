import { TouchableOpacity } from "react-native";
import React from "react";
import { CameraOverlayButtonProps } from "../cameraOverlay";
import {
  interpolate,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Canvas, Path } from "@shopify/react-native-skia";

const SettingsButton = ({ color, size, onClick }: CameraOverlayButtonProps) => {
  const openState = useSharedValue(0);

  // I really believe that the compiler would catch these
  const xLeft = size / 8;
  const xRight = size - size / 8;
  const xMid = (xLeft + xRight) / 2;

  const yTop = size / 3.35;
  const yBottom = size - size / 3.35;

  const animatedProps = useDerivedValue(() => {
    "worklet";
    const t = openState.get();

    const apexY = interpolate(t, [0, 1], [yBottom, yTop]);
    const leftY = interpolate(t, [0, 1], [yTop, yBottom]);
    const rightY = interpolate(t, [0, 1], [yTop, yBottom]);
    return `M ${xLeft},${leftY} L ${xMid},${apexY} L ${xRight},${rightY}`;
  });

  return (
    <TouchableOpacity
      onPress={() => {
        onClick?.();
        openState.set(withTiming(openState.get() ? 0 : 1, { duration: 200 }));
      }}
      activeOpacity={1}
    >
      <Canvas
        style={{
          width: size,
          height: size,
          flex: 1,
        }}
      >
        <Path
          color={color}
          strokeWidth={3}
          strokeJoin="round"
          strokeCap="round"
          style="stroke"
          path={animatedProps}
        ></Path>
      </Canvas>
    </TouchableOpacity>
  );
};

export default SettingsButton;
