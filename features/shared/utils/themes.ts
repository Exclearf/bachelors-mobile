import { argbFromHex, Theme } from "@material/material-color-utilities";
import { ColorSchemeName } from "react-native";
import { colorKit } from "reanimated-color-picker";

export const globalTheme = {
  fontRegular: "OpenSans_400Regular",
  fontSemiBold: "OpenSans_600SemiBold",
};

// TODO: While refactoring the provider into useThemeCreator.ts, extract the if else into it
// The reason is that we will not generate the palette which is not used in that case
export const generateTheme = (
  palette: Theme,
  themeType: ColorSchemeName,
  isHighContrast: boolean,
  hexColor: string,
) => {
  if (hexColor === "#000000") {
    //return generateBlackTheme(isHighContrast);
  }
  if (hexColor === "#ffffff") {
    //return generateWhiteTheme(isHighContrast);
  }
  return themeType === "dark"
    ? generateDarkTheme(palette, isHighContrast)
    : generateLightTheme(palette, isHighContrast);
};

type PregeneratedThemeColors = Readonly<Record<string, [string, boolean]>>;

const blackThemeColors: PregeneratedThemeColors = {
  background: ["#000000", true],
  primaryBackground: ["#000000", true],
  primaryForeground: ["#ffffff", false],
  secondaryBackground: ["#000000", true],
  secondaryForeground: ["#ffffff", false],
  mutedBackground: ["#000000", true],
  mutedForeground: ["#ffffff", false],
};

const whiteThemeColors: PregeneratedThemeColors = {
  background: ["#ffffff", true],
  primaryBackground: ["#ffffff", true],
  primaryForeground: ["#000000", false],
  secondaryBackground: ["#ffffff", true],
  secondaryForeground: ["#000000", false],
  mutedBackground: ["#ffffff", true],
  mutedForeground: ["#000000", false],
};

const generateDarkTheme = (palette: Theme, isHighContrast: boolean) => {
  const foregroundMultipler = isHighContrast ? 1.25 : 1;
  const backgroundMultiplier = isHighContrast ? 0.25 : 1;

  return {
    background: palette.palettes.neutral.tone(5 * backgroundMultiplier),
    surfaceBackground: palette.palettes.neutral.tone(40 * backgroundMultiplier),
    surfaceForeground: palette.palettes.neutralVariant.tone(
      85 * foregroundMultipler,
    ),
    primaryBackground: palette.palettes.neutralVariant.tone(
      13 * backgroundMultiplier,
    ),
    primaryForeground: palette.palettes.primary.tone(
      98.5 * foregroundMultipler,
    ),
    secondaryBackground: palette.palettes.neutralVariant.tone(
      10 * foregroundMultipler,
    ),
    secondaryForeground: palette.palettes.secondary.tone(
      93.5 * foregroundMultipler,
    ),
    mutedBackground: palette.palettes.neutralVariant.tone(
      30 * backgroundMultiplier,
    ),
    mutedForeground: palette.palettes.secondary.tone(50 * foregroundMultipler),
    destructive: palette.palettes.error.tone(50 * backgroundMultiplier),
  };
};

const generateLightTheme = (palette: Theme, isHighContrast: boolean) => {
  const foregroundMultipler = isHighContrast ? 0.8 : 1;
  const backgroundMultiplier = isHighContrast ? 1.2 : 1;

  return {
    background: palette.palettes.neutralVariant.tone(90 * backgroundMultiplier),
    primaryBackground: palette.palettes.neutralVariant.tone(
      40 * foregroundMultipler,
    ),
    surfaceForeground: palette.palettes.tertiary.tone(70 * foregroundMultipler),
    surfaceBackground: palette.palettes.secondary.tone(
      80 * backgroundMultiplier,
    ),
    primaryForeground: palette.palettes.neutralVariant.tone(
      30 * foregroundMultipler,
    ),
    secondaryBackground: palette.palettes.neutralVariant.tone(
      60 * foregroundMultipler,
    ),
    secondaryForeground: palette.palettes.secondary.tone(
      10 * foregroundMultipler,
    ),
    mutedBackground: palette.palettes.secondary.tone(60 * backgroundMultiplier),
    mutedForeground: palette.palettes.secondary.tone(75 * foregroundMultipler),
    destructive: palette.palettes.error.tone(80 * backgroundMultiplier),
  };
};

const adjustedColorCreator =
  (
    isDark: boolean,
    backgroundMultiplier: number,
    foregroundMultipler: number,
  ) =>
  (color: string, isBackground: boolean) => {
    const backgroundAdjusterFunc = isDark ? colorKit.darken : colorKit.brighten;
    const foregroundAdjusterFunc = isDark ? colorKit.brighten : colorKit.darken;
    const adjustedColor = isBackground
      ? backgroundAdjusterFunc(color, backgroundMultiplier)
      : foregroundAdjusterFunc(color, foregroundMultipler);
    return argbFromHex(adjustedColor.hex());
  };

const generateBlackTheme = (isHighContrast: boolean) => {
  const foregroundMultipler = isHighContrast ? 1.25 : 1;
  const backgroundMultiplier = isHighContrast ? 0.4 : 1;

  const adjustColor = adjustedColorCreator(
    true,
    backgroundMultiplier,
    foregroundMultipler,
  );

  const adjustedColors: Record<string, number> = {};

  for (const [key, [colorCode, isBackground]] of Object.entries(
    blackThemeColors,
  )) {
    adjustedColors[key] = adjustColor(colorCode, isBackground);
  }

  return adjustedColors;
};

const generateWhiteTheme = (isHighContrast: boolean) => {
  const foregroundMultipler = isHighContrast ? 1.25 : 1;
  const backgroundMultiplier = isHighContrast ? 0.4 : 1;

  const adjustColor = adjustedColorCreator(
    false,
    backgroundMultiplier,
    foregroundMultipler,
  );

  const adjustedColors: Record<string, number> = {};

  for (const [key, [colorCode, isBackground]] of Object.entries(
    whiteThemeColors,
  )) {
    adjustedColors[key] = adjustColor(colorCode, isBackground);
  }

  return adjustedColors;
};

export function setSaturation(hsvColor: string, newSaturation: number): string {
  const hsvRegex = /hsv\((\d+),\s*(\d+)%?,\s*(\d+)%?\)/i;

  const match = hsvColor.match(hsvRegex);
  if (!match) {
    throw new Error("Invalid HSV color format");
  }

  const [_, hue, , value] = match;
  return `hsv(${hue}, ${newSaturation}%, ${value}%)`;
}

export const getSaturation = (hsvColor: string): number => {
  const hsvRegex = /hsv\((\d+),\s*(\d+)%?,\s*(\d+)%?\)/i;

  const match = hsvColor.match(hsvRegex);
  if (!match) {
    throw new Error("Invalid HSV color format");
  }

  const [, , saturation] = match;
  return parseInt(saturation, 10);
};
