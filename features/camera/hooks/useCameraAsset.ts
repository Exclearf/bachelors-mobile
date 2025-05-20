import * as ImageManipulator from "expo-image-manipulator";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { Camera } from "react-native-vision-camera";

import { ComponentSize } from "@/features/shared/hooks/useComponentSize";
import log from "@/features/shared/utils/log";
import { useTranslationStore } from "@/features/translation/stores/translationStore";

import { UseAssetFetcher } from "../misc/types";
import { PictureBboxRef } from "../PictureBbox";

const useCameraAsset = (
  pictureBboxRef: RefObject<PictureBboxRef | null>,
  cameraRef: RefObject<Camera | null>,
  previewFrame: ComponentSize | null,
) => {
  const [assetUri, setAssetUri] = useState<string>("");
  const isTakingPhoto = useRef(false);
  const mode = useTranslationStore((state) => state.mode);

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

      const needsRotate = pic.width > pic.height;

      const ratioX = (needsRotate ? pic.height : pic.width) / pW;
      const ratioY = (needsRotate ? pic.width : pic.height) / pH;

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
      const actions = needsRotate ? [{ crop }] : [{ crop }];

      const result = await ImageManipulator.manipulateAsync(uri, actions, {
        compress: 1,
        format: ImageManipulator.SaveFormat.JPEG,
      });

      setAssetUri(result.uri);
    } catch (e) {
      log.error("Error in takePhoto:", e);
    } finally {
      isTakingPhoto.current = false;
    }
  }, [cameraRef, pictureBboxRef, assetUri.length]);

  const takeVideo = () => log.debug("Taking video");

  const requestAsset = mode === "textToSign" ? takePhoto : takeVideo;

  const resetAssetUri = () => setAssetUri("");

  return { assetUri, requestAsset, resetAssetUri } as UseAssetFetcher;
};

export default useCameraAsset;
