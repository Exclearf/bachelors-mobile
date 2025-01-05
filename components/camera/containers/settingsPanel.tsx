import { StyleSheet, Text, View } from "react-native";
import React from "react";
import ToggleGroup from "@/components/utils/ToggleGroup";

type Props = {};

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

const SettingsPanel = (props: Props) => {
  return (
    <View>
      <ToggleGroup items={items} onChange={(e) => console.log(e.id)} />
    </View>
  );
};

export default SettingsPanel;

const styles = StyleSheet.create({});
