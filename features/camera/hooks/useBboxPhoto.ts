import * as ImageManipulator from "expo-image-manipulator";
import { RefObject, useState } from "react";
import { useWindowDimensions } from "react-native";
import { Camera } from "react-native-vision-camera";

import { HANDLE_SIZE } from "../misc/constants";
import { PictureBboxRef } from "../PictureBbox";

const useBboxPhoto = (
  pictureBboxRef: RefObject<PictureBboxRef | null>,
  cameraRef: RefObject<Camera | null>,
) => {
  const [photo, setPhoto] = useState<string | null>(null);
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const takePhoto = async () => {
    try {
      const pictureBbox = pictureBboxRef.current!;
      const topLeft = pictureBbox.topLeft;
      const bottomRight = pictureBbox.bottomRight;

      const focusBox = {
        x: topLeft.x.get() - HANDLE_SIZE,
        y: topLeft.y.get() + HANDLE_SIZE,
        width: bottomRight.x.get() - topLeft.x.get(),
        height: bottomRight.y.get() - topLeft.y.get(),
      };

      const pic = await cameraRef.current!.takePhoto();

      const scaleX = pic.width / screenWidth;
      const scaleY = pic.height / screenHeight;

      const originX = focusBox.x * scaleX;
      const originY = focusBox.y * scaleY;

      const crop = {
        originX: Math.round(originX),
        originY: Math.round(originY),
        width: Math.round(focusBox.width * scaleX),
        height: Math.round(focusBox.height * scaleY),
      };

      console.log(crop);

      const fileUri = pic.path.startsWith("file:")
        ? pic.path
        : `file://${pic.path}`;

      const result = await ImageManipulator.manipulateAsync(
        fileUri,
        [{ crop }],
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG },
      );

      setPhoto(result.uri);
    } catch (e) {
      console.error("❌ Error in takePhoto:", e);
    }
  };

  const resetPhoto = () => setPhoto(null);

  return [photo, takePhoto, resetPhoto] as const;
};

export default useBboxPhoto;
