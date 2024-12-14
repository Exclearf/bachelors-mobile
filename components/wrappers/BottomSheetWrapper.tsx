import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  PropsWithChildren,
  useEffect,
} from "react";
import BottomSheet, { BottomSheetProps } from "@gorhom/bottom-sheet";
import { SharedValue, useSharedValue } from "react-native-reanimated";
import { useBottomSheet } from "@/hooks/useBottomSheet";

export type BottomSheetWrapperProps = PropsWithChildren<BottomSheetProps>;

export type BottomSheetWrapperRef = {
  index: number;
  animatedPosition: SharedValue<number>;
} & typeof BottomSheet;

const BottomSheetWrapper = forwardRef<
  BottomSheetWrapperRef,
  BottomSheetWrapperProps
>((props, ref) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const context = useBottomSheet();

  const [currentPosition, setCurrentPosition] = useState({
    height: 0,
    index: 0,
  });

  const animatedPosition = useSharedValue(0);

  const bottomSheetWrapperImplementation = {
    ...bottomSheetRef.current,
    index: currentPosition.index,
    animatedPosition,
  } as BottomSheetWrapperRef;

  useImperativeHandle(ref, () => bottomSheetWrapperImplementation);

  useEffect(() => {
    console.log("Registering bottom sheet");
    context.registerBottomSheet(bottomSheetWrapperImplementation);
  }, [context.registerBottomSheet, bottomSheetWrapperImplementation]);

  return (
    <BottomSheet
      {...props}
      ref={bottomSheetRef}
      animatedPosition={animatedPosition}
      onChange={(index, height, type) => {
        setCurrentPosition({ height, index });
        props.onChange?.(index, height, type);
      }}
    >
      {props.children}
    </BottomSheet>
  );
});

BottomSheetWrapper.displayName = "BottomSheetWrapper";

export default BottomSheetWrapper;
