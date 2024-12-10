import { StyleSheet, Text, View } from "react-native";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import CameraTopContainer from "./containers/cameraTopContainer";
import CameraBottomContainer from "./containers/cameraBottomContainer";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import GalleryButton from "./buttons/galleryButton";
import RecordButton from "./buttons/recordButton";
import FlipCameraButton from "./buttons/flipCameraButton";
import SettingsButton from "./buttons/settingsButton";
import FlashlightButton from "./buttons/flashlightButton";
import SettingsModal from "./modals/settingsModal";

type CameraOverlayProps = {
  height: number;
  width: number;
  animatedPosition?: SharedValue<number>;
  setFlashOn: Dispatch<SetStateAction<boolean>>;
  setIsBack: Dispatch<SetStateAction<boolean>>;
};

export type CameraOverlayButtonProps = {
  onClick?: () => void;
  children?: React.ReactNode;
} & IconParameters;

export type IconParameters = {
  color: string;
  size: number;
};

const iconParameters: IconParameters = {
  color: "rgba(255,255,255,0.9)",
  size: 38,
};

const CameraOverlay = ({
  height,
  width,
  animatedPosition,
  setFlashOn,
  setIsBack,
}: CameraOverlayProps) => {
  const containersScale = useDerivedValue(() => {
    return (animatedPosition?.get() ?? 0) / height;
  });

  const [settingsModalExpanded, setSettingsModalExpanded] = useState(false);

  const topContainerButtons = useRef([
    {
      item: SettingsButton,
      onClick: () => setSettingsModalExpanded((prev) => !prev),
    },
    { item: FlashlightButton, onClick: () => setFlashOn((prev) => !prev) },
  ]);

  const bottomContainerButtons = useRef([
    { item: GalleryButton },
    { item: RecordButton },
    { item: FlipCameraButton, onClick: () => setIsBack((prev) => !prev) },
  ]);

  return (
    <>
      <CameraTopContainer scale={containersScale}>
        {topContainerButtons.current.map((button, index) => (
          <button.item
            {...iconParameters}
            key={index}
            onClick={button.onClick}
          />
        ))}
        <SettingsModal
          isVisible={settingsModalExpanded}
          animatedPosition={animatedPosition}
          iconParameters={iconParameters}
          height={height}
          width={width}
        />
      </CameraTopContainer>
      <CameraBottomContainer
        appHeight={height}
        position={animatedPosition}
        scale={containersScale}
      >
        {bottomContainerButtons.current.map((button, index) => (
          <button.item
            {...iconParameters}
            key={index}
            onClick={button.onClick}
          />
        ))}
      </CameraBottomContainer>
    </>
  );
};

export default CameraOverlay;

const styles = StyleSheet.create({});
