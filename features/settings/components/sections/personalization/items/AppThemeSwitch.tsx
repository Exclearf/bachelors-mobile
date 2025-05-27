import React from "react";
import { ColorSchemeName } from "react-native";
import { useShallow } from "zustand/react/shallow";

import { useSettingsItemWidth } from "@/features/settings/hooks/useSettingsItemWidth";
import { SettingsSectionSubItemType } from "@/features/settings/SettingsSections";
import { usePersonalizationStore } from "@/features/settings/stores/usePersonalizationStore";
import ToggleGroup, {
  ToggleItemType,
} from "@/features/shared/components/input/ToggleGroup";
import TranslatedText from "@/features/shared/components/text/TranslatedText";
import log from "@/features/shared/utils/log";

type Props = SettingsSectionSubItemType;

const AppThemeSwitch = ({ getTranslationKey, textStyle }: Props) => {
  const themeItems: ToggleItemType[] = [
    {
      id: "light",
      title: getTranslationKey("lightTheme"),
    },
    {
      id: "dark",
      title: getTranslationKey("darkTheme"),
    },
  ];

  const [themeType, setThemeType] = usePersonalizationStore(
    useShallow((state) => [state.themeType, state.setThemeType]),
  );
  const { width } = useSettingsItemWidth();
  const currentIndex = themeItems.findIndex((item) => item.id === themeType);

  const changeTheme = (e: ToggleItemType) => {
    setThemeType(e.id as ColorSchemeName);

    log.debug(`Theme changed to ${e.id}`);
  };

  return (
    <>
      <TranslatedText
        style={textStyle}
        translationKey={getTranslationKey("appTheme")}
      />
      <ToggleGroup
        onChange={changeTheme}
        selectedIndex={currentIndex}
        items={themeItems}
        width={width}
        changeWhenAnimationEnds={true}
      />
    </>
  );
};

export default AppThemeSwitch;
