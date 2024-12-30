import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import React, { useContext } from "react";
import { useBottomSheet } from "@/hooks/useBottomSheet";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { AppDimensionsContext } from "@/contexts/appDimensions";
import { useTranslationStore } from "@/stores/translationStore";
import { LinearGradient } from "expo-linear-gradient";
type Props = {
  padding: number;
  containerStyle: StyleProp<ViewStyle>[];
};

const History = ({ padding, containerStyle }: Props) => {
  const sheet = useBottomSheet();
  const { height, width } = useContext(AppDimensionsContext);
  const mode = useTranslationStore((state) => state.mode);

  const style = useAnimatedStyle(() => {
    return {
      position: "absolute",
      top: height * 0.55 - height * 0.11 + 3,
      height: height * 0.55 - height * 0.2,
      width: width - padding * 2,
    };
  });

  return (
    <Animated.View style={[...containerStyle, style, styles.container]}>
      <LinearGradient
        colors={["rgba(75,75,75,1)", "rgba(75,75,75,0.1)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      >
        <Text>{mode === "textToSign" ? "Text History" : "Sign History"}</Text>
      </LinearGradient>
    </Animated.View>
  );
};

export default History;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    overflow: "hidden",
  },
});
