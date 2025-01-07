import {
  AvailableThemes,
  usePersonalizationStore,
} from "@/features/shared/stores/personalizationStore";
import {
  darkHighContrast,
  darkTheme,
  lightHighContrast,
  lightTheme,
} from "@/features/shared/utils/themes";
import React, { createContext, useContext, ReactNode } from "react";
import { useShallow } from "zustand/react/shallow";

interface PersonalizationContextType {
  theme: AvailableThemes;
  themeColors: typeof lightTheme | typeof darkTheme;
}

const PersonalizationContext = createContext<
  PersonalizationContextType | undefined
>(undefined);

export const PersonalizationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [theme, isHighContrast] = usePersonalizationStore(
    useShallow((state) => [state.theme, state.isHighContrast]),
  );

  const baseTheme = theme === "dark" ? darkTheme : lightTheme;
  const highContrastOverrides =
    theme === "dark" ? darkHighContrast : lightHighContrast;
  const themeColors = isHighContrast
    ? { ...baseTheme, ...highContrastOverrides }
    : baseTheme;

  return (
    <PersonalizationContext.Provider value={{ theme, themeColors }}>
      {children}
    </PersonalizationContext.Provider>
  );
};

export const usePersonalization = () => {
  const context = useContext(PersonalizationContext);

  if (!context)
    throw new Error(
      "usePersonalization must be used within a PersonalizationProvider",
    );

  return context;
};
