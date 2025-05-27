import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type TorchState = "on" | "off";

type CameraStoreState = {
  isAvailable: boolean;
  isTorchOn: TorchState;
  isFetching: boolean;
};

type CameraStoreActions = {
  setIsAvailable: (newState: boolean) => void;
  switchTorch: () => void;
  setIsFetching: (newState: boolean) => void;
};

export const useCameraOptionsStore = create<
  CameraStoreState & CameraStoreActions
>()(
  immer((set, get) => ({
    isAvailable: false,
    isTorchOn: "off",
    isFetching: false,
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
    setIsFetching(newState) {
      set((state) => {
        state.isFetching = newState;
      });
    },
  })),
);
