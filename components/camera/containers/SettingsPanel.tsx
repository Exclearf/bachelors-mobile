import { StyleSheet, View } from "react-native";
import React from "react";
import ToggleGroup from "@/components/common/ToggleGroup";

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

const SettingsPanel = () => {
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

export default SettingsPanel;

const styles = StyleSheet.create({});
