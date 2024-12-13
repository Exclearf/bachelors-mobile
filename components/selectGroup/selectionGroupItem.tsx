import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native";
import React from "react";

export type SelectionGroupItemProps = {
  title: string;
  onClick: () => void;
  textStyle: StyleProp<TextStyle>;
  itemStyle: StyleProp<ViewStyle>;
  Icon: React.ReactNode;
};

const SelectionGroupItem = ({
  title,
  onClick,
  itemStyle,
  textStyle,
  Icon,
}: SelectionGroupItemProps) => {
  return (
    <TouchableWithoutFeedback onPress={onClick}>
      <View style={[styles.container, itemStyle]}>
        {Icon}
        <Text style={textStyle}>{title}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SelectionGroupItem;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    gap: 5,
    justifyContent: "space-around",
    alignItems: "baseline",
    flexDirection: "row",
  },
});
