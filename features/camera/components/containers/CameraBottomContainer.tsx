import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  DerivedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

import { AppDimensionsContext } from "@/features/shared/contexts/appDimensions";
import { useBottomSheet } from "@/features/shared/hooks/useBottomSheet";

type Props = React.PropsWithChildren<{
  scale: DerivedValue<number>;
}>;

const CameraBottomContainer = ({ children, scale }: Props) => {
  const { bottomSheet } = useBottomSheet();
  const { height } = useContext(AppDimensionsContext);

  const bottomStyle = useAnimatedStyle(() => {
    "worklet";
    const newHeight = Math.min(
      height - (bottomSheet?.animatedPosition?.get() ?? 0),
      height * 0.51,
    );
    return {
      marginBottom: scale.get() * 30,
      bottom: newHeight,
    };
  });

  return (
    <Animated.View style={[bottomStyle, styles.container]}>
      {children}
    </Animated.View>
  );
};

export default CameraBottomContainer;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "absolute",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
  },
});
