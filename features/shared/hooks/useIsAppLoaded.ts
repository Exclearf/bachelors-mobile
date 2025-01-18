import { useCameraOptionsStore } from "@/features/camera/stores/cameraOptions";
import { useBottomSheet } from "./useBottomSheet";
import { useEffect, useState } from "react";
import { usePersonalizationStore } from "@/features/settings/stores/personalizationStore";

export const useIsAppLoaded = () => {
  const isCameraAvailable = useCameraOptionsStore((state) => state.isAvailable);
  const isBottomSheetRegistered = useBottomSheet().isRegistered;
  const theme = usePersonalizationStore((state) => state.theme);
  const [isFontLoaded, setIsFontLoaded] = useState(true);

  const isAppLoaded = [
    isCameraAvailable,
    isBottomSheetRegistered,
    theme != null,
    isFontLoaded,
  ];

  return isAppLoaded.every((item) => item);
};
