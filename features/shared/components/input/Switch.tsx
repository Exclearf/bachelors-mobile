import { Pressable, StyleProp, StyleSheet, TextStyle } from "react-native";
import React from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolateColor,
  Easing,
  AnimatedStyle,
} from "react-native-reanimated";

type SwitchColor = {
  false: string;
  true: string;
};

type SwitchDisabledColor = {
  thumb: string;
  track: string;
};

type CustomSwitchThumbProps = {
  size: number;

  style: StyleProp<AnimatedStyle<StyleProp<TextStyle>>>;
};

type CustomSwitchThumb = ({
  size,
  style,
}: CustomSwitchThumbProps) => React.ReactNode;

type Props = {
  checked: boolean;
  setChecked:
    | React.Dispatch<React.SetStateAction<boolean>>
    | ((newState: boolean) => void);
  diameter: number;
  isDisabled?: boolean;
  CustomFalseThumb?: CustomSwitchThumb;
  CustomTrueThumb?: CustomSwitchThumb;
  thumbColor?: SwitchColor;
  trackColor?: SwitchColor;
  disabledColor?: SwitchDisabledColor;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const padding = 2;

// TODO: Make the component and replace the switch in the settings
// Required features:
// 11) Custom thumb
const Switch = ({
  checked,
  setChecked,
  diameter,
  isDisabled = false,
  CustomFalseThumb,
  CustomTrueThumb,
  thumbColor = {
    false: "rgba(145,145,145,1)",
    true: "rgba(230,230,230,1)",
  },
  trackColor = {
    false: "rgba(70,70,70,1)",
    true: "rgba(115,115,115,1)",
  },
  disabledColor = {
    thumb: "rgba(255,255,255,0.3)",
    track: "rgba(125,125,125,0.15)",
  },
}: Props) => {
  const isChecked = useSharedValue(checked ? 0 : 1);

  const thumbAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: isChecked.value * (diameter - padding * 2) }],
      backgroundColor: interpolateColor(
        isChecked.get(),
        [0, 1],
        [thumbColor.false, thumbColor.true],
      ),
    };
  });

  const trackAnimatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        isChecked.get(),
        [0, 1],
        [trackColor.false, trackColor.true],
      ),
    };
  });

  const handleToggle = () => {
    if (isDisabled) return;

    isChecked.set(
      withTiming(isChecked.value === 0 ? 1 : 0, {
        duration: 150,
        easing: Easing.inOut(Easing.quad),
      }),
    );
    setChecked(!checked);
  };

  const customFalseThumbStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        isChecked.get(),
        [0, 1],
        [thumbColor.true, "transparent"],
      ),
    };
  });

  const customTrueThumbStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        isChecked.get(),
        [0, 1],
        ["transparent", thumbColor.true],
      ),
    };
  });

  return (
    <AnimatedPressable
      style={[
        isDisabled
          ? { backgroundColor: disabledColor.track }
          : trackAnimatedStyle,
        styles.trackContainer,
        {
          width: diameter * 2,
          height: diameter + 4,
          borderRadius: diameter / 2 + padding * 2,
        },
      ]}
      onPress={handleToggle}
    >
      {CustomTrueThumb && (
        <CustomTrueThumb
          size={diameter - diameter / 3}
          style={[
            customTrueThumbStyle,
            styles.customThumb,
            {
              left: diameter / 6,
              top: diameter / 5,
            },
          ]}
        />
      )}
      <AnimatedPressable
        onPress={handleToggle}
        style={[
          isDisabled
            ? { backgroundColor: disabledColor.thumb }
            : thumbAnimatedStyle,
          {
            width: diameter,
            height: diameter,
            borderRadius: diameter / 2,
          },
        ]}
      />
      {CustomFalseThumb && (
        <CustomFalseThumb
          size={diameter - diameter / 3}
          style={[
            customFalseThumbStyle,
            styles.customThumb,
            {
              right: diameter / 6,
              top: diameter / 5,
            },
          ]}
        />
      )}
    </AnimatedPressable>
  );
};

export default Switch;

const styles = StyleSheet.create({
  trackContainer: {
    padding,
  },
  customThumb: {
    position: "absolute",
  },
});
