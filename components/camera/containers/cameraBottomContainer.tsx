import { StyleSheet } from "react-native";
import React from "react";
import Animated, {
  DerivedValue,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

type Props = React.PropsWithChildren<{
  appHeight: number;
  scale: DerivedValue<number>;
  position?: SharedValue<number>;
}>;

const CameraBottomContainer = ({
  position,
  appHeight,
  children,
  scale,
}: Props) => {
  const bottomStyle = useAnimatedStyle(() => {
    "worklet";
    const newHeight = Math.min(
      appHeight - (position?.get() ?? 0) - 10,
      appHeight * 0.55,
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
