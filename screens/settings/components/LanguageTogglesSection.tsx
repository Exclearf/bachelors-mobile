import { StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import React, { useState } from "react";
import { locales } from "@/i18n/i18n";
import ToggleGroup, { ToggleItemType } from "@/components/common/ToggleGroup";
import { useTranslationStore } from "@/stores/translationStore";
import { useShallow } from "zustand/react/shallow";
import { useTranslation } from "react-i18next";
import TranslatedText from "@/components/common/TranslatedText";

type Props = {
  getTranslationKey: (key: string) => string;
  width: number;
  style: ViewStyle;
  textStyle: TextStyle;
};

const LanguageTogglesSection = ({
  getTranslationKey,
  width,
  style,
  textStyle,
}: Props) => {
  const { i18n } = useTranslation();
  const [selectedLanguageCode, setSelectedLanguageCode] = useState(
    i18n.language,
  );

  const appLanguages: ToggleItemType[] = locales.map((item) => ({
    id: item.code,
    title: item.displayName,
  }));
  const [availableLanguages, currentLanguage, setCurrentLanguage] =
    useTranslationStore(
      useShallow((state) => [
        state.availableLanguages,
        state.currentLanguage,
        state.setCurrentLanguage,
      ]),
    );

  const currentTranslationLanguageIndex = availableLanguages.findIndex(
    (item) => item.id === currentLanguage.id,
  );
  const currentAppLanguageIndex = appLanguages.findIndex(
    (lang) => lang.id === selectedLanguageCode,
  );

  const changeTranslationLanguage = (language: ToggleItemType) => {
    setCurrentLanguage(language);
    console.log("Changing translation language to:", language.id);
  };

  const changeAppLanguage = (language: ToggleItemType) => {
    setSelectedLanguageCode(language.id);
    i18n.changeLanguage(language.id);
    console.log("Changing app language to:", language.id);
  };

  return (
    <>
      {(
        [
          [
            appLanguages,
            getTranslationKey("appLanguage"),
            changeAppLanguage,
            currentAppLanguageIndex,
          ],
          [
            availableLanguages,
            getTranslationKey("translationLanguage"),
            changeTranslationLanguage,
            currentTranslationLanguageIndex,
          ],
        ] as const
      ).map(([languages, translationKey, onChange], index) => (
        <View key={index} style={style}>
          <TranslatedText translationKey={translationKey} style={textStyle} />
          <ToggleGroup
            selectedIndex={currentAppLanguageIndex}
            items={languages}
            onChange={onChange}
            width={width * 0.55}
          />
        </View>
      ))}
    </>
  );
};

export default LanguageTogglesSection;

const styles = StyleSheet.create({});
