import { StyleSheet, View } from "react-native";
import React, { useContext } from "react";
import { AppDimensionsContext } from "@/contexts/appDimensions";
import TranslatedText from "@/components/common/TranslatedText";
import { useLocalization } from "@/hooks/useLocalization";
import UserInfo from "./components/userInfo";
import LanguageTogglesSection from "./components/languageTogglesSection";

const SettingsScreen = () => {
  const { width, height } = useContext(AppDimensionsContext);
  const getTranslationKey = useLocalization("settingsPage");

  return (
    <View style={styles.container}>
      <UserInfo getTranslationKey={getTranslationKey} height={height} />
      <View style={styles.translationsContainer}>
        <TranslatedText
          translationKey={getTranslationKey("languagesSettingsSection")}
          style={styles.translationsContainerText}
        />
        <LanguageTogglesSection
          getTranslationKey={getTranslationKey}
          width={width}
        />
      </View>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e1e",
    paddingTop: 0,
    paddingHorizontal: "3%",
  },
  translationsContainer: {
    height: "auto",
    marginVertical: 10,
    padding: 10,
    borderColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 20,
  },
  translationsContainerText: {
    fontSize: 18,
    paddingBottom: 15,
    paddingTop: 10,
    color: "#fff",
  },
});
