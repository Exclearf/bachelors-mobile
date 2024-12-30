import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import AntDesign from "@expo/vector-icons/AntDesign";

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
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
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
    top: 5,
    bottom: 0,
    left: 5,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
});
