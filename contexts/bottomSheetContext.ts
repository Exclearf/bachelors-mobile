import { BottomSheetWrapperRef } from "@/components/wrappers/BottomSheetWrapper";
import { createContext } from "react";

type BottomSheetContextType = {
  bottomSheet: BottomSheetWrapperRef | undefined;
  registerBottomSheet: (ref: BottomSheetWrapperRef) => void;
};

export const BottomSheetContext = createContext<
  BottomSheetContextType | undefined
>(undefined);
