import { createContext } from "react";
import { BottomSheetWrapperRef } from "../components/layout/BottomSheetWrapper";

type BottomSheetContextType = {
    bottomSheetRef: BottomSheetWrapperRef | undefined;
    setBottomSheetRef: (ref: BottomSheetWrapperRef) => void;
};

export const BottomSheetContext = createContext<BottomSheetContextType | null>(
    null,
);
