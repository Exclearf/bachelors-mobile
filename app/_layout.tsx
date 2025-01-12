import { Modal, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect, useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  CameraView,
  PermissionStatus,
  useCameraPermissions,
} from "expo-camera";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Slot } from "expo-router";
import { useTranslationStore } from "@/features/settings/stores/translationStore";
import { useCameraOptionsStore } from "@/features/camera/stores/cameraOptions";
import * as Linking from "expo-linking";
import { useShallow } from "zustand/react/shallow";
import initiateLocalization from "@/features/translation/i18n/i18n"; // Side-effect import
import AppRoundedPath from "@/features/shared/components/animated/AppRoundedPath";
import PictureBbox from "@/features/camera/PictureBbox";
import CameraOverlay from "@/features/camera/CameraOverlay";
import AppBottomSheet from "@/features/shared/components/layout/AppBottomSheet";
import CameraAccessRequest from "@/features/camera/components/modals/CameraAccessRequest";
import BottomSheetProvider from "@/features/shared/providers/BottomSheetProvider";
import { useTopPath } from "@/features/shared/utils/roundedPathCreators";
import AppDimensionsProvider from "@/features/shared/providers/AppDimensionsProvider";
import ThemeProvider from "@/features/shared/providers/ThemeProvider";
import { usePersonalizationStore } from "@/features/shared/stores/personalizationStore";

initiateLocalization();

export default function RootLayout() {
  const [cameraPermission, requestPermission] = useCameraPermissions();
  const [flashOn, setFlashOn] = useState(false);
  const [isBack, setIsBack] = useState(true);
  const cameraRef = useRef<CameraView>(null);
  const mode = useTranslationStore((state) => state.mode);
  const [isAvailable, setIsAvailable] = useCameraOptionsStore(
    useShallow((state) => [state.isAvailable, state.setIsAvailable]),
  );

  useEffect(() => {
    if (!cameraPermission?.granted || cameraPermission?.canAskAgain) {
      requestPermission();
    }
  }, []);

  const theme = usePersonalizationStore((state) => state.theme);

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
              <SafeAreaView style={[styles.container]}>
                <AppRoundedPath
                  zIndex={2}
                  style={{ top: 10 }}
                  barHeight={30}
                  handlePadColor="transparent"
                  pathCreator={useTopPath()}
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

                <AppBottomSheet snapPoints={["11", "55", "100%"]}>
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
