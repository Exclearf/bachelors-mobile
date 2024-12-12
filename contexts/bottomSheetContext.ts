import { AppBottomSheetRef } from "@/components/bottomSheet/bottomSheet";
import { createContext } from "react";

type BottomSheetType = AppBottomSheetRef | null;

const defaultContextValue = null;

export const BottomSheetContext =
  createContext<BottomSheetType>(defaultContextValue);
