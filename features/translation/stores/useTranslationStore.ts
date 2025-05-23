import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { ToggleItemType } from "@/features/shared/components/input/ToggleGroup";

import { Gloss } from "../utils/types";

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
  activeVideoTranslationResult: Gloss[] | null;
  videoTranslationResults: Gloss[][] | null;
};

type TranslationStoreActions = {
  setMode: (newState: Modes) => void;
  setModel: (newModel: Model) => void;
  setCurrentLanguage: (newLanguage: LanguageItem) => void;
  clearActiveVideoTranslationResult: () => void;
  addVideoTranslationResult: (result: Gloss[]) => void;
};

export const useTranslationStore = create<
  TranslationStoreState & TranslationStoreActions
>()(
  immer((set, get) => ({
    mode: "signToText",
    model: null,
    videoTranslationResults: null,
    activeVideoTranslationResult: null,
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
    addVideoTranslationResult: (result) => {
      const {
        activeVideoTranslationResult,
        clearActiveVideoTranslationResult,
      } = get();

      if (activeVideoTranslationResult != null)
        clearActiveVideoTranslationResult();

      set((state) => {
        state.activeVideoTranslationResult = result;
      });
    },
    clearActiveVideoTranslationResult: () => {
      const { activeVideoTranslationResult } = get();

      set((state) => {
        state.videoTranslationResults = [
          activeVideoTranslationResult!,
          ...(state.videoTranslationResults ?? []),
        ];
      });

      set((state) => {
        state.activeVideoTranslationResult = null;
      });
    },
  })),
);
