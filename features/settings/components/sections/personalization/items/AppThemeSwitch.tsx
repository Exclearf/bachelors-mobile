import React from "react";
import TranslatedText from "@/features/shared/components/text/TranslatedText";
import ToggleGroup, {
  ToggleItemType,
} from "@/features/shared/components/input/ToggleGroup";
import { SettingsSectionSubItemType } from "@/features/settings/SettingsSections";
import { ColorSchemeName } from "react-native";
import { usePersonalizationStore } from "@/features/settings/stores/personalizationStore";
import { useShallow } from "zustand/react/shallow";

type Props = {} & SettingsSectionSubItemType;

const AppThemeSwitch = ({ getTranslationKey, textStyle, width }: Props) => {
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

  const currentIndex = themeItems.findIndex((item) => item.id === themeType);

  const changeTheme = (e: ToggleItemType) => {
    setThemeType(e.id as ColorSchemeName);

    console.log(`Theme changed to ${e.id}`);
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
        height={30}
        width={width * 0.55}
        changeWhenAnimationEnds={true}
      />
    </>
  );
};

export default AppThemeSwitch;
