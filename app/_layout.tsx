import Constants from "expo-constants";
import { Slot, SplashScreen } from "expo-router";
import { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import CameraView from "@/features/camera/CameraView";
import { usePersonalizationStore } from "@/features/settings/stores/usePersonalizationStore";
import AppBottomSheet from "@/features/shared/components/layout/AppBottomSheet";
import AppRoundedPath from "@/features/shared/components/primitive/AppRoundedPath";
import AppDimensionsProvider from "@/features/shared/components/provider/AppDimensionsProvider";
import BottomSheetProvider from "@/features/shared/components/provider/BottomSheetProvider";
import ThemeProvider from "@/features/shared/components/provider/ThemeProvider";
import useComponentSize from "@/features/shared/hooks/useComponentSize";
import {
  maxTopPath,
  minTopPath,
} from "@/features/shared/utils/svgPathCreators";
import initiateLocalization from "@/features/translation/i18n/i18n"; // Side-effect import

initiateLocalization();

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const theme = usePersonalizationStore((state) => state.theme);
  const statusBarHeight = Constants.statusBarHeight;
  const previewRef = useRef<View>(null);
  const previewFrame = useComponentSize(previewRef);

  const syncAuth = useAuthStore((state) => state.syncAuth);

  useEffect(() => {
    syncAuth();
  }, [syncAuth]);

  return (
    <GestureHandlerRootView>
      <AppDimensionsProvider>
        <ThemeProvider>
          <BottomSheetProvider>
            <View
              style={{
                backgroundColor: theme?.background,
                height: statusBarHeight,
                width: "100%",
              }}
            />
            <View ref={previewRef} style={[styles.container]}>
              <AppRoundedPath
                zIndex={1}
                style={{
                  top: -10,
                  position: "absolute",
                }}
                barHeight={30}
                handlePadColorOverride="transparent"
                maxPathCreator={maxTopPath}
                minPathCreator={minTopPath}
              />

              <CameraView previewFrame={previewFrame} />

              <AppBottomSheet snapPoints={["11", "53", "100%"]}>
                <Slot />
              </AppBottomSheet>
            </View>
          </BottomSheetProvider>
        </ThemeProvider>
      </AppDimensionsProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: -1,
    display: "flex",
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },
});
