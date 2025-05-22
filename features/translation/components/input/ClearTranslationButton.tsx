import AntDesign from "@expo/vector-icons/AntDesign";

import Button from "@/features/shared/components/input/Button";
import { useTheme } from "@/features/shared/hooks/useTheme";

import { useTranslationStore } from "../../stores/useTranslationStore";

type Props = object;

const ClearTranslationButton = (props: Props) => {
  const theme = useTheme();
  const clearActiveVideoTranslationResult = useTranslationStore(
    (state) => state.clearActiveVideoTranslationResult,
  );
  return (
    <Button
      onPress={clearActiveVideoTranslationResult}
      variant="transparent"
      style={{ borderWidth: 0 }}
    >
      <AntDesign name="close" size={24} color={theme?.primaryForeground} />
    </Button>
  );
};

export default ClearTranslationButton;
