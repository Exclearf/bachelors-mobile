import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type Modes = "signToText" | "textToSign";

type TranslationStoreState = {
  mode: Modes;
};

type TranslationStoreActions = {
  setMode: (newState: Modes) => void;
};

export const useTranslationStore = create<
  TranslationStoreState & TranslationStoreActions
>()(
  immer((set) => ({
    mode: "signToText",
    setMode: (newMode: Modes) => {
      set((state) => {
        state.mode = newMode;
      });
    },
  })),
);
