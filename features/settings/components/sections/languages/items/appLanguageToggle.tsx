import React, { useState } from "react";
import { SettingsSectionSubItemType } from "@/features/settings/SettingsSections";
import ToggleGroup, {
  ToggleItemType,
} from "@/features/shared/components/input/ToggleGroup";
import TranslatedText from "@/features/shared/components/text/TranslatedText";
import { useTranslation } from "react-i18next";
import { locales } from "@/features/translation/i18n/i18n";

type Props = {} & SettingsSectionSubItemType;

const AppLanguageToggle = ({ getTranslationKey, textStyle, width }: Props) => {
  const { i18n } = useTranslation();
  const [selectedLanguageCode, setSelectedLanguageCode] = useState(
    i18n.language,
  );

  const appLanguages: ToggleItemType[] = locales.map((item) => ({
    id: item.code,
    title: item.displayName,
  }));

  const currentAppLanguageIndex = appLanguages.findIndex(
    (lang) => lang.id === selectedLanguageCode,
  );

  const changeAppLanguage = (language: ToggleItemType) => {
    setSelectedLanguageCode(language.id);
    i18n.changeLanguage(language.id);
    console.log("Changing app language to:", language.id);
  };

  return (
    <>
      <TranslatedText
        translationKey={getTranslationKey("appLanguage")}
        style={textStyle}
      />
      <ToggleGroup
        selectedIndex={currentAppLanguageIndex}
        items={appLanguages}
        onChange={changeAppLanguage}
        height={30}
        width={width * 0.55}
      />
    </>
  );
};

export default AppLanguageToggle;
