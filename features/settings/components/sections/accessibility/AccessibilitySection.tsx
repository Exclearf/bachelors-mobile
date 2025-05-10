import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

import { useLocalization } from "@/features/shared/hooks/useLocalization";

import FontSizeSlider from "./items/FontSizeSlider";
import HighContrastSwitch from "./items/HighContrastSwitch";
import {
  SettingsSectionsItemType,
  SettingsSectionSubItemType,
} from "../../../SettingsSections";

export type AccessibilityItemProps = {
  containerStyle: ViewStyle;
} & SettingsSectionSubItemType;

type Props = SettingsSectionsItemType;

const AccessibilitySection = ({
  getTranslationKey,
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
            containerStyle={styles.accessibilityItemStyle}
          />
        </View>
      ))}
    </>
  );
};

export default AccessibilitySection;

const styles = StyleSheet.create({
  containerItem: { paddingVertical: 5 },
  accessibilityItemStyle: {
    alignItems: "center",
    justifyContent: "center",
  },
});
