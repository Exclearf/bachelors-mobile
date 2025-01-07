import { AppDimensionsContext } from "@/features/shared/contexts/appDimensions";
import SettingsSections from "@/features/settings/components/sections/SettingsSections";
import UserInfo from "@/features/settings/UserInfo";
import { useLocalization } from "@/features/shared/hooks/useLocalization";
import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";

const SettingsTab = () => {
  const { width, height } = useContext(AppDimensionsContext);
  const getTranslationKey = useLocalization("settingsPage");

  return (
    <View style={styles.container}>
      <UserInfo getTranslationKey={getTranslationKey} height={height} />
      <SettingsSections getTranslationKey={getTranslationKey} width={width} />
    </View>
  );
};

export default SettingsTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e1e",
    paddingTop: 0,
    paddingHorizontal: "3%",
  },
});
