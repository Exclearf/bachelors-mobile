import React, { PropsWithChildren, useState } from "react";

import { BottomSheetContext } from "../../contexts/bottomSheetContext";
import { BottomSheetWrapperRef } from "../layout/BottomSheetWrapper";

type Props = PropsWithChildren<{}>;

const BottomSheetProvider = ({ children }: Props) => {
  const [bottomSheetRef, setBottomSheetRef] = useState<BottomSheetWrapperRef>();

  return (
    <BottomSheetContext.Provider
      value={{
        bottomSheetRef,
        setBottomSheetRef,
      }}
    >
      {children}
    </BottomSheetContext.Provider>
  );
};

export default BottomSheetProvider;
