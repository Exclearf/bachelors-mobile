import { StyleSheet, View } from "react-native";
import React from "react";
import SelectGroup, {
  SelectionGroupItemConfig,
} from "@/components/selectGroup/selectGroup";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import IndexPage from "@/pages/indexPage";

const availableFunctions: SelectionGroupItemConfig[] = [
  {
    id: "signToText",
    title: "Sign",
    onClick: () => {},
    icon: (props: any) => (
      <FontAwesome6 name="hands-asl-interpreting" {...props} />
    ),
  },
  {
    id: "textToSign",
    title: "Text",
    onClick: () => {},
    icon: (props: any) => <Ionicons name="text" {...props} />,
  },
];

const IndexTab = () => {
  return (
    <View style={styles.container}>
      <SelectGroup items={availableFunctions} />
      <IndexPage />
    </View>
  );
};

export default IndexTab;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1e1e1e",
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
