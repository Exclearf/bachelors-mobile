import React, { useContext, useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { IconParameters } from "../camera/cameraOverlay";
import { useBottomSheet } from "@/hooks/useBottomSheet";
import { AppDimensionsContext } from "@/contexts/appDimensions";

type Props = {
  iconParameters: IconParameters;
  isVisible: boolean;
};

const CameraModal = ({ isVisible, iconParameters }: Props) => {
  const { width, height } = useContext(AppDimensionsContext);
  const openState = useSharedValue(0);
  const { bottomSheet } = useBottomSheet();

  useEffect(() => {
    openState.set(isVisible ? 1 : 0);
  }, [isVisible]);

  const animatedStyle = useAnimatedStyle(() => {
    const adjustedHeight =
      (height - (bottomSheet?.animatedPosition?.get() ?? 0)) / 4;

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
