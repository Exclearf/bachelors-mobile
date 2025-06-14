import React from "react";
import { View } from "react-native";

import { useLocalization } from "@/features/shared/hooks/useLocalization";

import AppLanguageToggle from "./items/AppLanguageToggle";
import HistoryControl from "./items/HistoryControl";
import VideoClassificationTopK from "./items/VideoClassificationTopK";
import { SettingsSectionsItemType } from "../../../SettingsSections";

type Props = SettingsSectionsItemType;

const GeneralSection = ({ getTranslationKey, style, textStyle }: Props) => {
  getTranslationKey = useLocalization(
    getTranslationKey("generalSettingsSection"),
  );

  return (
    <>
      {(
        [AppLanguageToggle, VideoClassificationTopK, HistoryControl] as const
      ).map((LanguageToggle, index) => (
        <View key={index} style={style}>
          <LanguageToggle
            getTranslationKey={getTranslationKey}
            textStyle={textStyle}
          />
        </View>
      ))}
    </>
  );
};

export default GeneralSection;
