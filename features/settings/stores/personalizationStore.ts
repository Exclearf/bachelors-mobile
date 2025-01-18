import { ColorSchemeName } from "react-native";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
  generateTheme,
  getSaturation,
  setSaturation,
} from "../../shared/utils/themes";
import { hexFromArgb } from "@material/material-color-utilities";
import { colorKit } from "reanimated-color-picker";

export type Theme = ReplaceNumbersWithStrings<ThemeGeneratorFunction>;

type ReplaceNumbersWithStrings<T> = {
  [K in keyof T]: T[K] extends number
    ? string
    : T[K] extends object
      ? ReplaceNumbersWithStrings<T[K]>
      : T[K];
};

type ThemeGeneratorFunction = ReturnType<typeof generateTheme>;

type PersonalizationState = {
  theme: Theme | null;
  themeType: ColorSchemeName;
  isHighContrast: boolean;
  accentColor: string;
};

type PersonalizationActions = {
  setTheme: (newTheme: ThemeGeneratorFunction) => void;
  setThemeType: (newTheme: ColorSchemeName) => void;
  setIsHighContrast: (newState: boolean) => void;
  setAccentColor: (newColor: string) => void;
};

export const usePersonalizationStore = create<
  PersonalizationState & PersonalizationActions
>()(
  immer((set, get) => ({
    theme: null,
    themeType: "light",
    accentColor: "hsv(163, 0%, 50%)",
    isHighContrast: false,
    setTheme: (newTheme) =>
      set((state) => {
        state.theme = {} as Theme;
        for (const [key, value] of Object.entries(newTheme)) {
          state.theme[key as keyof typeof newTheme] = hexFromArgb(
            Number(value),
          );
        }
      }),
    setThemeType: (newTheme) => {
      let newAccentColor = get().accentColor;
      console.log("New accent color", newAccentColor);
      if (newTheme === "dark") {
        console.log("Dark theme");
        const saturation = getSaturation(newAccentColor);
        newAccentColor = setSaturation(newAccentColor, 100);
        newAccentColor = colorKit
          .setBrightness(newAccentColor, saturation)
          .hsv()
          .string();
      } else {
        console.log("Light theme");
        const brightness = colorKit.getBrightness(newAccentColor);
        newAccentColor = colorKit
          .setBrightness(newAccentColor, 100)
          .hsv()
          .string();
        newAccentColor = setSaturation(newAccentColor, brightness);
      }

      set((state) => {
        state.themeType = newTheme;
        state.accentColor = newAccentColor;
      });
    },
    setIsHighContrast: (newState) =>
      set((state) => {
        state.isHighContrast = newState;
      }),
    setAccentColor: (newColor) =>
      set((state) => {
        state.accentColor = newColor;
      }),
  })),
);
