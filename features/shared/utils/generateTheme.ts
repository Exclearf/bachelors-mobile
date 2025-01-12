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

const generateDarkTheme = (palette: Theme, isHighContrast: boolean) => {
  const foregroundMultipler = isHighContrast ? 1.25 : 1;
  const backgroundMultiplier = isHighContrast ? 0.4 : 1;
  return {
    background: palette.palettes.neutralVariant.tone(3 * backgroundMultiplier),
    card: palette.palettes.neutralVariant.tone(40 * backgroundMultiplier),
    cardForeground: palette.palettes.secondary.tone(90 * foregroundMultipler),
    primary: palette.palettes.primary.tone(0 * foregroundMultipler),
    primaryForeground: palette.palettes.secondary.tone(
      95 * foregroundMultipler,
    ),
    secondary: palette.palettes.secondary.tone(50 * foregroundMultipler),
    secondaryForeground: palette.palettes.secondary.tone(
      85 * foregroundMultipler,
    ),
    muted: palette.palettes.secondary.tone(15 * backgroundMultiplier),
    mutedForeground: palette.palettes.secondary.tone(50 * foregroundMultipler),
  };
};

const generateLightTheme = (palette: Theme, isHighContrast: boolean) => {
  const foregroundMultipler = isHighContrast ? 0.5 : 1;
  const backgroundMultiplier = isHighContrast ? 1.25 : 1;

  return {
    background: palette.palettes.neutralVariant.tone(95 * backgroundMultiplier),
    card: palette.palettes.neutralVariant.tone(90 * backgroundMultiplier),
    cardForeground: palette.palettes.neutralVariant.tone(
      500 * foregroundMultipler,
    ),
    primary: palette.palettes.primary.tone(100 * foregroundMultipler),
    primaryForeground: palette.palettes.primary.tone(0 * foregroundMultipler),
    secondary: palette.palettes.secondary.tone(100 * foregroundMultipler),
    secondaryForeground: palette.palettes.secondary.tone(
      0 * foregroundMultipler,
    ),
    muted: palette.palettes.neutralVariant.tone(60 * foregroundMultipler),
    mutedForeground: palette.palettes.neutralVariant.tone(50),
  };
};
