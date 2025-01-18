import { SplashScreen } from "expo-router";
import { useEffect } from "react";

export const useSplashScreen = (isAppLoaded: boolean) => {
  useEffect(() => {
    console.log(`useSplashScreen: isAppLoaded: ${isAppLoaded}`);
    if (isAppLoaded) {
      SplashScreen.hide();
    }
  }, [isAppLoaded]);
};
