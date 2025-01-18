import { StyleSheet, ViewStyle } from "react-native";
import React, { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { current } from "immer";

type Props = {
  style: ViewStyle;
};

const Skeleton = ({ style }: Props) => {
  const opacity = useSharedValue(0.75);

  useEffect(() => {
    opacity.set(withRepeat(withTiming(1, { duration: 1000 }), -1, true));
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const currentVal = 75 * opacity.get();
    return {
      backgroundColor: `rgba(${currentVal},${currentVal},${currentVal},1)`,
    };
  });

  return <Animated.View style={[styles.container, style, animatedStyle]} />;
};

export default Skeleton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(75,75,75,1)",
    borderRadius: 5,
  },
});
