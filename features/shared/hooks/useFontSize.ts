import { usePersonalizationStore } from "../../settings/stores/usePersonalizationStore";

export const FontSizeMultiplier = 2;
export const NonFontSizeMultiplier = FontSizeMultiplier * 0.9;

export const useFontSize = () => {
  const fontSize = usePersonalizationStore((state) => state.fontSize);

  return fontSize;
};
