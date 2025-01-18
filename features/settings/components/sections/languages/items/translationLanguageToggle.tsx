import React from "react";
import { useTranslationStore } from "@/features/translation/stores/translationStore";
import { useShallow } from "zustand/react/shallow";
import ToggleGroup, {
  ToggleItemType,
} from "@/features/shared/components/input/ToggleGroup";
import TranslatedText from "@/features/shared/components/text/TranslatedText";
import { SettingsSectionSubItemType } from "@/features/settings/SettingsSections";
import { useSettingsItemWidth } from "@/features/settings/hooks/useSettingsItemWidth";

type Props = SettingsSectionSubItemType;

const TranslationLanguageToggle = ({ getTranslationKey, textStyle }: Props) => {
  const [availableLanguages, currentLanguage, setCurrentLanguage] =
    useTranslationStore(
      useShallow((state) => [
        state.availableLanguages,
        state.currentLanguage,
        state.setCurrentLanguage,
      ]),
    );
  const { width } = useSettingsItemWidth();
  const currentTranslationLanguageIndex = availableLanguages.findIndex(
    (item) => item.id === currentLanguage.id,
  );
  const changeTranslationLanguage = (language: ToggleItemType) => {
    setCurrentLanguage(language);
    console.log("Changing translation language to:", language.id);
  };

  return (
    <>
      <TranslatedText
        translationKey={getTranslationKey("translationLanguage")}
        style={textStyle}
      />
      <ToggleGroup
        selectedIndex={currentTranslationLanguageIndex}
        items={availableLanguages}
        onChange={changeTranslationLanguage}
        width={width}
      />
    </>
  );
};

export default TranslationLanguageToggle;
