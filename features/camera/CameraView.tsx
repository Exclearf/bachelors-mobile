import { useCallback, useEffect, useMemo, useRef } from "react";
import { Linking, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Point } from "react-native-gesture-handler/lib/typescript/web/interfaces";
import { runOnJS } from "react-native-reanimated";
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
import { useCameraOptionsStore } from "./stores/useCameraOptionsStore";
import { useAppDimensions } from "../shared/hooks/useAppDimensions";
import { ComponentSize } from "../shared/hooks/useComponentSize";
import useIsAppFocused from "../shared/hooks/useIsAppFocused";
import { useLocalization } from "../shared/hooks/useLocalization";
import log from "../shared/utils/log";
import { useTranslationStore } from "../translation/stores/useTranslationStore";
import CameraAccessRequestModal from "./components/modals/CameraAccessRequestModal";
import AssetTranslation from "../translation/components/shared/AssetTranslation";

type CameraViewProps = {
  previewFrame: ComponentSize | null;
};

const CameraView = ({ previewFrame }: CameraViewProps) => {
  const { currentDevice, switchDevice, isCameraSwitchEnabled } = useCamera(0);
  const { width, height } = useAppDimensions();
  const bboxRef = useRef<PictureBboxRef>(null);
  const mode = useTranslationStore((state) => state.mode);
  const [
    isAvailable,
    setIsAvailable,
    isTorchOn,
    switchTorch,
    exposure,
    setExposure,
    photoQualityBalance,
  ] = useCameraOptionsStore(
    useShallow((state) => [
      state.isAvailable,
      state.setIsAvailable,
      state.isTorchOn,
      state.switchTorch,
      state.exposure,
      state.setExposure,
      state.photoQualityBalance,
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
  const isAppFocused = useIsAppFocused();

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
      log.debug("Requesting camera permission");

      const tryRequest = async () => {
        const response = await requestPermission();

        setIsAvailable(response);
      };

      tryRequest();
    }
  }, [hasPermission, requestPermission, setIsAvailable]);

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

  useEffect(() => {
    if (currentDevice) {
      const maxExposure = currentDevice.maxExposure;
      const minExposure = currentDevice.minExposure;
      setExposure([
        minExposure,
        maxExposure,
        (maxExposure - Math.abs(minExposure)) / 2,
      ]);
    }
  }, [currentDevice, setExposure]);

  const focus = useCallback((point: Point) => {
    const camera = cameraRef.current;

    if (camera == null) return;

    camera.focus(point);
  }, []);

  const gesture = Gesture.Tap().onEnd(({ x, y }) => {
    runOnJS(focus)({ x, y });
  });

  const isPhoto = mode === "textToSign" ? true : false;

  return (
    <>
      <GestureDetector gesture={gesture}>
        <Camera
          style={[StyleSheet.absoluteFill, styles.cameraViewStyle]}
          device={currentDevice}
          isActive={isAvailable && isAppFocused && !isAssetAvailable}
          onInitialized={() => setIsAvailable(true)}
          ref={cameraRef}
          exposure={exposure?.[2] ?? undefined}
          torch={isTorchOn}
          format={format}
          photoQualityBalance={photoQualityBalance}
          enableZoomGesture
          video={!isPhoto}
          photo={isPhoto}
        />
      </GestureDetector>

      {mode === "textToSign" && <PictureBbox ref={bboxRef} />}

      <CameraOverlay
        onCameraClick={requestCameraAsset}
        onGalleryClick={requestGalleryAssetUri}
        switchTorch={switchTorch}
        switchDevice={switchDevice}
        switchDeviceEnabled={isCameraSwitchEnabled}
      />

      <CameraAccessRequestModal
        handler={() => {
          const tryToAskForPermission = async () => {
            const response = await requestPermission();

            if (!response) {
              Linking.openSettings();
            } else {
              setIsAvailable(response);
            }
          };
          tryToAskForPermission();
        }}
        isVisible={!hasPermission}
      />

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
