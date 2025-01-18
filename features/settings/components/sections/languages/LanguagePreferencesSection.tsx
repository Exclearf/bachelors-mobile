import { View } from "react-native";
import React from "react";
import { SettingsSectionsItemType } from "../../../SettingsSections";
import { useLocalization } from "@/features/shared/hooks/useLocalization";
import AppLanguageToggle from "./items/appLanguageToggle";
import TranslationLanguageToggle from "./items/translationLanguageToggle";

type Props = {} & SettingsSectionsItemType;

const LanguageTogglesSection = ({
  getTranslationKey,
  style,
  textStyle,
}: Props) => {
  getTranslationKey = useLocalization(
    getTranslationKey("languagePreferencesSection"),
  );

  return (
    <>
      {([AppLanguageToggle, TranslationLanguageToggle] as const).map(
        (LanguageToggle, index) => (
          <View key={index} style={style}>
            <LanguageToggle
              getTranslationKey={getTranslationKey}
              textStyle={textStyle}
            />
          </View>
        ),
      )}
    </>
  );
};

export default LanguageTogglesSection;
