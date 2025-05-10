import BottomSheet, { BottomSheetProps } from "@gorhom/bottom-sheet";
import React, {
  forwardRef,
  PropsWithChildren,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { SharedValue, useSharedValue } from "react-native-reanimated";

import { useBottomSheet } from "@/features/shared/hooks/useBottomSheet";

import { useIsFullScreenRoute } from "../../hooks/useIsFullScreenRoute";

type Props = {
  areGesturesEnabled?: boolean;
};

export type BottomSheetWrapperProps = PropsWithChildren<
  BottomSheetProps & Props
>;

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
  const isFullScrenRoute = useIsFullScreenRoute();

  const bottomSheetWrapperImplementation = useMemo(
    () =>
      ({
        ...bottomSheetRef.current,
        index,
        height,
        animatedPosition,
      }) as BottomSheetWrapperRef,
    [animatedPosition, height, index],
  );

  useImperativeHandle(ref, () => bottomSheetWrapperImplementation);

  useEffect(() => {
    context.registerBottomSheet({ ...bottomSheetWrapperImplementation });
  }, [bottomSheetWrapperImplementation, context]);

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
      enableHandlePanningGesture={!isFullScrenRoute}
      enableContentPanningGesture={!isFullScrenRoute}
    >
      {props.children}
    </BottomSheet>
  );
});

BottomSheetWrapper.displayName = "BottomSheetWrapper";

export default BottomSheetWrapper;
