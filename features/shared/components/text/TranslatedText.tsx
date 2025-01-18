import { Text, TextStyle } from "react-native";
import React, { Suspense } from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import Skeleton from "../feedback/Skeleton";
import { useTheme } from "../../hooks/useTheme";
import { globalTheme } from "../../utils/themes";

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
  isBold?: boolean;
};

const TranslatedText = ({
  t,
  translationKey,
  translationParameters,
  style,
  isSecondary,
  isBold,
}: WithTranslation & ComponentProps) => {
  const theme = useTheme();
  const userStyle = Array.isArray(style) ? style : [style];
  return (
    <Suspense
      fallback={
        <Skeleton
          style={{
            backgroundColor: theme?.mutedBackground,
            height: userStyle.find((item) => item?.fontSize)?.fontSize ?? 16,
            width: "100%",
          }}
        />
      }
    >
      <Text
        style={[
          {
            fontFamily: isBold
              ? globalTheme.fontSemiBold
              : globalTheme.fontRegular,
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
