import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { useSettingsItemWidth } from "@/features/settings/hooks/useSettingsItemWidth";
import { SettingsSectionSubItemType } from "@/features/settings/SettingsSections";
import Select, {
  SelectItemType,
} from "@/features/shared/components/input/Select";
import log from "@/features/shared/utils/log";
import { locales } from "@/features/translation/i18n/i18n";

import SettingsMenuEntryText from "../../shared/SettingsMenuEntryText";

const AppLanguageToggle = ({
  getTranslationKey,
  textStyle,
}: SettingsSectionSubItemType) => {
  const { i18n } = useTranslation();
  const [selectedLanguageCode, setSelectedLanguageCode] = useState(
    i18n.language,
  );
  const { width } = useSettingsItemWidth();

  const appLanguages: SelectItemType[] = locales.map((item) => ({
    id: item.code,
    translationKey: item.displayName,
  }));

  const currentAppLanguageItem = appLanguages.find(
    (lang) => lang.id === selectedLanguageCode,
  );

  const changeAppLanguage = (languageId: string) => {
    setSelectedLanguageCode(languageId);
    i18n.changeLanguage(languageId);
    log.info("Changing the app language to:", languageId);
  };

  return (
    <>
      <SettingsMenuEntryText
        textStyle={textStyle}
        textTranslationKey={getTranslationKey("appLanguage")}
        tooltipTranslationKey={getTranslationKey("appLanguageTooltip")}
      />
      <Select
        width={width}
        items={appLanguages}
        currentItem={currentAppLanguageItem!}
        setCurrentItem={(item) => changeAppLanguage(item.id as string)}
      />
    </>
  );
};

export default AppLanguageToggle;
