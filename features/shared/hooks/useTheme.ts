import { usePersonalizationStore } from "../../settings/stores/usePersonalizationStore";

export const useTheme = () => {
  const theme = usePersonalizationStore((state) => state.theme);

  return theme;
};
