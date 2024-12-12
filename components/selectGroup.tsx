import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import SelectionGroupItem, {
  SelectionGroupItemProps,
} from "./selectionGroupItem";

export type SelectionGroupItemConfig = {
  id: string;
  title: string;
  onClick: () => void;
} & SelectionGroupItemProps;

type Props = {
  items: SelectionGroupItemConfig[];
};

const SelectGroup = ({ items }: Props) => {
  const [chosen, setChosen] = useState(items?.[0]?.id);

  return (
    <View style={styles.container}>
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
    </View>
  );
};

export default SelectGroup;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    height: 40,
  },
  item: {
    backgroundColor: "#3e3e3e",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 5,
    textAlign: "center",
    borderColor: "grey",
    borderWidth: 1,
  },
  itemChosen: {
    backgroundColor: "#577B8D",
  },
});
const itemChosen = StyleSheet.compose(styles.item, styles.itemChosen);
