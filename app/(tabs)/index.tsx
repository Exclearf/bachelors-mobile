import { View } from "react-native";
import React from "react";
import SelectGroup, {
  SelectionGroupItemConfig,
} from "@/components/selectGroup/selectGroup";
import { randomUUID } from "expo-crypto";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const availableFunctions: SelectionGroupItemConfig[] = [
  {
    id: randomUUID(),
    title: "Sign",
    onClick: () => {},
    icon: (props: any) => (
      <FontAwesome6 name="hands-asl-interpreting" {...props} />
    ),
  },
  {
    id: randomUUID(),
    title: "Text",
    onClick: () => {},
    icon: (props: any) => <Ionicons name="text" {...props} />,
  },
];

const IndexTab = () => {
  return (
    <View style={{ backgroundColor: "#1e1e1e", flex: 1 }}>
      <SelectGroup items={availableFunctions} />
    </View>
  );
};

export default IndexTab;
