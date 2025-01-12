import { usePersonalizationStore } from "../stores/personalizationStore";

export const useTheme = () => {
  const theme = usePersonalizationStore((state) => state.theme);

  return theme;
};
