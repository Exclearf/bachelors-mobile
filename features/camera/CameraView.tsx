import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  View,
  Button,
  Image,
  Linking,
  StyleSheet,
  AppState,
} from "react-native";
import {
  Camera,
  useCameraFormat,
  useCameraPermission,
} from "react-native-vision-camera";
import { useShallow } from "zustand/react/shallow";

import CameraOverlay from "./CameraOverlay";
import useBboxPhoto from "./hooks/useBboxPhoto";
import useCamera from "./hooks/useCamera";
import PictureBbox, { PictureBboxRef } from "./PictureBbox";
import { useCameraOptionsStore } from "./stores/useCameraOptions";
import ModalWindow from "../shared/components/layout/ModalWindow";
import { useAppDimensions } from "../shared/hooks/useAppDimensions";
import { ComponentSize } from "../shared/hooks/useComponentSize";
import useIsAppFocused from "../shared/hooks/useIsAppFocused";
import { useLocalization } from "../shared/hooks/useLocalization";
import { useTranslationStore } from "../translation/stores/translationStore";
import CameraAccessRequestModal from "./components/modals/CameraAccessRequest";
import TextTranslation from "../translation/components/TextTranslation";

type CameraViewProps = {
  previewFrame: ComponentSize | null;
};

const CameraView = ({ previewFrame }: CameraViewProps) => {
  const { currentDevice, switchDevice, isCameraSwitchEnabled } = useCamera(0);
  const { width, height } = useAppDimensions();
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
  const cameraRef = useRef<Camera>(null);
  const screenAspectRatio = height / width;
  const format = useCameraFormat(currentDevice, [
    { fps: 60 },
    { videoAspectRatio: screenAspectRatio },
    { videoResolution: "max" },
    { photoAspectRatio: screenAspectRatio },
    { photoResolution: "max" },
  ]);
  const { hasPermission, requestPermission } = useCameraPermission();
  const getTranslationKey = useLocalization("translation");

  // TEXT TO VIDEO
  const [photo, takePhoto, resetPhoto] = useBboxPhoto(
    bboxRef,
    cameraRef,
    previewFrame,
  );

  // VIDEO TO TEXT W.I.P.

  const takeVideo = useCallback(() => console.log("Taking video"), []);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  const isAppFocused = useIsAppFocused();

  const onCameraClick = useMemo(
    () => (mode === "textToSign" ? takePhoto : takeVideo),
    [mode, takeVideo, takePhoto],
  );

  return (
    <>
      <Camera
        style={[StyleSheet.absoluteFill, styles.cameraViewStyle]}
        device={currentDevice}
        isActive={isAvailable && isAppFocused}
        onInitialized={() => setIsAvailable(true)}
        ref={cameraRef}
        torch={isTorchOn}
        format={format}
        video={true}
        photoQualityBalance="quality"
        photo={true}
      />

      {mode === "textToSign" && <PictureBbox ref={bboxRef} />}

      <CameraOverlay
        onCameraClick={onCameraClick}
        switchTorch={switchTorch}
        switchDevice={switchDevice}
        switchDeviceEnabled={isCameraSwitchEnabled}
      />

      <ModalWindow isOpen={!hasPermission && !isAvailable}>
        <CameraAccessRequestModal
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
      </ModalWindow>

      {mode === "textToSign" ? (
        <TextTranslation
          photo={photo ?? ""}
          resetPhoto={resetPhoto}
          getTranslationKey={getTranslationKey}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default CameraView;

const styles = StyleSheet.create({
  cameraViewStyle: {
    flex: 1,
    zIndex: -1,
  },
});
