import { StyleSheet, View } from "react-native";
import React from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { usePersonalizationStore } from "@/features/settings/stores/personalizationStore";

type Props = {
  width: number;
  initialValue: number;
  totalSteps: number;
  height?: number;
  onChangeHandler: (sliderValue: number, sliderStep: number) => void;
};

// TODO: Fix coordinates (they are not animated depending on the size)
const Slider = ({
  width = 100,
  height = 7,
  initialValue,
  totalSteps,
  onChangeHandler,
}: Props) => {
  const trackWidth = width;
  const availableThumbWidth = width - height * 4;
  const stepSize = availableThumbWidth / totalSteps;
  const thumbPosition = useSharedValue(
    Math.round((availableThumbWidth * initialValue) / stepSize),
  );
  const thumbSize = useSharedValue(height * 4);
  const theme = usePersonalizationStore((state) => state.theme);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      "worklet";
      thumbSize.set(withTiming(height * 5, { duration: 100 }));
    })
    .onChange((e) => {
      "worklet";
      if (e.x < 0 || e.x > availableThumbWidth) {
        return;
      }

      thumbPosition.set(e.x);
    })
    .onEnd(() => {
      "worklet";
      thumbSize.set(withTiming(height * 4, { duration: 200 }));
    });

  const tapGesture = Gesture.Tap().onStart((e) => {
    "worklet";
    if (e.x < 0 || e.x > width - height * 4) {
      return;
    }

    thumbPosition.set(e.x);
  });

  const thumbStyle = useAnimatedStyle(() => {
    const thumbSizeValue = thumbSize.get();
    const newValue = Math.round(thumbPosition.get() / stepSize) * stepSize;
    return {
      left: newValue,
      width: thumbSizeValue,
      height: thumbSizeValue,
      borderRadius: thumbSizeValue / 2,
      top: -thumbSizeValue / 2 + height / 2,
    };
  });

  const composed = Gesture.Exclusive(panGesture, tapGesture);

  return (
    <GestureDetector gesture={composed}>
      <View
        style={[styles.container, { width: trackWidth, height: height * 4 }]}
      >
        <View
          style={[
            styles.track,
            { backgroundColor: theme?.mutedForeground, height },
          ]}
        >
          <Animated.View
            style={[
              thumbStyle,
              {
                backgroundColor: theme?.primaryForeground,
                boxShadow: `0px 0px 5px ${theme?.primaryBackground}`,
              },
            ]}
          />
        </View>
      </View>
    </GestureDetector>
  );
};

export default Slider;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  track: {
    width: "100%",
    height: "100%",
    borderRadius: 2,
  },
});
