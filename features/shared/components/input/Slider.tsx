import { clamp } from "@shopify/react-native-skia";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useTheme } from "../../hooks/useTheme";

type Props = {
  width: number;
  value: SharedValue<number>;
  totalSteps: number;
  height?: number;
  onChangeHandler?: (sliderIndex: number) => void;
};

const Slider = ({
  width = 100,
  height = 7,
  value,
  totalSteps,
  onChangeHandler,
}: Props) => {
  const trackWidth = width;
  const availableThumbWidth = width - height * 4;
  const stepSize = availableThumbWidth / totalSteps;
  const thumbPosition = useDerivedValue(() =>
    Math.round(value.get() * stepSize),
  );
  const thumbSize = height * 4;
  const radiusMultiplier = useSharedValue(1.0);
  const theme = useTheme();

  const onGestureEnd = () => {
    onChangeHandler?.(Math.round(thumbPosition.get() / stepSize));
  };

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      "worklet";
      radiusMultiplier.set(withTiming(1.1, { duration: 100 }));
    })
    .onChange((e) => {
      "worklet";
      if (e.x <= 0 || e.x > availableThumbWidth + thumbSize) {
        return;
      }

      value.set(
        clamp(
          Math.round((e.x - thumbSize / 2) / stepSize),
          0,
          availableThumbWidth / stepSize,
        ),
      );
    })
    .onEnd(() => {
      "worklet";
      radiusMultiplier.set(withTiming(1, { duration: 100 }));
      runOnJS(onGestureEnd)();
    });

  const tapGesture = Gesture.Tap()
    .onBegin((e) => {
      "worklet";
      radiusMultiplier.set(withTiming(1.1, { duration: 100 }));

      if (e.x < 0 || e.x >= availableThumbWidth + thumbSize) {
        return;
      }

      thumbPosition.set(
        clamp(
          Math.round((e.x - thumbSize / 2) / stepSize - 0.1) * stepSize,
          0,
          availableThumbWidth,
        ),
      );
    })
    .onEnd(() => {
      "worklet";
      radiusMultiplier.set(withTiming(1, { duration: 100 }));

      runOnJS(onGestureEnd)();
    });

  const thumbStyle = useAnimatedStyle(() => {
    return {
      left:
        thumbPosition.get() -
        (thumbSize * Math.abs(1 - radiusMultiplier.get())) / 2,
      width: thumbSize * radiusMultiplier.get(),
      height: thumbSize * radiusMultiplier.get(),
      borderRadius: (thumbSize / 2) * radiusMultiplier.get(),
      top: (-thumbSize / 2 + height / 2) * radiusMultiplier.get(),
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
                backgroundColor: theme?.surfaceForeground,
                boxShadow: `0px 0px 5px ${theme?.surfaceBackground}`,
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
