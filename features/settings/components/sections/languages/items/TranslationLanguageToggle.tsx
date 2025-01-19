import React from "react";
import { useTranslationStore } from "@/features/translation/stores/translationStore";
import { useShallow } from "zustand/react/shallow";
import ToggleGroup, {
  ToggleItemType,
} from "@/features/shared/components/input/ToggleGroup";
import TranslatedText from "@/features/shared/components/text/TranslatedText";
import { SettingsSectionSubItemType } from "@/features/settings/SettingsSections";
import { useSettingsItemWidth } from "@/features/settings/hooks/useSettingsItemWidth";
import { StyleSheet, View } from "react-native";
import Tooltip from "@/features/shared/components/feedback/Tooltip";
import { useFontSize } from "@/features/shared/hooks/useFontSize";

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
  const fontSize = useFontSize();
  const currentTranslationLanguageIndex = availableLanguages.findIndex(
    (item) => item.id === currentLanguage.id,
  );
  const changeTranslationLanguage = (language: ToggleItemType) => {
    setCurrentLanguage(language);
    console.log("Changing translation language to:", language.id);
  };

  return (
    <>
      <View style={styles.textContainer}>
        <TranslatedText
          translationKey={getTranslationKey("translationLanguage")}
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
              translationKey={getTranslationKey("translationLanguageTooltip")}
            />
          </Tooltip>
        </TranslatedText>
      </View>
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

const styles = StyleSheet.create({
  textContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 5,
  },
});
