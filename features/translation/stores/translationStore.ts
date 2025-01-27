import { ToggleItemType } from "@/features/shared/components/input/ToggleGroup";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type Modes = "signToText" | "textToSign";

export const AvailableModels = {
  vivit: "vivit",
  timesformer: "timesformer",
};

export type Model = keyof typeof AvailableModels | null;

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
  model: Model;
  currentLanguage: LanguageItem;
  availableLanguages: typeof availableLanguages;
};

type TranslationStoreActions = {
  setMode: (newState: Modes) => void;
  setModel: (newModel: Model) => void;
  setCurrentLanguage: (newLanguage: LanguageItem) => void;
};

export const useTranslationStore = create<
  TranslationStoreState & TranslationStoreActions
>()(
  immer((set) => ({
    mode: "signToText",
    model: null,
    availableLanguages,
    currentLanguage: availableLanguages[0],
    setCurrentLanguage: (newLanguage: LanguageItem) => {
      set((state) => {
        state.currentLanguage = newLanguage;
      });
    },
    setModel: (newModel: Model) => {
      set((state) => {
        state.model = newModel;
      });
    },
    setMode: (newMode: Modes) => {
      set((state) => {
        state.mode = newMode;
      });
    },
  })),
);
