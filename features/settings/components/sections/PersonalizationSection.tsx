import { StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import React from "react";
import {
  AvailableThemes,
  usePersonalizationStore,
} from "@/features/shared/stores/personalizationStore";
import { useShallow } from "zustand/react/shallow";
import ToggleGroup, {
  ToggleItemType,
} from "@/features/shared/components/input/ToggleGroup";
import TranslatedText from "@/features/shared/components/text/TranslatedText";
import Switch from "@/features/shared/components/input/Switch";

type Props = {
  getTranslationKey: (key: string) => string;
  style: ViewStyle;
  textStyle: TextStyle;
  width: number;
};

const PersonalizationSection = ({
  getTranslationKey,
  style,
  textStyle,
  width,
}: Props) => {
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

  const [theme, setTheme, isHighContrast, setIsHighContrast] =
    usePersonalizationStore(
      useShallow((state) => [
        state.theme,
        state.setTheme,
        state.isHighContrast,
        state.setIsHighContrast,
      ]),
    );

  const currentIndex = themeItems.findIndex((item) => item.id === theme);

  const changeTheme = (e: ToggleItemType) => {
    setTheme(e.id as AvailableThemes);
    console.log(`Theme changed to ${e.id}`);
  };

  return (
    <>
      <View style={[style, styles.container]}>
        <TranslatedText
          style={textStyle}
          translationKey={getTranslationKey("appTheme")}
        />
        <ToggleGroup
          onChange={changeTheme}
          selectedIndex={currentIndex}
          items={themeItems}
          width={width * 0.55}
        />
      </View>
      <View style={[style, styles.container]}>
        <TranslatedText
          style={textStyle}
          translationKey={getTranslationKey("highContrast")}
        />
        <View
          style={[{ width: width * 0.55 }, styles.highContrastSwitchContainer]}
        >
          {
            // TODO: Remake as a custom component
          }
          <Switch
            checked={isHighContrast}
            setChecked={setIsHighContrast}
            diameter={30}
          />
        </View>
      </View>
    </>
  );
};

export default PersonalizationSection;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
  },
  highContrastSwitchContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
