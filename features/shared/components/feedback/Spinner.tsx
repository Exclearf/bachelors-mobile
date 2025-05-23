import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

type Props = {
  size: number;
  color: string;
};

const Spinner = ({ size, color }: Props) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.set(withRepeat(withTiming(360, { duration: 1000 }), -1, false));
  }, [rotation]);

  const animatedStyle = useAnimatedStyle(() => {
    return { transform: [{ rotate: `${rotation.value}deg` }] };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={animatedStyle}>
        <AntDesign name="loading2" size={size} color={color} />
      </Animated.View>
    </View>
  );
};

export default Spinner;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
});
