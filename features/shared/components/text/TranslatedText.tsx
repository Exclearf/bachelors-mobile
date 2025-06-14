import React, { Suspense } from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { Text, TextStyle } from "react-native";

import { useFontSize } from "../../hooks/useFontSize";
import { useTheme } from "../../hooks/useTheme";
import { globalTheme } from "../../utils/themes";
import Skeleton from "../feedback/Skeleton";

type TranslationParameter =
  | string
  | number
  | boolean
  | null
  | undefined
  | TranslationParameters;

type TranslationParameters = { [key: string]: TranslationParameter };

export type FontSizeDescription = "regular" | "medium" | "large";

type ComponentProps = {
  translationKey: string;
  translationParameters?: Readonly<TranslationParameters>;
  fontSize?: FontSizeDescription;
  style?: TextStyle | TextStyle[];
  isSecondary?: boolean;
  isBold?: boolean;
  numberOfLines?: number;
  children?: React.ReactNode;
  fontSizeOverride?: number;
  translate?: boolean;
};

// TODO:
// Improve component semantic meaning
// by changing name from "TranslatedText"
// to "Text"
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
  translate = true,
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
          {
            textAlign: "center",
            position: "relative",
            flexWrap: "wrap",
            verticalAlign: "middle",
          },
          {
            fontFamily: isBold
              ? globalTheme.fontSemiBold
              : globalTheme.fontRegular,
            color: isSecondary
              ? theme?.secondaryForeground
              : theme?.primaryForeground,
          },
          ...userStyle,
          { fontSize: fontSizeOverride ?? currentFontSize[fontSize] },
        ]}
      >
        {translate ? t(translationKey, translationParameters) : translationKey}
      </Text>
      {children}
    </Suspense>
  );
};

export default withTranslation()(TranslatedText);
