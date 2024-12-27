import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import React, { useState } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type Props = {};

const items = [
  {
    id: 123,
    title: "Item 1",
  },
  {
    id: 124,
    title: "Item 2",
  },
  {
    id: 125,
    title: "Item 3",
  },
];

const SettingsPanel = ({}: Props) => {
  const width = 300;
  const height = 30;
  const itemWidth = width / items.length;
  const activeIndex = useSharedValue(0);
  const [activeId, setActiveId] = useState(items[0].id);

  const switchActiveBackgroundPosition = useAnimatedStyle(() => {
    "worklet";
    return {
      left: itemWidth * activeIndex.value,
    };
  });

  const changeActiveIndex = (id: number, index: number) => {
    "worklet";
    setActiveId(id);
    activeIndex.set(withTiming(index));
  };

  return (
    <View style={[{ width, height, backgroundColor: "grey" }]}>
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
            <View
              style={{
                width: itemWidth,
                height: height - height / 4,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: height / 8,
                backgroundColor: "green",
              }}
              key={item.id}
            >
              <TouchableWithoutFeedback
                style={{ backgroundColor: "green" }}
                onPress={() => changeActiveIndex(item.id, index)}
              >
                <Text>{item.title}</Text>
              </TouchableWithoutFeedback>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "grey",
  },
  switchContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  activeBackground: {
    position: "absolute",
    backgroundColor: "red",
    height: "100%",
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

export default SettingsPanel;
