import { useContext } from "react";

import { SettingsItemWidthContext } from "../contexts/settingsItemWidth";

export const useSettingsItemWidth = () => {
  const context = useContext(SettingsItemWidthContext);

  if (!context) {
    throw new Error(
      "useSettingsItemWidth must be used within an SettingsItemWidthProvider",
    );
  }

  return context;
};
