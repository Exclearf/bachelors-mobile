import { useEffect, useMemo, useRef } from "react";
import { Linking, StyleSheet } from "react-native";
import {
  Camera,
  useCameraFormat,
  useCameraPermission,
} from "react-native-vision-camera";
import { useShallow } from "zustand/react/shallow";

import CameraOverlay from "./CameraOverlay";
import useCamera from "./hooks/useCamera";
import useCameraAsset from "./hooks/useCameraAsset";
import useGalleryAsset from "./hooks/useGalleryAsset";
import PictureBbox, { PictureBboxRef } from "./PictureBbox";
import { useCameraOptionsStore } from "./stores/useCameraOptions";
import ModalWindow from "../shared/components/layout/ModalWindow";
import { useAppDimensions } from "../shared/hooks/useAppDimensions";
import { ComponentSize } from "../shared/hooks/useComponentSize";
import useIsAppFocused from "../shared/hooks/useIsAppFocused";
import { useLocalization } from "../shared/hooks/useLocalization";
import { useTranslationStore } from "../translation/stores/useTranslationStore";
import CameraAccessRequestModal from "./components/modals/CameraAccessRequest";
import AssetTranslation from "../translation/components/shared/AssetTranslation";

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

  const {
    assetUri: cameraAssetUri,
    requestAsset: requestCameraAsset,
    resetAssetUri: resetCameraAssetUri,
  } = useCameraAsset(bboxRef, cameraRef, previewFrame);

  const {
    assetUri: galleryAssetUri,
    requestAsset: requestGalleryAssetUri,
    resetAssetUri: resetGalleryAssetUri,
  } = useGalleryAsset();

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  const isAppFocused = useIsAppFocused();

  const isAssetAvailable = useMemo(
    () => cameraAssetUri !== "" || galleryAssetUri !== "",
    [cameraAssetUri, galleryAssetUri],
  );

  const isCameraSource = useMemo(
    () => cameraAssetUri.length !== 0,
    [cameraAssetUri.length],
  );

  const currentSourceData = useMemo(
    () => ({
      assetUri: isCameraSource ? cameraAssetUri : galleryAssetUri,
      resetAssetUri: isCameraSource
        ? resetCameraAssetUri
        : resetGalleryAssetUri,
    }),
    [
      isCameraSource,
      cameraAssetUri,
      galleryAssetUri,
      resetCameraAssetUri,
      resetGalleryAssetUri,
    ],
  );

  return (
    <>
      <Camera
        style={[StyleSheet.absoluteFill, styles.cameraViewStyle]}
        device={currentDevice}
        isActive={isAvailable && isAppFocused && !isAssetAvailable}
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
        onCameraClick={requestCameraAsset}
        onGalleryClick={requestGalleryAssetUri}
        switchTorch={switchTorch}
        switchDevice={switchDevice}
        switchDeviceEnabled={isCameraSwitchEnabled}
      />

      <ModalWindow isOpen={!hasPermission}>
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

      <AssetTranslation
        assetUri={currentSourceData.assetUri}
        resetAssetUri={currentSourceData.resetAssetUri}
        getTranslationKey={getTranslationKey}
      />
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
