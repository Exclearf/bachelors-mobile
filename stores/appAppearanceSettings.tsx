import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type AppearanceSettingsState = {
  areBarsEnabled: any;
};

type AppearanceSettingsActions = {
  changeBarsEnabledState: any;
};

export const useAppAppearanceSettings = create<
  AppearanceSettingsState & AppearanceSettingsActions
>()(
  immer((set) => ({
    areBarsEnabled: true,
    changeBarsEnabledState: (newState: boolean) =>
      set((state) => {
        state.areBarsEnabled = newState;
      }),
  })),
);
