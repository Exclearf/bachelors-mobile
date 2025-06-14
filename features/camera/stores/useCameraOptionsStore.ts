import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type TorchState = "on" | "off";

export type PhotoQualityBalance = "speed" | "balanced" | "quality";

type CameraStoreState = {
  isAvailable: boolean;
  isTorchOn: TorchState;
  photoQualityBalance: PhotoQualityBalance;
  isFetching: boolean;
  exposure: [number, number, number] | null;
};

type CameraStoreActions = {
  setIsAvailable: (newState: boolean) => void;
  switchTorch: () => void;
  setPhotoQualityBalance: (photoQuality: PhotoQualityBalance) => void;
  setIsFetching: (newState: boolean) => void;
  setExposure: (exposure: [number, number, number]) => void;
};

export const useCameraOptionsStore = create<
  CameraStoreState & CameraStoreActions
>()(
  immer((set, get) => ({
    isAvailable: false,
    isTorchOn: "off",
    exposure: null,
    isFetching: false,
    photoQualityBalance: "balanced",
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
    setPhotoQualityBalance(photoQuality) {
      set((state) => {
        state.photoQualityBalance = photoQuality;
      });
    },
    setIsFetching(newState) {
      set((state) => {
        state.isFetching = newState;
      });
    },
    setExposure(exposure) {
      set((state) => {
        state.exposure = exposure;
      });
    },
  })),
);
