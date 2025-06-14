import {
  OpenSans_400Regular,
  OpenSans_600SemiBold,
  useFonts,
} from "@expo-google-fonts/open-sans";
import { SplashScreen } from "expo-router";
import { useEffect } from "react";

import { useCameraOptionsStore } from "@/features/camera/stores/useCameraOptionsStore";

import { useBottomSheet } from "./useBottomSheet";
import { useTheme } from "./useTheme";

export const useAppSetup = () => {
  const isCameraAvailable = useCameraOptionsStore((state) => state.isAvailable);
  const isBottomSheetRegistered = useBottomSheet().isRegistered;
  const theme = useTheme();
  const [isFontLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_600SemiBold,
  });

  const isAppReady = isBottomSheetRegistered && isFontLoaded && theme != null;

  useEffect(() => {
    if (isAppReady) {
      SplashScreen.hide();
    }
  }, [isAppReady]);
};
