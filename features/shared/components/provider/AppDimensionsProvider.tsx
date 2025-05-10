import React, { PropsWithChildren } from "react";
import { Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppDimensionsContext } from "../../contexts/appDimensions";

type Props = PropsWithChildren<{}>;

const AppDimensionsProvider = ({ children }: Props) => {
  const windowDimensions = Dimensions.get("window");
  const insets = useSafeAreaInsets();

  const safeDimensions = {
    width: windowDimensions.width,
    height: windowDimensions.height - (insets.top + insets.bottom),
  };

  return (
    <AppDimensionsContext.Provider value={safeDimensions}>
      {children}
    </AppDimensionsContext.Provider>
  );
};

export default AppDimensionsProvider;
