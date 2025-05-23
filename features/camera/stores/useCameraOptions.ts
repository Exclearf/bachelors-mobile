import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type TorchState = "on" | "off";

type CameraStoreState = {
  isAvailable: boolean;
  isTorchOn: TorchState;
};

type CameraStoreActions = {
  setIsAvailable: (newState: boolean) => void;
  switchTorch: () => void;
};

export const useCameraOptionsStore = create<
  CameraStoreState & CameraStoreActions
>()(
  immer((set, get) => ({
    isAvailable: false,
    isTorchOn: "off",
    setIsAvailable: (newMode) => {
      set((state) => {
        state.isAvailable = newMode;
      });
    },
    switchTorch: () => {
      set((state) => {
        state.isTorchOn = get().isTorchOn === "off" ? "on" : "off";
      });
    },
  })),
);
