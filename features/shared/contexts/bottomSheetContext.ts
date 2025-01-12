import { createContext } from "react";
import { BottomSheetWrapperRef } from "../components/layout/BottomSheetWrapper";

type BottomSheetContextType = {
  bottomSheet: BottomSheetWrapperRef | undefined;
  registerBottomSheet: (ref: BottomSheetWrapperRef) => void;
  isRegistered: boolean;
};

export const BottomSheetContext = createContext<
  BottomSheetContextType | undefined
>(undefined);
