import * as ImageManipulator from "expo-image-manipulator";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { Camera } from "react-native-vision-camera";

import { ComponentSize } from "@/features/shared/hooks/useComponentSize";
import log from "@/features/shared/utils/log";

import { PictureBboxRef } from "../PictureBbox";

const useBboxPhoto = (
  pictureBboxRef: RefObject<PictureBboxRef | null>,
  cameraRef: RefObject<Camera | null>,
  previewFrame: ComponentSize | null,
) => {
  const [photo, setPhoto] = useState<string | null>(null);
  const isTakingPhoto = useRef(false);

  const frameRef = useRef<ComponentSize | null>(null);

  useEffect(() => {
    frameRef.current = previewFrame;
  }, [previewFrame]);

  const takePhoto = useCallback(async () => {
    const frame = frameRef.current;

    if (isTakingPhoto.current || !frame || (photo ?? "").length !== 0) return;

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

      setPhoto(result.uri);
    } catch (e) {
      log.error("Error in takePhoto:", e);
    } finally {
      isTakingPhoto.current = false;
    }
  }, [cameraRef, pictureBboxRef]);

  const resetPhoto = () => setPhoto(null);

  return [photo, takePhoto, resetPhoto] as const;
};

export default useBboxPhoto;
