import { StyleSheet, View } from "react-native";
import React from "react";
import LanguageTogglesSection from "./LanguageTogglesSection";
import PersonalizationSection from "./PersonalizationSection";
import TranslatedText from "@/features/shared/components/text/TranslatedText";

type Props = {
  getTranslationKey: (key: string) => string;
  width: number;
};

const SettingsSections = ({ getTranslationKey, width }: Props) => {
  return (
    <>
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
    </>
  );
};

export default SettingsSections;

const styles = StyleSheet.create({
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
