import React, { useState } from "react";
import { SettingsSectionSubItemType } from "@/features/settings/SettingsSections";
import ToggleGroup, {
  ToggleItemType,
} from "@/features/shared/components/input/ToggleGroup";
import TranslatedText from "@/features/shared/components/text/TranslatedText";
import { useTranslation } from "react-i18next";
import { locales } from "@/features/translation/i18n/i18n";
import { useSettingsItemWidth } from "@/features/settings/hooks/useSettingsItemWidth";
import Tooltip from "@/features/shared/components/feedback/Tooltip";
import { useFontSize } from "@/features/shared/hooks/useFontSize";
import { StyleSheet, View } from "react-native";

type Props = SettingsSectionSubItemType;

const AppLanguageToggle = ({ getTranslationKey, textStyle }: Props) => {
  const { i18n } = useTranslation();
  const [selectedLanguageCode, setSelectedLanguageCode] = useState(
    i18n.language,
  );
  const { width } = useSettingsItemWidth();
  const fontSize = useFontSize();
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
      <View style={styles.textContainer}>
        <TranslatedText
          translationKey={getTranslationKey("appLanguage")}
          style={textStyle}
        >
          <Tooltip
            width={150 + fontSize["large"]}
            iconSize={fontSize["regular"]}
            height={75}
            position="bottom"
          >
            <TranslatedText
              numberOfLines={2}
              translationKey={getTranslationKey("appLanguageTooltip")}
            />
          </Tooltip>
        </TranslatedText>
      </View>
      <ToggleGroup
        selectedIndex={currentAppLanguageIndex}
        items={appLanguages}
        onChange={changeAppLanguage}
        width={width}
      />
    </>
  );
};

export default AppLanguageToggle;

const styles = StyleSheet.create({
  textContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 5,
  },
});
