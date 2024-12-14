import { StyleSheet } from "react-native";
import React, { useContext, useEffect } from "react";
import Animated, {
  DerivedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useBottomSheet } from "@/hooks/useBottomSheet";
import { AppDimensionsContext } from "@/contexts/appDimensions";

type Props = React.PropsWithChildren<{
  scale: DerivedValue<number>;
}>;

const CameraBottomContainer = ({ children, scale }: Props) => {
  const { bottomSheet } = useBottomSheet();
  const { height } = useContext(AppDimensionsContext);

  useEffect(() => {
    console.log(`BottomSheet ${bottomSheet}`);
  }, []);

  const bottomStyle = useAnimatedStyle(() => {
    "worklet";
    const newHeight = Math.min(
      height - (bottomSheet?.animatedPosition?.get() ?? 0) - 10,
      height * 0.55,
    );
    return {
      marginBottom: scale.get() * 24,
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
