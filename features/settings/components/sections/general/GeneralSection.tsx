import React from "react";
import { View } from "react-native";

import { useLocalization } from "@/features/shared/hooks/useLocalization";

import AppLanguageToggle from "./items/AppLanguageToggle";
import ModelSelect from "./items/ModelSelect";
import TranslationLanguageToggle from "./items/TranslationLanguageToggle";
import { SettingsSectionsItemType } from "../../../SettingsSections";

type Props = SettingsSectionsItemType;

const GeneralSection = ({ getTranslationKey, style, textStyle }: Props) => {
  getTranslationKey = useLocalization(
    getTranslationKey("generalSettingsSection"),
  );

  return (
    <>
      {(
        [AppLanguageToggle, TranslationLanguageToggle, ModelSelect] as const
      ).map((LanguageToggle, index) => (
        <View key={index} style={style}>
          <LanguageToggle
            getTranslationKey={getTranslationKey}
            textStyle={textStyle}
          />
        </View>
      ))}
    </>
  );
};

export default GeneralSection;
