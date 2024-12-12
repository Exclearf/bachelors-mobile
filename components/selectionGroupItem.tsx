import { Text } from "react-native";
import React from "react";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

export type SelectionGroupItemProps = {
  title: string;
  onClick: () => void;
  style?: Readonly<Record<string, string>>;
};

const SelectionGroupItem = ({
  title,
  onClick,
  style,
}: SelectionGroupItemProps) => {
  return (
    <TouchableWithoutFeedback onPress={onClick} style={style}>
      <Text style={{ color: "white" }}>{title}</Text>
    </TouchableWithoutFeedback>
  );
};

export default SelectionGroupItem;
