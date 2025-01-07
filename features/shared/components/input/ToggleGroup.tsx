import { Pressable, StyleSheet, View } from "react-native";
import React from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import TranslatedText from "../text/TranslatedText";

type Props = {
  items: ToggleItemType[];
  onChange: (e: ToggleItemType) => void;
  selectedIndex: number;
  width?: number;
  height?: number;
};

export type ToggleItemType = {
  id: string;
  title: string;
};

const ToggleGroup = ({
  items,
  onChange,
  selectedIndex,
  width,
  height,
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

  const changeActiveIndex = (item: ToggleItemType, index: number) => {
    "worklet";
    activeIndex.set(withTiming(index));
    onChange(item);
  };

  return (
    <View
      style={[
        {
          borderRadius: 5,
          width,
          height,
          backgroundColor: "rgba(75,75,75,0.5)",
        },
      ]}
    >
      <Animated.View
        style={[
          styles.activeBackground,
          {
            width: itemWidth,
          },
          switchActiveBackgroundPosition,
        ]}
      />
      <View style={[styles.switchContainer, { height }]}>
        {items.map((item, index) => {
          return (
            <Pressable
              style={[
                styles.toggleGroupItem,
                {
                  width: itemWidth,
                  height: height,
                  padding: height / 8,
                },
              ]}
              key={item.id}
              onPress={() => changeActiveIndex(item, index)}
            >
              <TranslatedText
                style={styles.itemText}
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
    borderColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    justifyContent: "space-around",
    alignItems: "center",
  },
  activeBackground: {
    position: "absolute",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    backgroundColor: "rgba(255,255,255,0.1)",
    height: "100%",
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
    zIndex: 1,
  },
  itemText: {
    color: "white",
  },
});

export default ToggleGroup;
