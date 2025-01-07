import { StyleSheet, View } from "react-native";
import React from "react";
import ToggleGroup from "@/features/shared/components/input/ToggleGroup";

const items = [
  {
    id: "1",
    title: "Item 1",
  },
  {
    id: "2",
    title: "Item 2",
  },
  {
    id: "3",
    title: "Item 3",
  },
];

const SettingsContainer = () => {
  return (
    <View>
      <ToggleGroup
        selectedIndex={0}
        items={items}
        onChange={(e) => console.log(e.id)}
      />
    </View>
  );
};

export default SettingsContainer;

const styles = StyleSheet.create({});
