import { StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import React from "react";
import LanguageTogglesSection from "./components/sections/languages/LanguagePreferencesSection";
import PersonalizationSection from "./components/sections/personalization/PersonalizationSection";
import TranslatedText from "@/features/shared/components/text/TranslatedText";
import AccessibilitySection from "./components/sections/accessibility/AccessibilitySection";
import { useLocalization } from "../shared/hooks/useLocalization";
import { useTheme } from "../shared/hooks/useTheme";

type Props = {
  getTranslationKey: (key: string) => string;
  width: number;
};

export type SettingsSectionsItemType = {
  getTranslationKey: (key: string) => string;
  width: number;
  style: ViewStyle;
  textStyle: TextStyle;
};

export type SettingsSectionSubItemType = {
  getTranslationKey: (key: string) => string;
  textStyle: TextStyle;
  width: number;
};

const SettingsSections = ({ getTranslationKey, width }: Props) => {
  getTranslationKey = useLocalization(getTranslationKey("sections"));
  const theme = useTheme();
  return (
    <>
      {(
        [
          [
            getTranslationKey("languagePreferencesSectionHeader"),
            LanguageTogglesSection,
          ],
          [
            getTranslationKey("personalizationSectionHeader"),
            PersonalizationSection,
          ],
          [
            getTranslationKey("accessibilitySectionHeader"),
            AccessibilitySection,
          ],
        ] as const
      ).map(([translationKey, Component]) => (
        <View style={styles.sectionContainer} key={translationKey}>
          <TranslatedText
            style={{ ...styles.sectionHeader, color: theme?.primaryForeground }}
            translationKey={translationKey}
          />
          <Component
            style={styles.sectionContent}
            textStyle={{
              ...styles.sectionContentText,
              color: theme?.secondaryForeground,
            }}
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
  },
  sectionContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  sectionContentText: { fontSize: 16, width: "30%" },
});
