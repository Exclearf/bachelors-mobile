import React, {
  forwardRef,
  useRef,
  useState,
  PropsWithChildren,
  useEffect,
  useImperativeHandle,
} from "react";
import BottomSheet, { BottomSheetProps } from "@gorhom/bottom-sheet";
import { SharedValue, useSharedValue } from "react-native-reanimated";
import { useBottomSheet } from "@/features/shared/hooks/useBottomSheet";

export type BottomSheetWrapperProps = PropsWithChildren<BottomSheetProps>;

export type BottomSheetWrapperRef = {
  index: number;
  animatedPosition: SharedValue<number>;
} & BottomSheet;

const BottomSheetWrapper = forwardRef<
  BottomSheetWrapperRef,
  BottomSheetWrapperProps
>((props, ref) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const context = useBottomSheet();

  const [index, setIndex] = useState(0);
  const [height, setHeight] = useState(0);

  const animatedPosition = useSharedValue(0);

  const bottomSheetWrapperImplementation = {
    ...bottomSheetRef.current,
    index,
    height,
    animatedPosition,
  } as BottomSheetWrapperRef;

  useImperativeHandle(ref, () => bottomSheetWrapperImplementation);

  useEffect(() => {
    context.registerBottomSheet({ ...bottomSheetWrapperImplementation });
  }, [bottomSheetRef.current]);

  return (
    <BottomSheet
      {...props}
      ref={bottomSheetRef}
      animatedPosition={animatedPosition}
      onChange={(index, height, type) => {
        setIndex(index);
        setHeight(height);
        props.onChange?.(index, height, type);
      }}
    >
      {props.children}
    </BottomSheet>
  );
});

BottomSheetWrapper.displayName = "BottomSheetWrapper";

export default BottomSheetWrapper;
