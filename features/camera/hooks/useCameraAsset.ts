import * as ImageManipulator from "expo-image-manipulator";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { Camera, Orientation } from "react-native-vision-camera";
import { useShallow } from "zustand/react/shallow";

import { ComponentSize } from "@/features/shared/hooks/useComponentSize";
import log from "@/features/shared/utils/log";
import { useTranslationStore } from "@/features/translation/stores/useTranslationStore";

import { UseAssetFetcher } from "../misc/types";
import { PictureBboxRef } from "../PictureBbox";
import { useCameraOptionsStore } from "../stores/useCameraOptionsStore";

const useCameraAsset = (
  pictureBboxRef: RefObject<PictureBboxRef | null>,
  cameraRef: RefObject<Camera | null>,
  previewFrame: ComponentSize | null,
) => {
  const [assetUri, setAssetUri] = useState<string>("");
  const isTakingPhoto = useRef(false);
  const mode = useTranslationStore((state) => state.mode);
  const [isFetching, setIsFetching] = useCameraOptionsStore(
    useShallow((state) => [state.isFetching, state.setIsFetching]),
  );
  const frameRef = useRef<ComponentSize | null>(null);

  useEffect(() => {
    frameRef.current = previewFrame;
  }, [previewFrame]);

  const takePhoto = useCallback(async () => {
    const frame = frameRef.current;

    if (isTakingPhoto.current || !frame || assetUri.length !== 0) return;

    try {
      isTakingPhoto.current = true;

      const { width: pW, height: pH } = frame;

      const pictureBbox = pictureBboxRef.current!;
      const topLeft = pictureBbox.topLeft;
      const bottomRight = pictureBbox.bottomRight;

      const pic = await cameraRef.current!.takePhoto();

      const ratioX = pic.height / pW;
      const ratioY = pic.width / pH;

      const focusBox = {
        x: topLeft.x.get(),
        y: topLeft.y.get(),
        width: bottomRight.x.get() - topLeft.x.get(),
        height: bottomRight.y.get() - topLeft.y.get(),
      };

      const crop = {
        originX: Math.floor(focusBox.x * ratioX),
        originY: Math.floor(focusBox.y * ratioY),
        width: Math.floor(focusBox.width * ratioX),
        height: Math.floor(focusBox.height * ratioY),
      };

      const uri = pic.path.startsWith("file:")
        ? pic.path
        : `file://${pic.path}`;

      const needsRotate = pic.orientation !== "portrait";

      const rotateByOrientation = (orientation: Orientation) => {
        switch (orientation) {
          case "landscape-right":
            return -90;
          case "landscape-left":
            return 90;
          case "portrait-upside-down":
            return 180;
          default:
            return 0;
        }
      };

      const actions = needsRotate
        ? [
            { rotate: -rotateByOrientation(pic.orientation) },
            { crop },
            { rotate: rotateByOrientation(pic.orientation) },
          ]
        : [{ crop }];

      const result = await ImageManipulator.manipulateAsync(uri, actions, {
        compress: 1,
        format: ImageManipulator.SaveFormat.JPEG,
      });

      setAssetUri(result.uri + `?t=${Date.now()}`);
    } catch (e) {
      log.error("Error in takePhoto:", e);
    } finally {
      isTakingPhoto.current = false;
    }
  }, [cameraRef, pictureBboxRef, assetUri.length]);

  const takeVideo = () => {
    if (isFetching) {
      cameraRef?.current?.stopRecording();
    } else {
      cameraRef.current!.startRecording({
        fileType: "mp4",
        videoCodec: "h265",
        onRecordingFinished: (video) => {
          setAssetUri(video.path);
        },
        onRecordingError(error) {
          log.warn(error);
        },
      });
    }

    setIsFetching(!isFetching);
  };

  useEffect(() => {
    setIsFetching(false);

    const cancelRecording = async () => {
      await cameraRef?.current?.cancelRecording();
    };
  }, [mode]);

  const requestAsset = mode === "textToSign" ? takePhoto : takeVideo;

  const resetAssetUri = () => setAssetUri("");

  return { assetUri, requestAsset, resetAssetUri } as UseAssetFetcher;
};

export default useCameraAsset;
