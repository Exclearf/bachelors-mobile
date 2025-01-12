import React, { PropsWithChildren, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { usePersonalizationStore } from "../stores/personalizationStore";
import { useColorScheme } from "react-native";
import {
  argbFromHex,
  hexFromArgb,
  themeFromSourceColor,
} from "@material/material-color-utilities";
import { generateTheme } from "../utils/generateTheme";
type Props = PropsWithChildren<{}>;

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

  const theme = useColorScheme();

  useEffect(() => {
    setThemeType(theme);
  }, []);

  useEffect(() => {
    console.log(`Generating theme with ${accentColor}`);
    const theme = themeFromSourceColor(argbFromHex(accentColor));
    const newTheme = generateTheme(theme, themeType, isHighContrast);
    setTheme(newTheme);
    console.log(hexFromArgb(newTheme.primary));
  }, [themeType, isHighContrast, accentColor]);

  return <>{children}</>;
};

export default ThemeProvider;
