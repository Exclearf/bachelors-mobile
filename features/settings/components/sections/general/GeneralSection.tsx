import { View } from "react-native";
import React from "react";
import { SettingsSectionsItemType } from "../../../SettingsSections";
import { useLocalization } from "@/features/shared/hooks/useLocalization";
import AppLanguageToggle from "./items/AppLanguageToggle";
import TranslationLanguageToggle from "./items/TranslationLanguageToggle";
import ModelSelect from "./items/ModelSelect";

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
