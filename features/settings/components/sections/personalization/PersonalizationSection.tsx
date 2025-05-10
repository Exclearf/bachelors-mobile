import React from "react";
import { StyleSheet, View } from "react-native";

import { useLocalization } from "@/features/shared/hooks/useLocalization";

import AppThemeSwitch from "./items/AppThemeSwitch";
import ThemeColorSlider from "./items/ThemeColorPanel";
import { SettingsSectionsItemType } from "../../../SettingsSections";

type Props = SettingsSectionsItemType;

const PersonalizationSection = ({
  getTranslationKey,
  style,
  textStyle,
}: Props) => {
  const items = [AppThemeSwitch, ThemeColorSlider];
  getTranslationKey = useLocalization(
    getTranslationKey("personalizationSection"),
  );

  return (
    <>
      {items.map((Item, index) => (
        <View style={[style, styles.containerItem]} key={index}>
          <Item getTranslationKey={getTranslationKey} textStyle={textStyle} />
        </View>
      ))}
    </>
  );
};

export default PersonalizationSection;

const styles = StyleSheet.create({ containerItem: { paddingVertical: 10 } });
