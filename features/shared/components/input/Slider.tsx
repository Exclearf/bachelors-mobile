import React from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useTheme } from "../../hooks/useTheme";

type Props = {
  width: number;
  initialValue: number;
  totalSteps: number;
  height?: number;
  onChangeHandler: (sliderIndex: number) => void;
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
  const thumbPosition = useSharedValue(Math.round(initialValue * stepSize));
  const thumbSize = useSharedValue(height * 4);
  const theme = useTheme();

  const onGestureEnd = () => {
    //TODO: Rewrite logic to be precise
    onChangeHandler(Math.round((thumbPosition.get() - height * 2) / stepSize));
  };

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
      runOnJS(onGestureEnd)();
    });

  const tapGesture = Gesture.Tap()
    .onBegin((e) => {
      "worklet";
      if (e.x < 0 || e.x >= width - height) {
        return;
      }

      thumbPosition.set(e.x);
    })
    .onEnd(() => {
      "worklet";
      thumbSize.set(withTiming(height * 4, { duration: 200 }));
      runOnJS(onGestureEnd)();
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

  const composed = Gesture.Race(tapGesture, panGesture);

  return (
    <GestureDetector gesture={composed}>
      <View
        style={[
          styles.container,
          {
            width: trackWidth,
            height: height * 4,
          },
        ]}
      >
        <View
          style={[
            styles.track,
            {
              backgroundColor: theme?.mutedForeground,
              height,
            },
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
