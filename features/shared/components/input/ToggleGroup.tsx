import { Pressable, StyleSheet, View } from "react-native";
import React from "react";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import TranslatedText from "../text/TranslatedText";
import { useTheme } from "../../hooks/useTheme";

type Props = {
  items: ToggleItemType[];
  onChange: (e: ToggleItemType) => void;
  selectedIndex: number;
  width?: number;
  height?: number;
  changeWhenAnimationEnds?: boolean;
  changeWhenAnimationEndsOffset?: number;
};

export type ToggleItemType = {
  id: string;
  title: string;
};

const animationDuration = 150;

const ToggleGroup = ({
  items,
  onChange,
  selectedIndex,
  width,
  height,
  changeWhenAnimationEnds,
  changeWhenAnimationEndsOffset = 35,
}: Props) => {
  width = width ?? 300;
  height = height ?? 30;
  const itemWidth = width / items.length;
  const activeIndex = useSharedValue(selectedIndex);

  const switchActiveBackgroundPosition = useAnimatedStyle(() => {
    "worklet";
    return {
      left: itemWidth * activeIndex.value,
    };
  });

  const clickHandler = (item: ToggleItemType) => {
    const handler = () => onChange(item);
    changeWhenAnimationEnds
      ? setTimeout(
          handler,
          animationDuration - (changeWhenAnimationEndsOffset ?? 0),
        )
      : handler();
  };

  const changeActiveIndex = (item: ToggleItemType, index: number) => {
    "worklet";
    activeIndex.set(withTiming(index, { duration: animationDuration }));
    runOnJS(clickHandler)(item);
  };

  const theme = useTheme();

  styles.activeBackground = {
    ...styles.activeBackground,
    backgroundColor: theme?.primaryBackground!,
  };

  return (
    <View
      style={[
        {
          borderRadius: 5,
          width,
          height: height,
          backgroundColor: theme?.secondaryBackground,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.activeBackground,
          {
            width: itemWidth,
            height: height,
            zIndex: 1,
            borderColor: theme?.secondaryForeground,
          },
          switchActiveBackgroundPosition,
        ]}
      />
      <View
        style={[
          styles.switchContainer,
          { height, borderColor: theme?.mutedForeground },
        ]}
      >
        {items.map((item, index) => {
          return (
            <Pressable
              style={[
                styles.toggleGroupItem,
                {
                  width: itemWidth,
                  height: height,
                  padding: height / 8,
                  zIndex: 2,
                },
              ]}
              key={item.id}
              onPress={() => changeActiveIndex(item, index)}
            >
              <TranslatedText
                style={[styles.itemText, { color: theme?.primaryForeground }]}
                translationKey={item.title}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    flex: 1,
    flexDirection: "row",
    borderRadius: 5,
    borderWidth: 1,
    justifyContent: "space-around",
    alignItems: "center",
  },
  activeBackground: {
    position: "absolute",
    borderRadius: 5,
    borderWidth: 1,
    height: "100%",
    backgroundColor: "grey",
  },
  toggleGroupItem: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  itemContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  itemText: {
    position: "relative",
    color: "white",
  },
});

export default ToggleGroup;
