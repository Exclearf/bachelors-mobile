import React from "react";
import { useShallow } from "zustand/react/shallow";

import { useSettingsItemWidth } from "@/features/settings/hooks/useSettingsItemWidth";
import { SettingsSectionSubItemType } from "@/features/settings/SettingsSections";
import ToggleGroup, {
  ToggleItemType,
} from "@/features/shared/components/input/ToggleGroup";
import log from "@/features/shared/utils/log";
import { useTranslationStore } from "@/features/translation/stores/translationStore";

import SettingsMenuEntryText from "../../shared/SettingsMenuEntryText";

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
    log.debug("Changing translation language to:", language.id);
  };

  return (
    <>
      <SettingsMenuEntryText
        textStyle={textStyle}
        textTranslationKey={getTranslationKey("translationLanguage")}
        tooltipTranslationKey={getTranslationKey("translationLanguageTooltip")}
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
