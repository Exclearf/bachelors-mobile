import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import React, { useContext, useState } from "react";
import SelectionGroupItem from "./selectionGroupItem";
import { AppDimensionsContext } from "@/contexts/appDimensions";
import Animated from "react-native-reanimated";

export type SelectionGroupItemConfig = {
  id: string;
  title: string;
  onClick: () => void;
  icon: (props: any) => React.ReactNode;
};

type Props = {
  items: SelectionGroupItemConfig[];
};

const SelectGroup = ({ items }: Props) => {
  const { height } = useContext(AppDimensionsContext);
  const [chosen, setChosen] = useState(items?.[0]?.id);

  return (
    <Animated.View style={[styles.container, { height: height * 0.11 - 40 }]}>
      {items?.map((item) => (
        <SelectionGroupItem
          key={item.id}
          onClick={() => {
            item.onClick();
            setChosen(item.id);
          }}
          title={item.title}
          Icon={
            <item.icon
              color={item.id === chosen ? "#5289e3" : "white"}
              size={17}
            />
          }
          itemStyle={
            item.id === chosen
              ? (itemChosen as StyleProp<ViewStyle>)
              : styles.item
          }
          textStyle={
            item.id === chosen ? styles.itemTextChosen : styles.itemText
          }
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
    backgroundColor: "transparent",
    borderRadius: 20,
    paddingHorizontal: 30,
    paddingVertical: 7,
    borderColor: "grey",
    borderWidth: 1,
    height: 35,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  itemChosen: {
    borderColor: "rgba(100, 146, 222, 0.3)",
    color: "#5289e3",
    backgroundColor: "rgba(100, 146, 222, 0.3)",
  },
  itemText: {
    fontSize: 15,
    color: "white",
  },
  itemTextChosen: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#5c97f7",
  },
});

const itemChosen = StyleSheet.compose(styles.item, styles.itemChosen);
