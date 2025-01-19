import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native";
import React from "react";
import TranslatedText from "../../text/TranslatedText";

export type SelectionGroupItemProps = {
  translationKey: string;
  onClick: () => void;
  textStyle: StyleProp<TextStyle>;
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
        <TranslatedText
          style={textStyle as TextStyle}
          translationKey={translationKey}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SelectionGroupItem;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
});
