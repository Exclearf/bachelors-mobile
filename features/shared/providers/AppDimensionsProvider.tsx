import { Dimensions } from "react-native";
import React, { PropsWithChildren } from "react";
import { AppDimensionsContext } from "../contexts/appDimensions";

type Props = PropsWithChildren<{}>;

const AppDimensionsProvider = ({ children }: Props) => {
  const windowDimensions = Dimensions.get("window");

  return (
    <AppDimensionsContext.Provider value={windowDimensions}>
      {children}
    </AppDimensionsContext.Provider>
  );
};

export default AppDimensionsProvider;
