import { ColorSchemeName } from "react-native";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { generateTheme } from "../utils/generateTheme";
import { hexFromArgb } from "@material/material-color-utilities";

type ReplaceNumbersWithStrings<T> = {
  [K in keyof T]: T[K] extends number
    ? string
    : T[K] extends object
      ? ReplaceNumbersWithStrings<T[K]>
      : T[K];
};

type ThemeGeneratorFunction = ReturnType<typeof generateTheme>;
export type Theme = ReplaceNumbersWithStrings<ThemeGeneratorFunction>;

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
  immer((set) => ({
    theme: null,
    themeType: "dark",
    accentColor: "#00ffff",
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
    setThemeType: (newTheme) =>
      set((state) => {
        state.themeType = newTheme;
      }),
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
