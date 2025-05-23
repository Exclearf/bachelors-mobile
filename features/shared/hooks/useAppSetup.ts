import {
  OpenSans_400Regular,
  OpenSans_600SemiBold,
  useFonts,
} from "@expo-google-fonts/open-sans";
import { SplashScreen } from "expo-router";
import { useEffect } from "react";

import { useCameraOptionsStore } from "@/features/camera/stores/useCameraOptions";
import { usePersonalizationStore } from "@/features/settings/stores/personalizationStore";

import { useBottomSheet } from "./useBottomSheet";

export const useAppSetup = () => {
  const isCameraAvailable = useCameraOptionsStore((state) => state.isAvailable);
  const isBottomSheetRegistered = useBottomSheet().isRegistered;
  const theme = usePersonalizationStore((state) => state.theme);
  const [isFontLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_600SemiBold,
  });

  const isAppReady =
    isCameraAvailable &&
    isBottomSheetRegistered &&
    isFontLoaded &&
    theme != null;

  useEffect(() => {
    if (isAppReady) {
      SplashScreen.hide();
    }
  }, [isAppReady]);
};
