import { router } from "expo-router";
import { StyleSheet } from "react-native";

import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import Button from "@/features/shared/components/input/Button";
import TranslatedText from "@/features/shared/components/text/TranslatedText";
import { UseLocalizationFunction } from "@/features/shared/hooks/useLocalization";
import { useTranslationStore } from "@/features/translation/stores/useTranslationStore";

type LogOutButtonProps = {
  getTranslationKey: UseLocalizationFunction;
};

const LogOutButton = ({ getTranslationKey }: LogOutButtonProps) => {
  const setIsSignedIn = useAuthStore((state) => state.setLoggedIn);

  const setMode = useTranslationStore((state) => state.setMode);

  return (
    <Button
      style={styles.button}
      variant="destructive"
      onPress={() => {
        setMode("signToText");
        router.replace("/");
        setIsSignedIn(false);
      }}
    >
      <TranslatedText
        isBold={true}
        translationKey={getTranslationKey("logOut")}
      />
    </Button>
  );
};

export default LogOutButton;

const styles = StyleSheet.create({
  button: {
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
});
