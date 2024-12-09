import { StyleSheet, Text, View } from "react-native";
import React from "react";
import SelectGroup, {
  SelectionGroupItemConfig,
} from "@/components/selectGroup";
import TranslationBlob from "@/components/translationBlob";

import { randomUUID } from "expo-crypto";

type Props = {};

const availableFunctions: SelectionGroupItemConfig = [
  {
    id: randomUUID(),
    title: "Signs",
    onClick: () => {},
  },
  {
    id: randomUUID(),
    title: "Text",
    onClick: () => {},
  },
];

const IndexTab = (props: Props) => {
  return (
    <View style={{ backgroundColor: "#1e1e1e", flex: 1 }}>
      <SelectGroup items={availableFunctions} />
      <TranslationBlob />
    </View>
  );
};

export default IndexTab;

const styles = StyleSheet.create({});
