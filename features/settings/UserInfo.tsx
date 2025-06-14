import { router } from "expo-router";
import React, { useState } from "react";
import { Image, ImageURISource, StyleSheet, View } from "react-native";
import { useShallow } from "zustand/react/shallow";

import { defaultPicture } from "@/features/auth/hooks/useAuthFlow";
import { useTimeTranslationKey } from "@/features/shared/hooks/useTimeTranslationKey";
import { useTranslationStore } from "@/features/translation/stores/useTranslationStore";

import { useAuthStore } from "../auth/stores/useAuthStore";
import Popup from "../shared/components/feedback/Popup";
import Button from "../shared/components/input/Button";
import TranslatedText from "../shared/components/text/TranslatedText";
import {
  useLocalization,
  UseLocalizationFunction,
} from "../shared/hooks/useLocalization";
import { useTheme } from "../shared/hooks/useTheme";

type Props = {
  getTranslationKey: UseLocalizationFunction;
  height: number;
};

const popupWidth = 140;
const popupHeight = 60;
const popupPadding = 5;

const UserInfo = ({ getTranslationKey, height }: Props) => {
  getTranslationKey = useLocalization(getTranslationKey("userInfo"));

  const [setIsSignedIn, user] = useAuthStore(
    useShallow((state) => [state.setLoggedIn, state.user]),
  );
  const [isPopupVisible, setIsPopupVisible] = useState(false);
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
      <View style={[styles.greetingsContainer, { height: height * 0.08 }]}>
        <TranslatedText
          style={{
            color: theme?.primaryForeground,
            width: "80%",
            textAlign: "left",
          }}
          fontSize="medium"
          isBold={true}
          numberOfLines={2}
          translationKey={translationKey}
          translationParameters={{ name: user?.name }}
        />
        <Popup
          isOpen={isPopupVisible}
          setIsOpen={(newState) => {
            if (picture) {
              setIsPopupVisible(newState);
            }
          }}
        >
          <Popup.Trigger>
            <Image
              style={{
                width: height * 0.06,
                height: height * 0.06,
                borderRadius: height * 0.03,
              }}
              source={
                picture ? ({ uri: picture } as ImageURISource) : defaultPicture
              }
              onError={() => {
                setPicture(defaultPicture);
              }}
            />
          </Popup.Trigger>
          <Popup.Content
            verticalPosition="bottom"
            horizontalPosition="left"
            width={128}
            height={48}
          >
            <View
              style={[
                styles.logOutContainer,
                {
                  backgroundColor: theme?.mutedBackground,
                  borderColor: theme?.mutedForeground,
                  borderWidth: 1,
                },
              ]}
            >
              <Button
                width={popupWidth - popupPadding * 2}
                height={popupHeight - popupPadding * 2}
                style={{ borderRadius: 5 }}
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
            </View>
          </Popup.Content>
        </Popup>
      </View>
    </View>
  );
};

export default UserInfo;

const styles = StyleSheet.create({
  container: { paddingBottom: 5 },
  logOutContainer: {
    width: popupWidth,
    height: popupHeight,
    padding: popupPadding,
    borderRadius: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  greetingsContainer: {
    flexDirection: "row",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
    padding: 5,
  },
  greetingsText: {},
});
