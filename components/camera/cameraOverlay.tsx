import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useRef,
  useState,
} from "react";
import CameraTopContainer from "./containers/cameraTopContainer";
import CameraBottomContainer from "./containers/cameraBottomContainer";
import { useDerivedValue } from "react-native-reanimated";
import GalleryButton from "./buttons/galleryButton";
import RecordButton from "./buttons/recordButton";
import FlipCameraButton from "./buttons/flipCameraButton";
import SettingsButton from "./buttons/settingsButton";
import FlashlightButton from "./buttons/flashlightButton";
import SettingsModal from "../modals/settingsModal";
import { useBottomSheet } from "@/hooks/useBottomSheet";
import { AppDimensionsContext } from "@/contexts/appDimensions";

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

  const containersScale = useDerivedValue(() => {
    return (bottomSheet?.animatedPosition?.get() ?? 0) / height;
  });

  const [settingsModalExpanded, setSettingsModalExpanded] = useState(false);
  const { bottomSheet } = useBottomSheet();

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
            {...buttonParameters}
            key={index}
            onClick={button.onClick}
          />
        ))}
        <SettingsModal
          isVisible={settingsModalExpanded}
          iconParameters={iconParameters}
        />
      </CameraTopContainer>
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
