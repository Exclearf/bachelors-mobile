import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useRef,
  useState,
} from "react";
import CameraTopContainer from "./containers/cameraTopContainer";
import CameraBottomContainer from "./containers/cameraBottomContainer";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";
import GalleryButton from "./buttons/galleryButton";
import RecordButton from "./buttons/recordButton";
import FlipCameraButton from "./buttons/flipCameraButton";
import SettingsButton from "./buttons/settingsButton";
import FlashlightButton from "./buttons/flashlightButton";
import SettingsModal from "../modals/settingsModal";
import { useBottomSheet } from "@/hooks/useBottomSheet";
import { AppDimensionsContext } from "@/contexts/appDimensions";
import SettingsPanel from "./containers/settingsPanel";
import { useCameraOptions } from "@/stores/cameraOptions";
import Spinner from "../utils/Spinner";
import { StyleSheet } from "react-native";

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
  const containersScale = useDerivedValue(() => {
    return (bottomSheet?.animatedPosition.get() ?? 0) / height;
  });
  const isAvailable = useCameraOptions((state) => state.isAvailable);

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

  const spinnerContainerStyle = useAnimatedStyle(() => {
    "worklet";
    return {
      top: Math.max(
        height * 0.24 - 50,
        (bottomSheet?.animatedPosition.get() ?? 0) * 0.5 - 50,
      ),
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
        <Animated.View
          style={[
            styles.spinnerContainer,
            spinnerContainerStyle,
            {
              // TODO: A dirty hack to make the spinner appear in the middle of the screen on initial load
              top: Math.max(
                height * 0.24 - 50,
                (bottomSheet?.animatedPosition.get() ?? 0) * 0.5 - 50,
              ),
            },
          ]}
        >
          <Spinner size={64} color="white" />
        </Animated.View>
      )}
      <CameraBottomContainer scale={containersScale}>
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

const styles = StyleSheet.create({
  spinnerContainer: {
    width: 64,
    height: 64,
    position: "absolute",
    zIndex: 2,
  },
});
