import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SettingsSectionSubItemType } from "@/features/settings/SettingsSections";

type Props = {} & SettingsSectionSubItemType;

const FontSizeSlider = (props: Props) => {
  return (
    <View>
      <Text>FontSizeSlider</Text>
    </View>
  );
};

export default FontSizeSlider;

const styles = StyleSheet.create({});
