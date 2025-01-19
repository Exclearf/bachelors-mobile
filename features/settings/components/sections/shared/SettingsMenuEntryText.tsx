import { StyleSheet, View } from "react-native";
import React from "react";
import { SettingsSectionSubItemType } from "@/features/settings/SettingsSections";
import TranslatedText from "@/features/shared/components/text/TranslatedText";
import Tooltip from "@/features/shared/components/feedback/Tooltip";
import { useFontSize } from "@/features/shared/hooks/useFontSize";

type Props = {
  textTranslationKey: string;
  tooltipTranslationKey: string;
  position?: "bottom" | "top";
} & Partial<SettingsSectionSubItemType>;

const SettingsMenuEntryText = ({
  textStyle,
  textTranslationKey,
  tooltipTranslationKey,
  position = "bottom",
}: Props) => {
  const fontSize = useFontSize();

  return (
    <View style={styles.textContainer}>
      <TranslatedText style={textStyle} translationKey={textTranslationKey}>
        <Tooltip
          width={125 + fontSize["large"]}
          iconSize={fontSize["regular"]}
          height={75}
          position={position}
        >
          <TranslatedText
            numberOfLines={2}
            translationKey={tooltipTranslationKey}
          />
        </Tooltip>
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
