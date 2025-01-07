import { Dimensions, Modal, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect, useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  CameraView,
  PermissionStatus,
  useCameraPermissions,
} from "expo-camera";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AppDimensionsContext } from "@/contexts/appDimensions";
import AppRoundedPath from "@/components/common/AppRoundedPath";
import { useTopPath } from "@/utils/roundedPathCreators";
import { Slot } from "expo-router";
import { useTranslationStore } from "@/stores/translationStore";
import { useCameraOptionsStore } from "@/stores/cameraOptions";
import * as Linking from "expo-linking";
import { useShallow } from "zustand/react/shallow";
import initiateLocalization from "@/i18n/i18n"; // Side-effect import
import { PersonalizationProvider } from "@/components/providers/PersonalizationProvider";
import BottomSheetProvider from "@/components/providers/BottomSheetProvider";
import PictureBbox from "@/components/camera/containers/PictureBbox";
import AppBottomSheet from "@/components/bottomSheet/BottomSheet";
import CameraOverlay from "@/components/camera/CameraOverlay";
import CameraAccessRequest from "@/components/camera/containers/CameraAccessRequest";

initiateLocalization();

const windowDimensions = Dimensions.get("window");

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

  return (
    <GestureHandlerRootView>
      <PersonalizationProvider>
        <SafeAreaProvider
          style={{
            backgroundColor: "#1e1e1e",
            width: windowDimensions.width,
            height: windowDimensions.height,
          }}
        >
          <AppDimensionsContext.Provider value={windowDimensions}>
            <BottomSheetProvider>
              <StatusBar
                translucent={false}
                style={"dark"}
                backgroundColor="#1e1e1e"
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
          </AppDimensionsContext.Provider>
        </SafeAreaProvider>
      </PersonalizationProvider>
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
