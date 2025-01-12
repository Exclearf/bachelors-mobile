import { Text, TextStyle } from "react-native";
import React, { Suspense } from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import Skeleton from "../feedback/Skeleton";
import { useTheme } from "../../hooks/useTheme";

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
  style?: TextStyle | TextStyle[];
  isSecondary?: boolean;
};

const TranslatedText = ({
  t,
  translationKey,
  translationParameters,
  style,
  isSecondary,
}: WithTranslation & ComponentProps) => {
  const theme = useTheme();
  const userStyle = Array.isArray(style) ? style : [style];
  return (
    <Suspense
      fallback={
        <Skeleton
          style={{
            backgroundColor: "rgba(75,75,75,1)",
            height: userStyle.find((item) => item?.fontSize)?.fontSize ?? 16,
            width: "100%",
          }}
        />
      }
    >
      <Text
        style={[
          {
            color: isSecondary
              ? theme?.secondaryForeground
              : theme?.primaryForeground,
          },
          ...userStyle,
        ]}
      >
        {t(translationKey, translationParameters)}
      </Text>
    </Suspense>
  );
};

export default withTranslation()(TranslatedText);
