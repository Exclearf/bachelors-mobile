import { Dimensions, Modal, StyleSheet, Text, TextBase } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { CameraView, useCameraPermissions } from "expo-camera";
import { SafeAreaView } from "react-native-safe-area-context";
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

const windowDimensions = Dimensions.get("window");

const appDimensions = {
  width: windowDimensions.width,
  height: windowDimensions.height,
};

export default function RootLayout() {
  const [cameraPermission, requestPermission] = useCameraPermissions();
  const [flashOn, setFlashOn] = useState(false);
  const [isBack, setIsBack] = useState(true);
  const mode = useTranslationStore((state) => state.mode);

  useEffect(() => {
    if (!cameraPermission?.granted) requestPermission();
  }, []);

  return (
    <GestureHandlerRootView>
      <AppDimensionsContext.Provider value={appDimensions}>
        <BottomSheetProvider>
          <StatusBar
            translucent={false}
            style={"dark"}
            backgroundColor="#1e1e1e"
          />
          <SafeAreaView style={styles.container}>
            <AppRoundedPath
              zIndex={2}
              style={{ top: 10 }}
              barHeight={30}
              handlePadColor="transparent"
              pathCreator={useTopPath()}
            />
            {mode === "textToSign" && <PictureBbox />}
            <CameraView
              style={styles.cameraViewStyle}
              mode={mode === "signToText" ? "video" : "picture"}
              enableTorch={flashOn}
              facing={isBack ? "back" : "front"}
            />
            <Modal visible={false} transparent={true}>
              <CameraAccessRequest />
            </Modal>
            <CameraOverlay setFlashOn={setFlashOn} setIsBack={setIsBack} />
            <AppBottomSheet snapPoints={["11", "55", "100%"]}>
              <Slot />
            </AppBottomSheet>
          </SafeAreaView>
        </BottomSheetProvider>
      </AppDimensionsContext.Provider>
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
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
