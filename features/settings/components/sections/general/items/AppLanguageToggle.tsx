import React, { useState } from "react";
import { SettingsSectionSubItemType } from "@/features/settings/SettingsSections";
import ToggleGroup, {
    ToggleItemType,
} from "@/features/shared/components/input/ToggleGroup";
import { useTranslation } from "react-i18next";
import { locales } from "@/features/translation/i18n/i18n";
import { useSettingsItemWidth } from "@/features/settings/hooks/useSettingsItemWidth";
import SettingsMenuEntry from "../../shared/SettingsMenuEntryText";

type Props = SettingsSectionSubItemType;

const AppLanguageToggle = ({ getTranslationKey, textStyle }: Props) => {
    const { i18n } = useTranslation();
    const [selectedLanguageCode, setSelectedLanguageCode] = useState(
        i18n.language,
    );
    const { width } = useSettingsItemWidth();
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
            <SettingsMenuEntry
                textStyle={textStyle}
                textTranslationKey={getTranslationKey("appLanguage")}
                tooltipTranslationKey={getTranslationKey("appLanguageTooltip")}
            />
            <ToggleGroup
                selectedIndex={currentAppLanguageIndex}
                items={appLanguages}
                onChange={changeAppLanguage}
                width={width}
                changeWhenAnimationEnds={true}
            />
        </>
    );
};

export default AppLanguageToggle;
