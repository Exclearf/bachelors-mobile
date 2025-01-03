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
import AppRoundedPath from "@/components/utils/AppRoundedPath";
import { useTopPath } from "@/utils/roundedPathCreators";
import { Slot } from "expo-router";
import AppBottomSheet from "@/components/bottomSheet/bottomSheet";
import CameraOverlay from "@/components/camera/cameraOverlay";
import BottomSheetProvider from "@/components/providers/bottomSheetProvider";
import { useTranslationStore } from "@/stores/translationStore";
import CameraAccessRequest from "@/components/camera/containers/cameraAccessRequest";
import PictureBbox from "@/components/camera/containers/pictureBbox";
import { useCameraOptions } from "@/stores/cameraOptions";
import * as Linking from "expo-linking";
import { useShallow } from "zustand/react/shallow";

const windowDimensions = Dimensions.get("window");

const appDimensions = {
  width: windowDimensions.width,
  height: windowDimensions.height,
};

export default function RootLayout() {
  const [cameraPermission, requestPermission] = useCameraPermissions();
  const [flashOn, setFlashOn] = useState(false);
  const [isBack, setIsBack] = useState(true);
  const cameraRef = useRef<CameraView>(null);
  const mode = useTranslationStore((state) => state.mode);
  const [isAvailable, setIsAvailable] = useCameraOptions(
    useShallow((state) => [state.isAvailable, state.setIsAvailable]),
  );

  useEffect(() => {
    if (!cameraPermission?.granted || cameraPermission?.canAskAgain) {
      requestPermission();
    }
  }, []);

  return (
    <GestureHandlerRootView>
      <SafeAreaProvider
        style={{
          backgroundColor: "#1e1e1e",
          width: windowDimensions.width,
          height: windowDimensions.height,
        }}
      >
        <AppDimensionsContext.Provider value={appDimensions}>
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
