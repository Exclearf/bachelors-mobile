import { StyleProp, Text, View, ViewStyle } from "react-native";
import React, { useContext, useRef } from "react";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { AppDimensionsContext } from "@/contexts/appDimensions";
import { useBottomSheet } from "@/hooks/useBottomSheet";

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
  const { bottomSheet } = useBottomSheet();

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
            height - (bottomSheet?.animatedPosition.get() ?? 0) - 100,
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
          <Text>Modal Text</Text>
        </TouchableWithoutFeedback>
      </View>
      <Text>Expanda1bleModal</Text>
    </Animated.View>
  );
};

export default ExpandableModal;
