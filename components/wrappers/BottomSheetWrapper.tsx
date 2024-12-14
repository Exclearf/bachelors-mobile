import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  PropsWithChildren,
} from "react";
import BottomSheet, { BottomSheetProps } from "@gorhom/bottom-sheet";

export type BottomSheetWrapperProps = PropsWithChildren<BottomSheetProps>;

export type BottomSheetWrapperRef = {
  index: number;
} & typeof BottomSheet;

const BottomSheetWrapper = forwardRef<
  BottomSheetWrapperRef,
  BottomSheetWrapperProps
>((props, ref) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [currentPosition, setCurrentPosition] = useState({
    height: 0,
    index: 0,
  });

  useImperativeHandle(
    ref,
    () =>
      ({
        ...bottomSheetRef.current,
        index: currentPosition.index,
      }) as BottomSheetWrapperRef,
  );

  return (
    <BottomSheet
      {...props}
      ref={bottomSheetRef}
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
