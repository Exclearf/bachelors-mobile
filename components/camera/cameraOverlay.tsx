import { StyleSheet, Text, View } from "react-native";
import React from "react";
import CameraTopContainer from "./containers/cameraTopContainer";
import CameraBottomContainer from "./containers/cameraBottomContainer";
import { SharedValue, useDerivedValue } from "react-native-reanimated";
import GalleryButton from "./buttons/galleryButton";
import RecordButton from "./buttons/recordButton";
import FlipCameraButton from "./buttons/flipCameraButton";
import SettingsButton from "./buttons/settingsButton";
import FlashlightButton from "./buttons/flashlightButton";

type Props = {
  height: number;
  animatedPosition?: SharedValue<number>;
};

const iconsParameters = {
  color: "rgba(255,255,255,0.9)",
  size: 38,
};

const bottomContainerButtons = [GalleryButton, RecordButton, FlipCameraButton];

const topContainerButtons = [SettingsButton, FlashlightButton];

const CameraOverlay = ({ height, animatedPosition }: Props) => {
  const containersScale = useDerivedValue(() => {
    return (animatedPosition?.get() ?? 0) / height;
  });

  return (
    <>
      <CameraTopContainer scale={containersScale}>
        {topContainerButtons.map((Item, index) => (
          <Item {...iconsParameters} key={index} />
        ))}
      </CameraTopContainer>
      <CameraBottomContainer
        appHeight={height}
        position={animatedPosition}
        scale={containersScale}
      >
        {bottomContainerButtons.map((Item, index) => (
          <Item {...iconsParameters} key={index} />
        ))}
      </CameraBottomContainer>
    </>
  );
};

export default CameraOverlay;

const styles = StyleSheet.create({});
