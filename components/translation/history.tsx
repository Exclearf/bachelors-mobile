import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import React, { useContext } from "react";
import { useBottomSheet } from "@/hooks/useBottomSheet";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { AppDimensionsContext } from "@/contexts/appDimensions";

type Props = {
  padding: number;
  containerStyle: StyleProp<ViewStyle>[];
};

const History = ({ padding, containerStyle }: Props) => {
  const sheet = useBottomSheet();
  const { height, width } = useContext(AppDimensionsContext);

  const style = useAnimatedStyle(() => {
    return {
      position: "absolute",
      top: height * 0.55 - height * 0.11 + 3,
      height: height * 0.55 - height * 0.2,
      width: width - padding * 2,
    };
  });

  return (
    <Animated.View style={[...containerStyle, style]}>
      <Text>History</Text>
    </Animated.View>
  );
};

export default History;
