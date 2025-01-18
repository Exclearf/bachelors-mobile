import {
  ScrollView,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import React, { lazy, Suspense } from "react";
import { useLocalization } from "../shared/hooks/useLocalization";
import { useTheme } from "../shared/hooks/useTheme";
import TranslatedText from "@/features/shared/components/text/TranslatedText";
import Skeleton from "../shared/components/feedback/Skeleton";

const LanguageTogglesSection = lazy(
  () => import("./components/sections/languages/LanguagePreferencesSection"),
);
const PersonalizationSection = lazy(
  () => import("./components/sections/personalization/PersonalizationSection"),
);
const AccessibilitySection = lazy(
  () => import("./components/sections/accessibility/AccessibilitySection"),
);

type Props = {
  getTranslationKey: (key: string) => string;
  width: number;
  height: number;
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

const SettingsSections = ({ getTranslationKey, width, height }: Props) => {
  getTranslationKey = useLocalization(getTranslationKey("sections"));
  const theme = useTheme();
  const settingsSections = [
    [
      getTranslationKey("languagePreferencesSectionHeader"),
      LanguageTogglesSection,
    ],
    [getTranslationKey("personalizationSectionHeader"), PersonalizationSection],
    [getTranslationKey("accessibilitySectionHeader"), AccessibilitySection],
  ] as const;
  // 100 - UserInfo height - Tabs height - padding
  const itemHeght = (height * 0.75) / settingsSections.length;

  return (
    <ScrollView>
      {settingsSections.map(([translationKey, Component]) => (
        <Suspense
          key={translationKey}
          fallback={
            <Skeleton
              style={{
                width: "100%",
                height: itemHeght,
                marginTop: 10,
              }}
            />
          }
        >
          <View
            style={[
              styles.sectionContainer,
              { borderColor: theme?.secondaryBackground, borderWidth: 1.35 },
            ]}
          >
            <TranslatedText
              style={{
                ...styles.sectionHeader,
                color: theme?.primaryForeground,
              }}
              isBold={true}
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
        </Suspense>
      ))}
    </ScrollView>
  );
};

export default SettingsSections;

const styles = StyleSheet.create({
  sectionContainer: {
    height: "auto",
    marginVertical: 10,
    textAlign: "justify",
    padding: 10,
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
  sectionContentText: { fontSize: 15, width: "30%" },
});
