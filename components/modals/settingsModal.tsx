import React, { PropsWithChildren, useContext, useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { IconParameters } from "../camera/cameraOverlay";
import { useBottomSheet } from "@/hooks/useBottomSheet";
import { AppDimensionsContext } from "@/contexts/appDimensions";
import { ViewStyle } from "react-native";

type Props = PropsWithChildren<{
  iconParameters: IconParameters;
  isVisible: boolean;
}>;

const CameraModal = ({ isVisible, iconParameters, children }: Props) => {
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
  } as ViewStyle;

  return (
    withSpring(openState.get()) && (
      <Animated.View style={[animatedStyle, staticStyle]}>
        {children}
      </Animated.View>
    )
  );
};

export default CameraModal;
