import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import React, { PropsWithChildren, useContext, useRef } from "react";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { AppDimensionsContext } from "@/contexts/appDimensions";
import { useBottomSheet } from "@/hooks/useBottomSheet";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import CollapseAnimated from "../utils/CollapseAnimated";

type Props = PropsWithChildren<{
  initialHeight: number;
  padding: number;
  containerStyle: StyleProp<ViewStyle>;
}>;

const ExpandableModal = ({
  containerStyle,
  initialHeight,
  padding,
  children,
}: Props) => {
  const expansionFactor = useSharedValue(0);
  const isExpanding = useRef(false);
  const { height, width } = useContext(AppDimensionsContext);
  const { bottomSheet } = useBottomSheet();
  const iconPadding = 10;

  const animateStyle = useAnimatedStyle(() => {
    return {
      top: interpolate(expansionFactor.get(), [0, 1], [padding, padding / 2]),
      position: "absolute",
      zIndex: 10,
      width: interpolate(
        expansionFactor.get(),
        [0, 1],
        [width - padding * 2, width - padding],
      ),
      height: interpolate(
        expansionFactor.get(),
        [0, 1],
        [
          initialHeight,
          Math.max(
            height * 0.55 - height * 0.11 - 36,
            height -
              (bottomSheet?.animatedPosition.get() ?? 0) -
              height * 0.2 -
              padding / 2,
          ),
        ],
      ),
    };
  });

  return (
    <Animated.View style={[containerStyle, animateStyle]}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Translation</Text>
        <TouchableWithoutFeedback
          onPress={() => {
            expansionFactor.set(withTiming(isExpanding.current ? 0 : 1));
            isExpanding.current = !isExpanding.current;
          }}
          style={{
            position: "absolute",
            right: -10,
            top: -15,
            padding: 20,
          }}
        >
          <CollapseAnimated
            value={expansionFactor}
            // Adjust for visual simetry
            canvasStyle={{ top: -5, right: -5 }}
            color="white"
            size={24}
          />
        </TouchableWithoutFeedback>
      </View>
      {children}
    </Animated.View>
  );
};

export default ExpandableModal;

const styles = StyleSheet.create({
  header: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerText: {
    paddingLeft: 10,
    color: "white",
    fontSize: 18,
    fontWeight: 400,
  },
});
