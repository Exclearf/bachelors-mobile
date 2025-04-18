import {
  CameraView,
  PermissionStatus,
  useCameraPermissions,
} from "expo-camera";
import * as Linking from "expo-linking";
import * as NavigationBar from "expo-navigation-bar";
import { Slot, SplashScreen } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useShallow } from "zustand/react/shallow";

import CameraOverlay from "@/features/camera/CameraOverlay";
import CameraAccessRequest from "@/features/camera/components/modals/CameraAccessRequest";
import PictureBbox from "@/features/camera/PictureBbox";
import { useCameraOptionsStore } from "@/features/camera/stores/cameraOptions";
import { usePersonalizationStore } from "@/features/settings/stores/personalizationStore";
import AppRoundedPath from "@/features/shared/components/animated/AppRoundedPath";
import AppBottomSheet from "@/features/shared/components/layout/AppBottomSheet";
import AppDimensionsProvider from "@/features/shared/components/providers/AppDimensionsProvider";
import BottomSheetProvider from "@/features/shared/components/providers/BottomSheetProvider";
import ThemeProvider from "@/features/shared/components/providers/ThemeProvider";
import {
  maxTopPath,
  minTopPath,
} from "@/features/shared/utils/roundedPathCreators";
import initiateLocalization from "@/features/translation/i18n/i18n"; // Side-effect import
import { useTranslationStore } from "@/features/translation/stores/translationStore";

initiateLocalization();

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [cameraPermission, requestPermission] = useCameraPermissions();
  const [flashOn, setFlashOn] = useState(false);
  const [isBack, setIsBack] = useState(true);
  const cameraRef = useRef<CameraView>(null);
  const mode = useTranslationStore((state) => state.mode);
  const [isAvailable, setIsAvailable] = useCameraOptionsStore(
    useShallow((state) => [state.isAvailable, state.setIsAvailable]),
  );
  const theme = usePersonalizationStore((state) => state.theme);

  useEffect(() => {
    if (!cameraPermission?.granted || cameraPermission?.canAskAgain) {
      requestPermission();
    }

    const hideNavBar = async () => {
      await NavigationBar.setVisibilityAsync("hidden");
      await NavigationBar.setBehaviorAsync("overlay-swipe");
    };

    hideNavBar();
  }, []);

  return (
    <GestureHandlerRootView>
      <AppDimensionsProvider>
        <ThemeProvider>
          <SafeAreaProvider>
            <BottomSheetProvider>
              <StatusBar
                translucent={false}
                style={"dark"}
                backgroundColor={theme?.background}
              />
              <SafeAreaView
                style={[
                  styles.container,
                  { backgroundColor: theme?.background },
                ]}
              >
                <AppRoundedPath
                  zIndex={2}
                  style={{ top: 10 }}
                  barHeight={30}
                  handlePadColor="transparent"
                  maxPathCreator={maxTopPath}
                  minPathCreator={minTopPath}
                />

                {mode === "textToSign" && <PictureBbox />}

                <CameraView
                  ref={cameraRef}
                  style={styles.cameraViewStyle}
                  mode={mode === "signToText" ? "video" : "picture"}
                  enableTorch={flashOn}
                  onCameraReady={() => setIsAvailable(true)}
                  facing={isBack ? "back" : "front"}
                />

                <CameraOverlay setFlashOn={setFlashOn} setIsBack={setIsBack} />

                <AppBottomSheet snapPoints={["11", "53", "100%"]}>
                  <Slot />
                </AppBottomSheet>
              </SafeAreaView>

              <Modal
                visible={
                  cameraPermission?.status === PermissionStatus.DENIED &&
                  !cameraPermission.canAskAgain &&
                  !isAvailable
                }
                animationType="none"
                transparent={true}
              >
                <CameraAccessRequest
                  handler={() => {
                    const tryToAskForPermission = async () => {
                      const response = await requestPermission();

                      if (!response.granted && !response.canAskAgain) {
                        Linking.openSettings();
                      }
                    };
                    tryToAskForPermission();
                  }}
                />
              </Modal>
            </BottomSheetProvider>
          </SafeAreaProvider>
        </ThemeProvider>
      </AppDimensionsProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  cameraViewStyle: {
    top: -30,
    width: "100%",
    height: "100%",
    zIndex: -1,
  },
  container: {
    flex: 1,
    zIndex: -1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
