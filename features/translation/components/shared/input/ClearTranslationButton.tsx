import AntDesign from "@expo/vector-icons/AntDesign";
import { StyleSheet } from "react-native";
import { useShallow } from "zustand/react/shallow";

import Button from "@/features/shared/components/input/Button";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useTranslationStore } from "@/features/translation/stores/useTranslationStore";

type Props = object;

const ClearTranslationButton = (props: Props) => {
  const theme = useTheme();
  const [
    mode,
    clearActiveVideoTranslationResult,
    clearActiveTextTranslationResult,
  ] = useTranslationStore(
    useShallow((state) => [
      state.mode,
      state.clearActiveVideoTranslationResult,
      state.clearActiveTextTranslationResult,
    ]),
  );

  return (
    <Button
      onPress={
        mode === "signToText"
          ? clearActiveVideoTranslationResult
          : clearActiveTextTranslationResult
      }
      variant="transparent"
      style={styles.button}
    >
      <AntDesign name="close" size={24} color={theme?.primaryForeground} />
    </Button>
  );
};

export default ClearTranslationButton;

const styles = StyleSheet.create({
  button: {
    borderWidth: 0,
  },
});
