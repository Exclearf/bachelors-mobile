import React from "react";
import { StyleSheet, View } from "react-native";

import { SettingsSectionSubItemType } from "@/features/settings/SettingsSections";
import { PopupVerticalPosition } from "@/features/shared/components/feedback/Popup";
import Tooltip from "@/features/shared/components/feedback/Tooltip";
import TranslatedText from "@/features/shared/components/text/TranslatedText";
import { useFontSize } from "@/features/shared/hooks/useFontSize";

type SettingsMenuEntryTextProps = {
  textTranslationKey: string;
  tooltipTranslationKey?: string;
  position?: PopupVerticalPosition;
} & Partial<SettingsSectionSubItemType>;

const SettingsMenuEntryText = ({
  textStyle,
  textTranslationKey,
  tooltipTranslationKey,
  position = "top",
}: SettingsMenuEntryTextProps) => {
  const fontSize = useFontSize();

  return (
    <View style={styles.textContainer}>
      <TranslatedText style={textStyle} translationKey={textTranslationKey}>
        {tooltipTranslationKey && (
          <Tooltip
            iconSize={fontSize["regular"]}
            verticalPosition={position}
            width={"100%"}
            height={"100%"}
          >
            <TranslatedText translationKey={tooltipTranslationKey} />
          </Tooltip>
        )}
      </TranslatedText>
    </View>
  );
};

export default SettingsMenuEntryText;

const styles = StyleSheet.create({
  textContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 4,
  },
});
