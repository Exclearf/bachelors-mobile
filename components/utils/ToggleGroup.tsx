import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type Props = {
  items: ItemType[];
  onChange: (e: ItemType) => void;
};

type ItemType = {
  id: string;
  title: string;
};

const ToggleGroup = ({ items, onChange }: Props) => {
  const width = 300;
  const height = 30;
  const itemWidth = width / items.length;
  const activeIndex = useSharedValue(0);

  const switchActiveBackgroundPosition = useAnimatedStyle(() => {
    "worklet";
    return {
      left: itemWidth * activeIndex.value,
    };
  });

  const changeActiveIndex = (item: ItemType, index: number) => {
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
              <Text style={styles.itemText}>{item.title}</Text>
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
