import { createContext } from "react";

export type AppDimensionsType = {
    width: number;
    height: number;
};

const defaultContextValue = {
    width: 0,
    height: 0,
};

export const AppDimensionsContext =
    createContext<AppDimensionsType>(defaultContextValue);
