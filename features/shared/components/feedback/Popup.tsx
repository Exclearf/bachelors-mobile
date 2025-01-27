import { Pressable, StyleSheet, View } from "react-native";
import React, {
  createContext,
  Dispatch,
  PropsWithChildren,
  ReactElement,
  SetStateAction,
  useContext,
  useRef,
  useState,
} from "react";
//import { useAppDimensions } from "../../hooks/useAppDimensions";
import { percentageToDecimal } from "../../utils/helper";

type TriggerPosition = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type PopupContextType = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  triggerLayout: TriggerPosition | null;
  setTriggerLayout: Dispatch<SetStateAction<TriggerPosition | null>>;
};

const PopupContext = createContext<PopupContextType>({
  isOpen: false,
  setIsOpen: () => {},
  triggerLayout: null,
  setTriggerLayout: () => {},
});

const usePopupContext = () => {
  const context = useContext(PopupContext);

  return context;
};

type PopupTriggerProps = PropsWithChildren<{}>;
type PopupContentProps = PropsWithChildren<{
  position: "top" | "bottom";
  height: number | string;
  width: number | string;
  verticalAlignment?: "left" | "center" | "right";
}>;

type PopupComposition = {
  children: [
    ReactElement<PopupTriggerProps> | null,
    ReactElement<PopupContentProps> | null,
  ];
};

type PopupProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
} & PopupComposition;

// TODO: Add position checking in onLayout (at least for horizontal)

const Popup = ({ isOpen, setIsOpen, children }: PopupProps) => {
  const [triggerLayout, setTriggerLayout] = useState<TriggerPosition | null>(
    null,
  );

  return (
    <PopupContext.Provider
      value={{ isOpen, setIsOpen, triggerLayout, setTriggerLayout }}
    >
      {children}
    </PopupContext.Provider>
  );
};

Popup.Trigger = ({ children }: PopupTriggerProps) => {
  const { setIsOpen, setTriggerLayout } = usePopupContext();
  const triggerRef = useRef<View>(null);

  const onLayout = () => {
    triggerRef.current?.measure((x, y, width, height) => {
      setTriggerLayout({ x, y, width, height });
    });
  };

  const onPress = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <Pressable
      hitSlop={10}
      pressRetentionOffset={{ top: 10, left: 10, right: 10, bottom: 10 }}
      onPress={onPress}
      onLayout={onLayout}
      ref={triggerRef}
    >
      {children}
    </Pressable>
  );
};

const padding = 10;

const createTopPosition = (
  triggerLayout: TriggerPosition,
  height: number,
  horizontalPositionModifier: number,
): [number, number] => {
  const top = triggerLayout.y - height - padding;
  const left =
    triggerLayout.x + triggerLayout.width / 2 - horizontalPositionModifier;
  return [top, left];
};

const createBottomPosition = (
  triggerLayout: TriggerPosition,
  horizontalPositionModifier: number,
): [number, number] => {
  const top = triggerLayout.y + triggerLayout.height + padding;
  const left =
    triggerLayout.x + triggerLayout.width / 2 - horizontalPositionModifier;

  return [top, left];
};

Popup.Content = ({
  children,
  position,
  width,
  height,
  verticalAlignment = "center",
}: PopupContentProps) => {
  //const { height: screenHeight } = useAppDimensions();
  const { isOpen, setIsOpen, triggerLayout } = usePopupContext();

  if (!isOpen || !triggerLayout) return null;

  if (typeof width === "string") {
    width = percentageToDecimal(width) * triggerLayout.width;
  }

  if (typeof height === "string") {
    height = percentageToDecimal(height) * triggerLayout.height;
  }

  let horizontalPositionModifier = 0;

  switch (verticalAlignment) {
    case "left":
      horizontalPositionModifier = width - triggerLayout.width / 4;
      break;
    case "right":
      horizontalPositionModifier = triggerLayout.width / 2;
      break;
    case "center":
      horizontalPositionModifier = width / 2;
    default:
      horizontalPositionModifier = width / 2;
  }

  let left, top;

  switch (position) {
    case "top":
      [top, left] = createTopPosition(
        triggerLayout,
        height,
        horizontalPositionModifier,
      );
      break;
    case "bottom":
      [top, left] = createBottomPosition(
        triggerLayout,
        horizontalPositionModifier,
      );
      break;
    default:
      [top, left] = createTopPosition(
        triggerLayout,
        height,
        horizontalPositionModifier,
      );
  }

  // TODO: Rewrite to use measure and a global pop-up container
  // If needed*
  //if (top + height > screenHeight) {
  //  console.log(`Tooltip overflow at bottom`);
  //  [top, left] = createTopPosition(triggerLayout, height, width);
  //} else if (top < 0) {
  //  console.log(`Tooltip overflow at top`);
  //  [top, left] = createBottomPosition(triggerLayout, height);
  //}

  return (
    <Pressable
      onPress={() => {
        setIsOpen(false);
      }}
      hitSlop={10000}
      style={[
        styles.contentStyle,
        {
          top,
          left,
          width,
          height,
        },
      ]}
    >
      <Pressable>{children}</Pressable>
    </Pressable>
  );
};

export default Popup;

const styles = StyleSheet.create({
  contentStyle: {
    zIndex: 1000,
    position: "absolute",
  },
});
