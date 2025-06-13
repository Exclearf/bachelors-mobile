import React, { useEffect, useMemo } from "react";
import { StyleSheet, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { colorKit } from "reanimated-color-picker";

import { useTheme } from "../../hooks/useTheme";

type Props = {
  style: ViewStyle | ViewStyle[];
};

const Skeleton = ({ style }: Props) => {
  const opacity = useSharedValue(0.5);
  const theme = useTheme();
  const color = useMemo(
    () => colorKit.RGB(theme?.mutedForeground ?? "#000000").array(),
    [theme],
  );
  useEffect(() => {
    opacity.set(withRepeat(withTiming(1, { duration: 2000 }), -1, true));
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    const currentOpacity = opacity.get();
    return {
      backgroundColor: `rgba(${color[0] * currentOpacity},${color[1] * currentOpacity},${color[2] * currentOpacity},1)`,
    };
  });

  return <Animated.View style={[styles.container, style, animatedStyle]} />;
};

export default Skeleton;

const styles = StyleSheet.create({ container: { borderRadius: 5 } });
