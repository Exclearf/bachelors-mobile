import { Text, TextStyle } from "react-native";
import React, { Suspense } from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import Skeleton from "../feedback/Skeleton";
import { useTheme } from "../../hooks/useTheme";
import { globalTheme } from "../../utils/themes";
import { useFontSize } from "../../hooks/useFontSize";

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
  fontSize?: "regular" | "medium" | "large";
  style?: TextStyle | TextStyle[];
  isSecondary?: boolean;
  isBold?: boolean;
  numberOfLines?: number;
  children?: React.ReactNode;
  fontSizeOverride?: number;
};

//TODO: Seprate the children into TranslatedText.

const TranslatedText = ({
  t,
  translationKey,
  translationParameters,
  fontSize = "regular",
  style,
  isSecondary,
  isBold,
  numberOfLines = 1,
  children,
  fontSizeOverride,
}: WithTranslation & ComponentProps) => {
  const theme = useTheme();
  const currentFontSize = useFontSize();
  const userStyle = Array.isArray(style) ? style : [style];
  return (
    <Suspense
      fallback={
        <Skeleton
          style={{
            backgroundColor: theme?.mutedBackground,
            height: currentFontSize[fontSize],
            width: "100%",
          }}
        />
      }
    >
      <Text
        numberOfLines={numberOfLines}
        style={[
          { textAlign: "center", position: "relative" },
          {
            fontFamily: isBold
              ? globalTheme.fontSemiBold
              : globalTheme.fontRegular,
            color: isSecondary
              ? theme?.secondaryForeground
              : theme?.primaryForeground,
            verticalAlign: "middle",
          },
          ...userStyle,
          { fontSize: fontSizeOverride ?? currentFontSize[fontSize] },
        ]}
      >
        {t(translationKey, translationParameters)}
      </Text>
      {children}
    </Suspense>
  );
};

export default withTranslation()(TranslatedText);
