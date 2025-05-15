import Constants from "expo-constants";
import * as Linking from "expo-linking";
import { Slot, SplashScreen } from "expo-router";
import { useEffect, useRef } from "react";
import { Modal, StyleSheet, View, Image, Button } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Camera, useCameraPermission } from "react-native-vision-camera";
import { useShallow } from "zustand/react/shallow";

import CameraOverlay from "@/features/camera/CameraOverlay";
import CameraAccessRequest from "@/features/camera/components/modals/CameraAccessRequest";
import useBboxPhoto from "@/features/camera/hooks/useBboxPhoto";
import useCamera from "@/features/camera/hooks/useCamera";
import PictureBbox, { PictureBboxRef } from "@/features/camera/PictureBbox";
import { useCameraOptionsStore } from "@/features/camera/stores/useCameraOptions";
import { usePersonalizationStore } from "@/features/settings/stores/personalizationStore";
import AppBottomSheet from "@/features/shared/components/layout/AppBottomSheet";
import AppRoundedPath from "@/features/shared/components/primitive/AppRoundedPath";
import AppDimensionsProvider from "@/features/shared/components/provider/AppDimensionsProvider";
import BottomSheetProvider from "@/features/shared/components/provider/BottomSheetProvider";
import ThemeProvider from "@/features/shared/components/provider/ThemeProvider";
import { useAppDimensions } from "@/features/shared/hooks/useAppDimensions";
import {
  maxTopPath,
  minTopPath,
} from "@/features/shared/utils/roundedPathCreators";
import initiateLocalization from "@/features/translation/i18n/i18n"; // Side-effect import
import { useTranslationStore } from "@/features/translation/stores/translationStore";

initiateLocalization();

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const { currentDevice, switchDevice, isCameraSwitchEnabled } = useCamera(0);
  const cameraRef = useRef<Camera>(null);
  const bboxRef = useRef<PictureBboxRef>(null);
  const mode = useTranslationStore((state) => state.mode);
  const [isAvailable, setIsAvailable, isTorchOn, switchTorch] =
    useCameraOptionsStore(
      useShallow((state) => [
        state.isAvailable,
        state.setIsAvailable,
        state.isTorchOn,
        state.switchTorch,
      ]),
    );
  const { width, height } = useAppDimensions();
  const theme = usePersonalizationStore((state) => state.theme);
  const statusBarHeight = Constants.statusBarHeight;
  const [photo, takePhoto, resetPhoto] = useBboxPhoto(bboxRef, cameraRef);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

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
            <View
              style={[styles.container, { backgroundColor: theme?.background }]}
            >
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

              {mode === "textToSign" && <PictureBbox ref={bboxRef} />}

              <Camera
                style={styles.cameraViewStyle}
                device={currentDevice}
                isActive={isAvailable}
                onInitialized={() => setIsAvailable(true)}
                ref={cameraRef}
                torch={isTorchOn}
                video={true}
                photo={true}
              />

              <CameraOverlay
                onCameraClick={() => {
                  console.log("Taking photo");
                  takePhoto();
                }}
                switchTorch={switchTorch}
                switchDevice={switchDevice}
                switchDeviceEnabled={isCameraSwitchEnabled}
              />

              <AppBottomSheet snapPoints={["11", "53", "100%"]}>
                <Slot />
              </AppBottomSheet>
            </View>

            <Modal
              visible={!hasPermission && !isAvailable}
              animationType="none"
              transparent={true}
            >
              <CameraAccessRequest
                handler={() => {
                  const tryToAskForPermission = async () => {
                    const response = await requestPermission();

                    if (!response) {
                      Linking.openSettings();
                    }
                  };
                  tryToAskForPermission();
                }}
              />
            </Modal>
            <Modal visible={photo?.length !== 0 && photo != null}>
              <Image source={{ uri: photo! }} style={{ flex: 1 }} />
              <Button title="123" onPress={() => resetPhoto()} />
            </Modal>
          </BottomSheetProvider>
        </ThemeProvider>
      </AppDimensionsProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  cameraViewStyle: {
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
