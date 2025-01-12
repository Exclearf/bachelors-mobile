import { Theme } from "@material/material-color-utilities";
import { ColorSchemeName } from "react-native";

export const generateTheme = (
  palette: Theme,
  themeType: ColorSchemeName,
  isHighContrast: boolean,
) => {
  return themeType === "dark"
    ? generateDarkTheme(palette, isHighContrast)
    : generateLightTheme(palette, isHighContrast);
};

const generateDarkTheme = (palette: Theme, isHighContrast: boolean) => ({
  primary: palette.palettes.neutral.tone(1.35), // shade 100
});

const generateLightTheme = (palette: Theme, isHighContrast: boolean) => ({
  primary: palette.palettes.neutral.tone(75), // shade 100
});
