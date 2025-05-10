import { useContext } from "react";

import { BottomSheetWrapperRef } from "../components/layout/BottomSheetWrapper";
import { BottomSheetContext } from "../contexts/bottomSheetContext";

export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);

  if (!context) {
    throw new Error("useBottomSheet must be used within a BottomSheetProvider");
  }

  const { bottomSheetRef, setBottomSheetRef } = context;

  const isRegistered = !!bottomSheetRef?.snapToPosition;

  const registerBottomSheet = (ref?: BottomSheetWrapperRef) => {
    if (isRegistered || !ref) {
      return;
    }
    setBottomSheetRef(ref);
  };

  return {
    bottomSheet: bottomSheetRef,
    registerBottomSheet,
    isRegistered,
  } as const;
};
