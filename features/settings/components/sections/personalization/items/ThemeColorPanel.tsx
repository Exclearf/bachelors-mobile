import React from "react";

import { SettingsSectionSubItemType } from "@/features/settings/SettingsSections";

import ColorPanel from "./ColorPanel";
import SettingsMenuEntryText from "../../shared/SettingsMenuEntryText";

type Props = SettingsSectionSubItemType;

// TODO: Refactor whatever this is
// Use Panel2, use Custom Thumb
const ThemeColorSlider = ({ getTranslationKey, textStyle }: Props) => {
  return (
    <>
      <SettingsMenuEntryText
        textStyle={textStyle}
        textTranslationKey={getTranslationKey("accentColor")}
        tooltipTranslationKey={getTranslationKey("accentColorTooltip")}
      />
      <ColorPanel />
    </>
  );
};

export default ThemeColorSlider;
