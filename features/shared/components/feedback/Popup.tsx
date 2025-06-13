import { clamp } from "@shopify/react-native-skia";
import React, {
  createContext,
  Dispatch,
  PropsWithChildren,
  ReactElement,
  SetStateAction,
  useContext,
  useRef,
} from "react";
import {
  LayoutChangeEvent,
  Pressable,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import { LayoutPosition } from "../../types/types";
import ModalWindow from "../layout/ModalWindow";

type PopupContextType = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  triggerLayout: SharedValue<LayoutPosition>;
};

const InitialLayoutPosition = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
};

const PopupContext = createContext<PopupContextType>(
  null as unknown as PopupContextType,
);

const usePopupContext = () => {
  const context = useContext(PopupContext);

  return context;
};

type PopupPosition = "top" | "bottom";
type PopupAlignment = "left" | "center" | "right";

type PopupTriggerProps = PropsWithChildren<object>;
type PopupContentProps = PropsWithChildren<{
  position: PopupPosition;
  height: number | string;
  width: number | string;
  horizontalAlignment?: PopupAlignment;
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

type PopupComponent = React.FC<PopupProps> & {
  Trigger: React.FC<PopupTriggerProps>;
  Content: React.FC<PopupContentProps>;
};

const popAlignmentMultiplier: Record<PopupAlignment, number> = {
  left: 1,
  center: 0.5,
  right: 0,
};

const Popup: PopupComponent = ({ isOpen, setIsOpen, children }: PopupProps) => {
  const triggerLayout = useSharedValue<LayoutPosition>(InitialLayoutPosition);

  return (
    <PopupContext.Provider
      value={{
        isOpen,
        setIsOpen,
        triggerLayout,
      }}
    >
      {children}
    </PopupContext.Provider>
  );
};

const Trigger = ({ children }: PopupTriggerProps) => {
  const { setIsOpen, triggerLayout } = usePopupContext();
  const triggerRef = useRef<View>(null);

  const onLayout = () => {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      triggerLayout?.set({
        x,
        y,
        width,
        height,
      });
    });
  };

  const onPress = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <Pressable
      hitSlop={10}
      pressRetentionOffset={{
        top: 10,
        left: 10,
        right: 10,
        bottom: 10,
      }}
      onPress={onPress}
      onLayout={onLayout}
      ref={triggerRef}
    >
      {children}
    </Pressable>
  );
};

const Content = ({
  children,
  position,
  width,
  height,
  horizontalAlignment = "center",
}: PopupContentProps) => {
  // TODO:
  // 2. Extract into a function

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const { isOpen, setIsOpen, triggerLayout } = usePopupContext();
  const padding = 15;
  const popupLayout = useSharedValue<LayoutPosition | null>(null);
  const popupRef = useRef<Animated.View>(null);

  const popupStyle = useAnimatedStyle(() => {
    const triggerPosition = triggerLayout.get();
    const popupPosition = popupLayout.get();

    if (!popupPosition) return {};

    const offsetMultiplier = popAlignmentMultiplier[horizontalAlignment];

    const horizontalPositionCreator = () => {
      return (
        triggerPosition.x +
        triggerPosition.width * offsetMultiplier -
        popupPosition.width * offsetMultiplier
      );
    };

    const topPosition = triggerPosition.y + triggerPosition.height + padding;

    return {
      left: clamp(
        Math.round(horizontalPositionCreator()),
        padding,
        screenWidth - popupPosition.width - padding,
      ),
      top: clamp(
        Math.round(topPosition),
        padding,
        screenHeight - popupPosition.height - padding,
      ),
    };
  });

  const onPopupLayout = (e: LayoutChangeEvent) => {
    popupRef.current?.measureInWindow((x, y, width, height) => {
      popupLayout.set({
        x,
        y,
        width,
        height,
      });
    });
  };

  return (
    <ModalWindow
      wrapContent={false}
      isOpen={isOpen}
      transparent={true}
      closeCallback={() => setIsOpen(false)}
    >
      <Animated.View
        ref={popupRef}
        onLayout={onPopupLayout}
        style={[
          {
            left: -999,
            top: -999,
            position: "absolute",
          },
          popupStyle,
        ]}
      >
        {children}
      </Animated.View>
    </ModalWindow>
  );
};

Popup.Content = Content;
Popup.Trigger = Trigger;

export default Popup;
