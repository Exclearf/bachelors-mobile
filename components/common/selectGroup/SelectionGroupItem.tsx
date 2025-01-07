import {
  StyleSheet,
  TextStyle,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native";
import React from "react";
import TranslatedText from "../TranslatedText";

export type SelectionGroupItemProps = {
  translationKey: string;
  onClick: () => void;
  textStyle: TextStyle;
  itemStyle: ViewStyle;
  Icon: React.ReactNode;
};

const SelectionGroupItem = ({
  translationKey,
  onClick,
  itemStyle,
  textStyle,
  Icon,
}: SelectionGroupItemProps) => {
  return (
    <TouchableWithoutFeedback onPress={onClick}>
      <View style={[styles.container, itemStyle]}>
        {Icon}
        <TranslatedText style={textStyle} translationKey={translationKey} />
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
