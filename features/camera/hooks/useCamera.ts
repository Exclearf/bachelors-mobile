import { useRef, useState } from "react";
import { useCameraDevice } from "react-native-vision-camera";

const useCamera = (deviceIndex: number) => {
  const cameraDevices = useRef(
    [
      useCameraDevice("back"),
      useCameraDevice("front"),
      useCameraDevice("external"),
    ].filter(Boolean)!,
  ).current;
  const currentDeviceIndex = useRef(deviceIndex ?? 0);

  const [currentDevice, setCurrentDevice] = useState(
    cameraDevices[deviceIndex]!,
  );

  const switchDevice = () => {
    currentDeviceIndex.current =
      (currentDeviceIndex.current + 1) % cameraDevices.length;
    console.log(`New device is "${currentDeviceIndex}"`);
    setCurrentDevice(cameraDevices[currentDeviceIndex.current]!);
  };

  const isCameraSwitchEnabled = cameraDevices.length > 1;

  return {
    currentDevice,
    switchDevice,
    isCameraSwitchEnabled,
  } as const;
};

export default useCamera;
