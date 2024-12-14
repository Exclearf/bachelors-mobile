import { StyleSheet, View } from "react-native";
import React from "react";
import SelectGroup, {
  SelectionGroupItemConfig,
} from "@/components/selectGroup/selectGroup";
import { randomUUID } from "expo-crypto";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import ExpandableModal from "@/components/modals/expandableModal";

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
    <View style={styles.container}>
      <SelectGroup items={availableFunctions} />
      <View style={styles.innerContainer}>
        <ExpandableModal
          initialHeight={200}
          initialWidth={200}
          containerStyle={styles.expandableModal}
        ></ExpandableModal>
      </View>
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
  innerContainer: {
    width: "100%",
    flex: 1,
    backgroundColor: "yellow",
  },
  expandableModal: {
    backgroundColor: "red",
    width: "100%",
  },
});
