import React, { useContext, useMemo, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";
import { colorKit } from "reanimated-color-picker";

import { useCameraOptionsStore } from "@/features/camera/stores/useCameraOptionsStore";
import { AppDimensionsContext } from "@/features/shared/contexts/appDimensions";
import { useBottomSheet } from "@/features/shared/hooks/useBottomSheet";

import FlashlightButton from "./components/buttons/FlashlightButton";
import FlipCameraButton from "./components/buttons/FlipCameraButton";
import GalleryButton from "./components/buttons/GalleryButton";
import SettingsButton from "./components/buttons/SettingsButton";
import CameraBottomContainer from "./components/containers/CameraBottomContainer";
import CameraSettingsContainer from "./components/containers/CameraSettingsContainer";
import CameraTopContainer from "./components/containers/CameraTopContainer";
import SettingsModal from "./components/modals/SettingsModal";
import Spinner from "../shared/components/feedback/Spinner";
import { useTheme } from "../shared/hooks/useTheme";
import RecordingTime from "./components/feedback/RecordingTime";
import { useTranslationStore } from "../translation/stores/useTranslationStore";
import PhotoRecordButton from "./components/buttons/PhotoRecordButton";
import VideoRecordButton from "./components/buttons/VideoRecordButton";

type CameraOverlayProps = {
  switchTorch: () => void;
  switchDevice: () => void;
  switchDeviceEnabled: boolean;
  onCameraClick: () => void;
  onGalleryClick: () => void;
};

export type CameraOverlayButtonProps = React.PropsWithChildren<{
  onClick?: () => void;
  iconName?: string;
}> &
  IconParameters &
  ButtonParameters;

export type ButtonParameters = {
  buttonStyle?: any;
};

export type IconParameters = {
  color: string;
  size: number;
  secondaryColor?: string;
};

const CameraOverlay = ({
  switchTorch,
  switchDevice,
  switchDeviceEnabled,
  onCameraClick,
  onGalleryClick,
}: CameraOverlayProps) => {
  const { height } = useContext(AppDimensionsContext);
  const { bottomSheet } = useBottomSheet();
  const [settingsModalExpanded, setSettingsModalExpanded] = useState(false);
  const isAvailable = useCameraOptionsStore((state) => state.isAvailable);
  const theme = useTheme();
  const mode = useTranslationStore((state) => state.mode);

  // TODO: Wrap each handler in a callback made by useWrapAuth

  const buttonParameters: ButtonParameters = { buttonStyle: { padding: 10 } };

  const iconParameters: IconParameters = {
    color: colorKit.brighten(theme?.surfaceForeground ?? "#000", 20).hex(),
    secondaryColor: theme?.mutedForeground,
    size: 38,
  };

  const topContainerButtons = useRef([
    {
      item: SettingsButton,
      onClick: () => setSettingsModalExpanded((prev) => !prev),
    },
    {
      item: RecordingTime,
      onClick: () => {},
      enabled: true,
    },
    {
      item: FlashlightButton,
      onClick: switchTorch,
    },
  ]);

  const bottomContainerButtons = useMemo(
    () => [
      {
        item: GalleryButton,
        onClick: onGalleryClick,
        enabled: true,
      },
      {
        item: mode === "textToSign" ? PhotoRecordButton : VideoRecordButton,
        onClick: onCameraClick,
        enabled: true,
      },
      {
        item: FlipCameraButton,
        onClick: switchDevice,
        enabled: switchDeviceEnabled,
      },
    ],
    [switchDevice, switchDeviceEnabled, onCameraClick, onGalleryClick, mode],
  );

  const containersScale = useDerivedValue(() => {
    return (bottomSheet?.animatedPosition.get() ?? 0) / height;
  });

  const spinnerBottomSheetRelativeHeight = useDerivedValue(() => {
    return (bottomSheet?.animatedPosition.get() ?? 0) * 0.5 - 50;
  });

  const spinnerContainerStyle = useAnimatedStyle(() => {
    return {
      top: Math.max(height * 0.24 - 50, spinnerBottomSheetRelativeHeight.get()),
    };
  });

  return (
    <>
      <CameraTopContainer scale={containersScale}>
        {topContainerButtons.current.map((button, index) => (
          <button.item
            {...iconParameters}
            {...buttonParameters}
            key={index}
            onClick={button.onClick}
          />
        ))}
        <SettingsModal
          isVisible={settingsModalExpanded}
          iconParameters={iconParameters}
        >
          <CameraSettingsContainer />
        </SettingsModal>
      </CameraTopContainer>
      {!isAvailable && (
        <Animated.View style={[styles.spinnerContainer, spinnerContainerStyle]}>
          <Spinner size={64} color={theme?.primaryForeground!} />
        </Animated.View>
      )}
      <CameraBottomContainer scale={containersScale}>
        {bottomContainerButtons.map(
          (button, index) =>
            button.enabled && (
              <button.item
                {...iconParameters}
                key={index}
                onClick={button.onClick}
              />
            ),
        )}
      </CameraBottomContainer>
    </>
  );
};

export default CameraOverlay;

const styles = StyleSheet.create({
  spinnerContainer: {
    width: 64,
    height: 64,
    position: "absolute",
    zIndex: 2,
  },
});
