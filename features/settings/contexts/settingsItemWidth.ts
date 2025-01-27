import { createContext } from "react";

type SettingsItemWidthContextType = {
  width: number;
};

export const SettingsItemWidthContext =
  createContext<SettingsItemWidthContextType>({ width: 0 });
