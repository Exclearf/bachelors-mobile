import React from "react";
import TranslatedText from "@/features/shared/components/text/TranslatedText";
import { SettingsSectionSubItemType } from "@/features/settings/SettingsSections";
import ColorPanel from "./ColorPanel";

type Props = {} & SettingsSectionSubItemType;

// TODO: Refactor whatever this is
// Use Panel2, use Custom Thumb
const ThemeColorSlider = ({ getTranslationKey, textStyle, width }: Props) => {
  return (
    <>
      <TranslatedText
        style={textStyle}
        translationKey={getTranslationKey("accentColor")}
      />
      <ColorPanel width={width} />
    </>
  );
};

export default ThemeColorSlider;
