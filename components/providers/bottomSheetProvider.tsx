import React, { PropsWithChildren, useRef, useState } from "react";
import { BottomSheetContext } from "@/contexts/bottomSheetContext";
import { BottomSheetWrapperRef } from "../wrappers/BottomSheetWrapper";

type Props = PropsWithChildren<{}>;

const BottomSheetProvider = ({ children }: Props) => {
  const bottomSheetRef = useRef<BottomSheetWrapperRef | undefined>(undefined);
  const [isRegistered, setIsRegistered] = useState(false);

  const registerBottomSheet = (ref: BottomSheetWrapperRef) => {
    if (isRegistered) {
      return;
    }

    bottomSheetRef.current = ref;
    setIsRegistered(ref.snapToPosition != null);
  };

  return (
    <BottomSheetContext.Provider
      value={{
        bottomSheet: bottomSheetRef.current,
        registerBottomSheet: registerBottomSheet,
      }}
    >
      {children}
    </BottomSheetContext.Provider>
  );
};

export default BottomSheetProvider;
