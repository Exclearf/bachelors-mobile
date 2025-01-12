import { StyleSheet, View } from "react-native";
import React from "react";
import { SettingsSectionsItemType } from "../../../SettingsSections";
import { useLocalization } from "@/features/shared/hooks/useLocalization";
import HighContrastSwitch from "./items/HighContrastSwitch";
import FontSizeSlider from "./items/FontSizeSlider";

type Props = {} & SettingsSectionsItemType;

const AccessibilitySection = ({
  getTranslationKey,
  width,
  style,
  textStyle,
}: Props) => {
  getTranslationKey = useLocalization(
    getTranslationKey("accessibilitySection"),
  );
  const items = [HighContrastSwitch, FontSizeSlider];

  return (
    <>
      {items.map((Item, index) => (
        <View style={[style, styles.containerItem]} key={index}>
          <Item
            getTranslationKey={getTranslationKey}
            textStyle={textStyle}
            width={width}
          />
        </View>
      ))}
    </>
  );
};

export default AccessibilitySection;

const styles = StyleSheet.create({
  containerItem: {
    paddingVertical: 5,
  },
});
