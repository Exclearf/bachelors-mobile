import React, { useEffect } from "react";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { IconParameters } from "../camera/cameraOverlay";

type Props = {
  height: number;
  width: number;
  iconParameters: IconParameters;
  isVisible: boolean;
  animatedPosition?: SharedValue<number>;
};

const CameraModal = ({
  height,
  width,
  isVisible,
  animatedPosition,
  iconParameters,
}: Props) => {
  const openState = useSharedValue(0);

  useEffect(() => {
    openState.set(isVisible ? 1 : 0);
  }, [isVisible]);

  const animatedStyle = useAnimatedStyle(() => {
    const adjustedHeight = (height - (animatedPosition?.get() ?? 0)) / 4;

    const targetHeight = 300 - Math.min(adjustedHeight, 125);
    return {
      height: targetHeight,
      opacity: withSpring(openState.get(), {
        duration: 150,
      }),
    };
  });

  const staticStyle = {
    top: iconParameters.size * 1.5,
    left: 15,
    width: width - 30,
    backgroundColor: "rgba(50,50,50,0.90)",
    position: "absolute",
    borderRadius: 10,
  };

  return (
    withSpring(openState.get()) && (
      //@ts-expect-error TODO: We know that the style is correct
      <Animated.View style={[animatedStyle, staticStyle]} />
    )
  );
};

export default CameraModal;
