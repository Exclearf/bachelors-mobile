import React, { useContext, useMemo, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";

import { useCameraOptionsStore } from "@/features/camera/stores/useCameraOptions";
import { AppDimensionsContext } from "@/features/shared/contexts/appDimensions";
import { useBottomSheet } from "@/features/shared/hooks/useBottomSheet";

import FlashlightButton from "./components/buttons/FlashlightButton";
import FlipCameraButton from "./components/buttons/FlipCameraButton";
import GalleryButton from "./components/buttons/GalleryButton";
import RecordButton from "./components/buttons/RecordButton";
import SettingsButton from "./components/buttons/SettingsButton";
import CameraBottomContainer from "./components/containers/CameraBottomContainer";
import CameraSettingsContainer from "./components/containers/CameraSettingsContainer";
import CameraTopContainer from "./components/containers/CameraTopContainer";
import SettingsModal from "./components/modals/SettingsModal";
import { usePersonalizationStore } from "../settings/stores/personalizationStore";
import Spinner from "../shared/components/feedback/Spinner";
import useWrapAuth from "../shared/hooks/useWrapAuth";

type CameraOverlayProps = {
  switchTorch: () => void;
  switchDevice: () => void;
  switchDeviceEnabled: boolean;

  onCameraClick: () => void;
};

export type CameraOverlayButtonProps = React.PropsWithChildren<{
  onClick?: () => void;
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
}: CameraOverlayProps) => {
  const { height } = useContext(AppDimensionsContext);
  const { bottomSheet } = useBottomSheet();
  const [settingsModalExpanded, setSettingsModalExpanded] = useState(false);
  const isAvailable = useCameraOptionsStore((state) => state.isAvailable);
  const theme = usePersonalizationStore((state) => state.theme);
  const wrapAuth = useWrapAuth();

  const buttonParameters: ButtonParameters = { buttonStyle: { padding: 10 } };

  const iconParameters: IconParameters = {
    color: theme?.primaryForeground!,
    secondaryColor: theme?.mutedForeground,
    size: 38,
  };

  const notLoggedInOnClick = () => console.log("Not logged in");

  const topContainerButtons = useRef([
    {
      item: SettingsButton,
      onClick: () => setSettingsModalExpanded((prev) => !prev),
    },
    {
      item: FlashlightButton,
      onClick: switchTorch,
    },
  ]);

  const recordButtonClick = onCameraClick;

  const bottomContainerButtons = useMemo(
    () => [
      {
        item: GalleryButton,
        onClick: notLoggedInOnClick,
        enabled: true,
      },
      {
        item: RecordButton,
        onClick: recordButtonClick,
        enabled: true,
      },
      {
        item: FlipCameraButton,
        onClick: switchDevice,
        enabled: switchDeviceEnabled,
      },
    ],
    [recordButtonClick, switchDevice, switchDeviceEnabled],
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
