import { Text, TextStyle } from "react-native";
import React, { Suspense } from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import Skeleton from "../feedback/Skeleton";

type TranslationParameter =
  | string
  | number
  | boolean
  | null
  | undefined
  | TranslationParameters;

type TranslationParameters = { [key: string]: TranslationParameter };

type ComponentProps = {
  translationKey: string;
  translationParameters?: Readonly<TranslationParameters>;
  style?: TextStyle;
};

const TranslatedText = ({
  t,
  translationKey,
  translationParameters,
  style,
}: WithTranslation & ComponentProps) => {
  return (
    <Suspense
      fallback={
        <Skeleton
          style={{
            backgroundColor: "rgba(75,75,75,1)",
            height: style?.fontSize,
            width: "100%",
          }}
        />
      }
    >
      <Text style={style}>{t(translationKey, translationParameters)}</Text>
    </Suspense>
  );
};

export default withTranslation()(TranslatedText);
