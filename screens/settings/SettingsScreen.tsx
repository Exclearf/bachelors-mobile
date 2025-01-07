import { StyleSheet, View } from "react-native";
import React, { useContext } from "react";
import { AppDimensionsContext } from "@/contexts/appDimensions";
import TranslatedText from "@/components/common/TranslatedText";
import { useLocalization } from "@/hooks/useLocalization";
import UserInfo from "./components/UserInfo";
import LanguageTogglesSection from "./components/LanguageTogglesSection";
import PersonalizationSection from "./components/PersonalizationSection";

const SettingsScreen = () => {
  const { width, height } = useContext(AppDimensionsContext);
  const getTranslationKey = useLocalization("settingsPage");

  return (
    <View style={styles.container}>
      <UserInfo getTranslationKey={getTranslationKey} height={height} />
      {(
        [
          [
            getTranslationKey("languagesSettingsSection"),
            LanguageTogglesSection,
          ],
          [getTranslationKey("personalizationHeader"), PersonalizationSection],
        ] as const
      ).map(([translationKey, Component]) => (
        <View style={styles.sectionContainer} key={translationKey}>
          <TranslatedText
            style={styles.sectionHeader}
            translationKey={translationKey}
          />
          <Component
            style={styles.sectionContent}
            textStyle={styles.sectionContentText}
            getTranslationKey={getTranslationKey}
            width={width}
          />
        </View>
      ))}
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
  sectionContainer: {
    height: "auto",
    marginVertical: 10,
    textAlign: "justify",
    padding: 10,
    borderColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    fontSize: 18,
    paddingBottom: 15,
    paddingTop: 10,
    color: "#fff",
  },
  sectionContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  sectionContentText: { color: "white", fontSize: 16, width: "30%" },
});
