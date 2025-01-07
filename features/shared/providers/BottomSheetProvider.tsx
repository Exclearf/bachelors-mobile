import React, { PropsWithChildren, useRef, useState } from "react";
import { BottomSheetWrapperRef } from "../wrappers/BottomSheetWrapper";
import { BottomSheetContext } from "../contexts/bottomSheetContext";

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
        isRegistered,
      }}
    >
      {children}
    </BottomSheetContext.Provider>
  );
};

export default BottomSheetProvider;
