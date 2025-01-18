import { AppDimensionsContext } from "@/features/shared/contexts/appDimensions";
import SettingsSections from "@/features/settings/SettingsSections";
import UserInfo from "@/features/settings/UserInfo";
import { useLocalization } from "@/features/shared/hooks/useLocalization";
import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { usePersonalizationStore } from "@/features/settings/stores/personalizationStore";

const SettingsTab = () => {
  const { width, height } = useContext(AppDimensionsContext);
  const getTranslationKey = useLocalization("settingsPage");
  const theme = usePersonalizationStore((state) => state.theme);

  return (
    <View style={[styles.container, { backgroundColor: theme?.background }]}>
      <UserInfo getTranslationKey={getTranslationKey} height={height} />
      <SettingsSections getTranslationKey={getTranslationKey} width={width} />
    </View>
  );
};

export default SettingsTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    paddingHorizontal: "3%",
  },
});
