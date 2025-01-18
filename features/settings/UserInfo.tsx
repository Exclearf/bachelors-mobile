import { Image, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { router } from "expo-router";
import { useTranslationStore } from "@/features/translation/stores/translationStore";
import { useTimeTranslationKey } from "@/features/shared/hooks/useTimeTranslationKey";
import TranslatedText from "../shared/components/text/TranslatedText";
import { defaultPicture } from "@/features/auth/hooks/useAuthFlow";
import Button from "../shared/components/input/Button";
import { useAuthStore } from "../auth/stores/authStore";
import {
  useLocalization,
  UseLocalizationFunction,
} from "../shared/hooks/useLocalization";
import { useTheme } from "../shared/hooks/useTheme";

type Props = {
  getTranslationKey: UseLocalizationFunction;
  height: number;
};

const UserInfo = ({ getTranslationKey, height }: Props) => {
  getTranslationKey = useLocalization(getTranslationKey("userInfo"));
  const [setIsSignedIn, user] = useAuthStore(
    useShallow((state) => [state.setIsLoggedIn, state.user]),
  );
  const setMode = useTranslationStore((state) => state.setMode);
  const [picture, setPicture] = useState(user?.picture);
  const theme = useTheme();
  const translationKey = useTimeTranslationKey(
    [
      "greetings.morning",
      "greetings.afternoon",
      "greetings.evening",
      "greetings.night",
    ].map((key) => getTranslationKey(key)) as [string, string, string, string],
  );

  return (
    <View style={styles.container}>
      <View style={[styles.greetingsContainer, { height: height * 0.07 }]}>
        <TranslatedText
          style={{ color: theme?.primaryForeground }}
          fontSize="large"
          isBold={true}
          translationKey={translationKey}
          translationParameters={{ name: user?.name }}
        />
        <Image
          style={styles.greetinsImage}
          source={picture ?? defaultPicture}
          onError={() => setPicture(defaultPicture)}
        />
      </View>
      {
        // TODO: Make as a pop-up on the user profile image
      }
      {false && (
        <Button
          width={128}
          height={48}
          backgroundColor="#551616"
          onPress={() => {
            setMode("signToText");
            router.replace("/");
            setIsSignedIn(false);
          }}
        >
          <TranslatedText
            isBold={true}
            translationKey={getTranslationKey("logOut")}
            style={styles.logOutText}
          />
        </Button>
      )}
    </View>
  );
};

export default UserInfo;

const styles = StyleSheet.create({
  container: { paddingBottom: 5 },
  logOutText: {
    fontSize: 16,
  },
  greetingsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 5,
  },
  greetingsText: {},
  greetinsImage: {
    width: 45,
    height: 45,
    borderRadius: 25,
  },
});
