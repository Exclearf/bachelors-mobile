import { useCameraOptionsStore } from "@/features/camera/stores/cameraOptions";
import { useBottomSheet } from "./useBottomSheet";
import { useEffect } from "react";
import { usePersonalizationStore } from "@/features/settings/stores/personalizationStore";
import { SplashScreen } from "expo-router";

import {
  useFonts,
  OpenSans_400Regular,
  OpenSans_600SemiBold,
} from "@expo-google-fonts/open-sans";

export const useAppSetup = () => {
  const isCameraAvailable = useCameraOptionsStore((state) => state.isAvailable);
  const isBottomSheetRegistered = useBottomSheet().isRegistered;
  const theme = usePersonalizationStore((state) => state.theme);
  const [isFontLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_600SemiBold,
  });

  const isAppLoaded = [
    isCameraAvailable,
    isBottomSheetRegistered,
    isFontLoaded,
  ];

  useEffect(() => {
    if (isAppLoaded.every((loaded) => loaded) && theme != null) {
      SplashScreen.hide();
    }
  }, [...isAppLoaded, theme]);
};
