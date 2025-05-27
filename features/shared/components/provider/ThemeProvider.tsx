import {
  argbFromHex,
  themeFromSourceColor,
} from "@material/material-color-utilities";
import React, { PropsWithChildren, useEffect } from "react";
import { useColorScheme } from "react-native";
import { colorKit } from "reanimated-color-picker";
import { useShallow } from "zustand/react/shallow";

import { usePersonalizationStore } from "../../../settings/stores/usePersonalizationStore";
import { generateTheme } from "../../utils/themes";

type Props = PropsWithChildren<object>;

// TODO: Extract the logic from this component into a custom hook
const ThemeProvider = ({ children }: Props) => {
  const [setTheme, themeType, setThemeType, isHighContrast, accentColor] =
    usePersonalizationStore(
      useShallow((state) => [
        state.setTheme,
        state.themeType,
        state.setThemeType,
        state.isHighContrast,
        state.accentColor,
      ]),
    );

  const colorScheme = useColorScheme();

  useEffect(() => {
    if (themeType == null) {
      setThemeType(colorScheme);
    }
  }, [colorScheme, setThemeType, themeType]);

  useEffect(() => {
    const theme = themeFromSourceColor(argbFromHex(colorKit.HEX(accentColor)));
    const newTheme = generateTheme(
      theme,
      themeType,
      isHighContrast,
      colorKit.HEX(accentColor),
    );

    setTheme(newTheme);
  }, [themeType, isHighContrast, accentColor, setTheme]);

  return <>{children}</>;
};

export default ThemeProvider;
