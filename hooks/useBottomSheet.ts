import { BottomSheetContext } from "@/contexts/bottomSheetContext";
import { useContext } from "react";

export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);

  if (!context) {
    throw new Error("useBottomSheet must be used within a BottomSheetProvider");
  }

  return context;
};
