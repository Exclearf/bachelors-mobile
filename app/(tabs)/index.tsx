import { StyleSheet, View } from "react-native";
import React from "react";
import SelectGroup, {
  SelectionGroupItemConfig,
} from "@/components/common/selectGroup/SelectGroup";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import IndexScreen from "@/screens/index/IndexScreen";
import { useLocalization } from "@/hooks/useLocalization";

const IndexTab = () => {
  const getTranslationKey = useLocalization("indexPage");

  const availableFunctions: SelectionGroupItemConfig[] = [
    {
      id: "signToText",
      translationKey: getTranslationKey("signToText"),
      onClick: () => {},
      icon: (props: any) => (
        <FontAwesome6 name="hands-asl-interpreting" {...props} />
      ),
    },
    {
      id: "textToSign",
      translationKey: getTranslationKey("textToSign"),
      onClick: () => {},
      icon: (props: any) => <Ionicons name="text" {...props} />,
    },
  ];

  return (
    <View style={styles.container}>
      <SelectGroup items={availableFunctions} />
      <IndexScreen />
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
