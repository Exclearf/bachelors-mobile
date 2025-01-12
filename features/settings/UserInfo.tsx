import { Image, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { router } from "expo-router";
import { useTranslationStore } from "@/features/settings/stores/translationStore";
import { useTimeTranslationKey } from "@/features/shared/hooks/useTimeTranslationKey";
import TranslatedText from "../shared/components/text/TranslatedText";
import { defaultPicture } from "@/features/auth/hooks/useAuthFlow";
import Button from "../shared/components/input/Button";
import { useAuthStore } from "../auth/stores/authStore";
import {
  useLocalization,
  UseLocalizationFunction,
} from "../shared/hooks/useLocalization";

type Props = {
  getTranslationKey: UseLocalizationFunction;
  height: number;
};

const UserInfo = ({ getTranslationKey, height }: Props) => {
  const [setIsSignedIn, user] = useAuthStore(
    useShallow((state) => [state.setIsLoggedIn, state.user]),
  );
  const setMode = useTranslationStore((state) => state.setMode);
  getTranslationKey = useLocalization(getTranslationKey("userInfo"));
  const [picture, setPicture] = useState(user?.picture);
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
          style={styles.greetingsText}
          translationKey={translationKey}
          translationParameters={{ name: user?.name }}
        />
        {user?.picture && (
          <Image
            style={styles.greetinsImage}
            source={picture}
            onError={() => setPicture(defaultPicture)}
          />
        )}
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
    color: "#fff",
    fontSize: 16,
  },
  greetingsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 5,
  },
  greetingsText: {
    fontSize: 22,
    color: "#fff",
  },
  greetinsImage: {
    width: 45,
    height: 45,
    borderRadius: 25,
  },
});
