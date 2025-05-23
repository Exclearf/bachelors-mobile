import { useContext } from "react";

import { AppDimensionsContext } from "../contexts/appDimensions";

export const useAppDimensions = () => {
  const context = useContext(AppDimensionsContext);

  if (!context) {
    throw new Error(
      "useAppDimensions must be used within an AppDimensionsProvider",
    );
  }

  return context;
};
