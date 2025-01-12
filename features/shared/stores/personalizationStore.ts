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

type Theme = ReturnType<typeof generateTheme>;

type PersonalizationState = {
  theme: ReplaceNumbersWithStrings<Theme> | {};
  themeType: ColorSchemeName;
  isHighContrast: boolean;
  accentColor: string;
};

type PersonalizationActions = {
  setTheme: (newTheme: Theme) => void;
  setThemeType: (newTheme: ColorSchemeName) => void;
  setIsHighContrast: (newState: boolean) => void;
  setAccentColor: (newColor: string) => void;
};

export const usePersonalizationStore = create<
  PersonalizationState & PersonalizationActions
>()(
  immer((set) => ({
    theme: {},
    themeType: "dark",
    accentColor: "#00ffff",
    isHighContrast: false,
    setTheme: (newTheme) =>
      set((state) => {
        state.theme = {};
        for (const [key, value] of Object.entries(newTheme)) {
          // TODO: Fix this
          //@ts-expect-error It's really late and I'm tired
          state.theme[key as keyof typeof newTheme] = hexFromArgb(
            Number(value),
          );
          console.log(state.theme.primary);
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
