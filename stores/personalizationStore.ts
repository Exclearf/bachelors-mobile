import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type AvailableThemes = "dark" | "light";

type PersonalizationState = {
  theme: AvailableThemes;
  isHighContrast: boolean;
};

type PersonalizationActions = {
  setTheme: (newTheme: AvailableThemes) => void;
  setIsHighContrast: (newState: boolean) => void;
};

export const usePersonalizationStore = create<
  PersonalizationState & PersonalizationActions
>()(
  immer((set) => ({
    theme: "dark",
    isHighContrast: false,
    setTheme: (newTheme) =>
      set((state) => {
        state.theme = newTheme;
      }),
    setIsHighContrast: (newState) =>
      set((state) => {
        state.isHighContrast = newState;
      }),
  })),
);
