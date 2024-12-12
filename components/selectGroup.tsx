import { StyleSheet, View } from "react-native";
import React, { useContext, useState } from "react";
import SelectionGroupItem, {
  SelectionGroupItemProps,
} from "./selectionGroupItem";
import { AppDimensionsContext } from "@/contexts/appDimensions";
import { BottomSheetContext } from "@/contexts/bottomSheetContext";
import { AnimatedView } from "react-native-reanimated/lib/typescript/component/View";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

export type SelectionGroupItemConfig = {
  id: string;
  title: string;
  onClick: () => void;
} & SelectionGroupItemProps;

type Props = {
  items: SelectionGroupItemConfig[];
};

const SelectGroup = ({ items }: Props) => {
  const { height } = useContext(AppDimensionsContext);
  const [chosen, setChosen] = useState(items?.[0]?.id);

  return (
    <Animated.View style={[styles.container, { height: height * 0.13 - 36 }]}>
      {items?.map((item) => (
        <SelectionGroupItem
          key={item.id}
          onClick={() => {
            item.onClick();
            setChosen(item.id);
          }}
          title={item.title}
          //@ts-expect-error  TODO: Fix the style prop
          style={item.id === chosen ? itemChosen : styles.item}
        />
      ))}
    </Animated.View>
  );
};

export default SelectGroup;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
  },
  item: {
    backgroundColor: "#3e3e3e",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderColor: "grey",
    borderWidth: 1,
    height: 35,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  itemChosen: {
    backgroundColor: "#577B8D",
  },
});
const itemChosen = StyleSheet.compose(styles.item, styles.itemChosen);
