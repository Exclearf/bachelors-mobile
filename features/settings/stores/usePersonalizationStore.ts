import { hexFromArgb } from "@material/material-color-utilities";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ColorSchemeName } from "react-native";
import { colorKit } from "reanimated-color-picker";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import log from "@/features/shared/utils/log";

import {
  generateTheme,
  getSaturation,
  setSaturation,
} from "../../shared/utils/themes";

export type FontSize = {
  regular: number;
  medium: number;
  large: number;
};

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
  fontSize: FontSize;
  fontScale: number;
  themeType: ColorSchemeName;
  isHighContrast: boolean;
  accentColor: string;
};

type PersonalizationActions = {
  setTheme: (newTheme: ThemeGeneratorFunction) => void;
  setFontScale: (newScale: number) => void;
  setThemeType: (newTheme: ColorSchemeName) => void;
  setIsHighContrast: (newState: boolean) => void;
  setAccentColor: (newColor: string) => void;
  getIconSize: () => number;
};

const baseFontSize = {
  regular: 16,
  medium: 18,
  large: 22,
};

export const usePersonalizationStore = create<
  PersonalizationState & PersonalizationActions
>()(
  persist(
    immer((set, get) => ({
      theme: null,
      fontSize: baseFontSize,
      fontScale: 1,
      themeType: null,
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
      setFontScale: (newScale) => {
        set((state) => {
          state.fontScale = newScale;
          state.fontSize = {
            regular: baseFontSize.regular * newScale,
            medium: baseFontSize.medium * newScale,
            large: baseFontSize.large * newScale,
          };
        });
      },
      setThemeType: (newTheme) => {
        let newAccentColor = get().accentColor;
        if (newTheme === "dark") {
          log.debug("Dark theme");
          const saturation = getSaturation(newAccentColor);
          newAccentColor = setSaturation(newAccentColor, 100);
          newAccentColor = colorKit
            .setBrightness(newAccentColor, saturation)
            .hsv()
            .string();
        } else {
          log.debug("Light theme");
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
      getIconSize() {
        const { fontSize, fontScale } = get();
        return fontScale * fontSize.regular;
      },
      setAccentColor: (newColor) =>
        set((state) => {
          state.accentColor = newColor;
        }),
    })),
    {
      name: "personalization-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
