import { StyleSheet, Switch, TextStyle, View, ViewStyle } from "react-native";
import React from "react";
import ToggleGroup, { ToggleItemType } from "@/components/common/ToggleGroup";
import {
  AvailableThemes,
  usePersonalizationStore,
} from "@/stores/personalizationStore";
import { useShallow } from "zustand/react/shallow";
import TranslatedText from "@/components/common/TranslatedText";
import { lightHighContrast } from "@/utils/themes";

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
            trackColor={{
              false: "rgba(75,75,75,0.5)",
              true: "rgba(75,75,75,1)",
            }}
            thumbColor={
              isHighContrast ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.5)"
            }
            onValueChange={setIsHighContrast}
            value={isHighContrast}
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
