import { ToggleItemType } from "@/features/shared/components/input/ToggleGroup";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type Modes = "signToText" | "textToSign";

const availableLanguages: ToggleItemType[] = [
  {
    id: "en-US",
    title: "English (US)",
  },
  {
    id: "pl-PL",
    title: "Polski",
  },
];

type LanguageItem = (typeof availableLanguages)[number];

type TranslationStoreState = {
  mode: Modes;
  currentLanguage: LanguageItem;
  setCurrentLanguage: (newLanguage: LanguageItem) => void;
  availableLanguages: typeof availableLanguages;
};

type TranslationStoreActions = {
  setMode: (newState: Modes) => void;
};

export const useTranslationStore = create<
  TranslationStoreState & TranslationStoreActions
>()(
  immer((set) => ({
    mode: "signToText",
    availableLanguages,
    currentLanguage: availableLanguages[0],
    setCurrentLanguage: (newLanguage: LanguageItem) => {
      set((state) => {
        state.currentLanguage = newLanguage;
      });
    },
    setMode: (newMode: Modes) => {
      set((state) => {
        state.mode = newMode;
      });
    },
  })),
);
