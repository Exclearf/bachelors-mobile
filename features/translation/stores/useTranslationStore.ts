import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { ToggleItemType } from "@/features/shared/components/input/ToggleGroup";

import { Gloss, TranslatedText } from "../utils/types";

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
  activeTextTranslationResult: TranslatedText | null;
  videoTranslationResults: Gloss[][] | null;
  textTranslationResults: TranslatedText[] | null;
};

type TranslationStoreActions = {
  setMode: (newState: Modes) => void;
  setModel: (newModel: Model) => void;
  setCurrentLanguage: (newLanguage: LanguageItem) => void;
  clearActiveVideoTranslationResult: () => void;
  removeVideoTranslationFromHistory: (video: Gloss[]) => void;
  addVideoTranslationResult: (result: Gloss[]) => void;
  clearActiveTextTranslationResult: () => void;
  removeTextTranslationFromHistory: (text: TranslatedText) => void;
  addTextTranslationResult: (result: TranslatedText) => void;
};

//TODO: Extract into 2 stores and merge here
export const useTranslationStore = create<
  TranslationStoreState & TranslationStoreActions
>()(
  immer((set, get) => ({
    mode: "signToText",
    model: null,
    videoTranslationResults: null,
    textTranslationResults: null,
    activeVideoTranslationResult: null,
    activeTextTranslationResult: null,
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
    removeVideoTranslationFromHistory(video) {
      set((state) => {
        state.videoTranslationResults =
          state.videoTranslationResults?.filter(
            (item) => item[0].id !== video[0].id,
          ) ?? null;
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
    addTextTranslationResult: (result) => {
      const { activeTextTranslationResult, clearActiveTextTranslationResult } =
        get();

      if (activeTextTranslationResult != null) {
        clearActiveTextTranslationResult();
      }

      set((state) => {
        state.activeTextTranslationResult = result;
      });
    },
    removeTextTranslationFromHistory(text) {
      set((state) => {
        state.textTranslationResults =
          state.textTranslationResults?.filter((item) => item.id !== text.id) ??
          null;
      });
    },
    clearActiveTextTranslationResult: () => {
      const { activeTextTranslationResult } = get();

      set((state) => {
        state.textTranslationResults = [
          activeTextTranslationResult!,
          ...(state.textTranslationResults ?? []),
        ];
      });

      set((state) => {
        state.activeTextTranslationResult = null;
      });
    },
  })),
);
