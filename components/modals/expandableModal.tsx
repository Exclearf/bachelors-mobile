import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import React, { useContext, useRef } from "react";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { AppDimensionsContext } from "@/contexts/appDimensions";
import { BottomSheetContext } from "@/contexts/bottomSheetContext";

type Props = {
  initialHeight: number;
  initialWidth: number;
  containerStyle: StyleProp<ViewStyle>;
};

const ExpandableModal = ({
  containerStyle,
  initialHeight,
  initialWidth,
}: Props) => {
  const expansionFactor = useSharedValue(0);
  const isExpanding = useRef(false);
  const { height, width } = useContext(AppDimensionsContext);
  const animatedPosition = useContext(BottomSheetContext);

  const animateStyle = useAnimatedStyle(() => {
    return {
      top: 0,
      zIndex: 10,
      width: interpolate(expansionFactor.get(), [0, 1], [initialWidth, width]),
      height: interpolate(
        expansionFactor.get(),
        [0, 1],
        [
          initialHeight,
          Math.max(
            height * 0.55 - 100,
            height - (animatedPosition?.animatedPosition.get() ?? 0) - 100,
          ),
        ],
      ),
    };
  });

  return (
    <Animated.View style={[containerStyle, animateStyle]}>
      <View style={containerStyle}>
        <TouchableWithoutFeedback
          style={containerStyle}
          onPress={() => {
            console.log(isExpanding.current);
            expansionFactor.set(withTiming(isExpanding.current ? 0 : 1));
            isExpanding.current = !isExpanding.current;
          }}
        >
          <Text>{animatedPosition?.animatedPosition.get()}</Text>
        </TouchableWithoutFeedback>
      </View>
      <Text>Expanda1bleModal</Text>
    </Animated.View>
  );
};

export default ExpandableModal;

const styles = StyleSheet.create({
  testStyle: {
    width: 100,
    height: 100,
    position: "absolute",
    backgroundColor: "rgba(255,255,255,0.5)",
  },
});
