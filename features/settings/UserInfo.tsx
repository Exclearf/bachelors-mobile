import React, { useState } from "react";
import { Image, ImageURISource, StyleSheet, View } from "react-native";

import { defaultPicture } from "@/features/auth/hooks/useAuthFlow";
import { useTimeTranslationKey } from "@/features/shared/hooks/useTimeTranslationKey";

import { useAuthStore } from "../auth/stores/useAuthStore";
import Popup from "../shared/components/feedback/Popup";
import TranslatedText from "../shared/components/text/TranslatedText";
import {
  useLocalization,
  UseLocalizationFunction,
} from "../shared/hooks/useLocalization";
import { useTheme } from "../shared/hooks/useTheme";
import AboutButton from "./components/sections/user/AboutButton";
import LogOutButton from "./components/sections/user/LogOutButton";

type Props = {
  getTranslationKey: UseLocalizationFunction;
  height: number;
};

const UserInfo = ({ getTranslationKey, height }: Props) => {
  getTranslationKey = useLocalization(getTranslationKey("userInfo"));
  const user = useAuthStore((state) => state.user);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
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
                },
              ]}
            >
              <AboutButton getTranslationKey={getTranslationKey} />
              <LogOutButton getTranslationKey={getTranslationKey} />
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
    padding: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    gap: 15,
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
