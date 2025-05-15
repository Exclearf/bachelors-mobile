import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { ViewStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";

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
      <View style={[styles.itemContainer, itemStyle]}>
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
  itemContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
});
