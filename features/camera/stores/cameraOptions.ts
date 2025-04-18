import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type CameraStoreState = {
    isAvailable: boolean;
};

type CameraStoreActions = {
    setIsAvailable: (newState: boolean) => void;
};

export const useCameraOptionsStore = create<
    CameraStoreState & CameraStoreActions
>()(
    immer((set) => ({
        isAvailable: false,
        setIsAvailable: (newMode: boolean) => {
            set((state) => {
                state.isAvailable = newMode;
            });
        },
    })),
);
