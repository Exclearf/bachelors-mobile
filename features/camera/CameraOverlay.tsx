import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useRef,
  useState,
} from "react";
import CameraTopContainer from "./components/containers/CameraTopContainer";
import CameraBottomContainer from "./components/containers/CameraBottomContainer";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";
import GalleryButton from "./components/buttons/GalleryButton";
import RecordButton from "./components/buttons/RecordButton";
import FlipCameraButton from "./components/buttons/FlipCameraButton";
import SettingsButton from "./components/buttons/SettingsButton";
import FlashlightButton from "./components/buttons/FlashlightButton";
import SettingsModal from "./components/modals/SettingsModal";
import { AppDimensionsContext } from "@/features/shared/contexts/appDimensions";
import SettingsPanel from "./components/containers/SettingsContainer";
import { useCameraOptionsStore } from "@/features/camera/stores/cameraOptions";
import { StyleSheet } from "react-native";
import { useAuthStore } from "@/features/auth/stores/authStore";
import { useBottomSheet } from "@/features/shared/hooks/useBottomSheet";
import Spinner from "../shared/components/feedback/Spinner";

type CameraOverlayProps = {
  setFlashOn: Dispatch<SetStateAction<boolean>>;
  setIsBack: Dispatch<SetStateAction<boolean>>;
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
};

const buttonParameters: ButtonParameters = {
  buttonStyle: {
    padding: 10,
  },
};

const iconParameters: IconParameters = {
  color: "rgba(255,255,255,0.9)",
  size: 38,
};

const CameraOverlay = ({ setFlashOn, setIsBack }: CameraOverlayProps) => {
  const { height } = useContext(AppDimensionsContext);
  const { bottomSheet } = useBottomSheet();
  const [settingsModalExpanded, setSettingsModalExpanded] = useState(false);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const isAvailable = useCameraOptionsStore((state) => state.isAvailable);

  const notLoggedInOnClick = () => console.log("Not logged in");

  const topContainerButtons = useRef([
    {
      item: SettingsButton,
      onClick: () => setSettingsModalExpanded((prev) => !prev),
    },
    {
      item: FlashlightButton,
      onClick: () => setFlashOn((prev) => !prev),
    },
  ]);

  const bottomContainerButtons = useRef([
    { item: GalleryButton, notLoggedInOnClick },
    {
      item: RecordButton,
      notLoggedInOnClick,
    },
    { item: FlipCameraButton, onClick: () => setIsBack((prev) => !prev) },
  ]);

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
          <SettingsPanel />
        </SettingsModal>
      </CameraTopContainer>
      {!isAvailable && (
        <Animated.View style={[styles.spinnerContainer, spinnerContainerStyle]}>
          <Spinner size={64} color="white" />
        </Animated.View>
      )}
      <CameraBottomContainer scale={containersScale}>
        {bottomContainerButtons.current.map((button, index) => (
          <button.item
            {...iconParameters}
            key={index}
            onClick={
              !isLoggedIn && button?.notLoggedInOnClick
                ? button.notLoggedInOnClick
                : button.onClick
            }
          />
        ))}
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
