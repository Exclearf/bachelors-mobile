import React from "react";
import TranslatedText from "@/features/shared/components/text/TranslatedText";
import ColorPicker, { HueSlider } from "reanimated-color-picker";
import { usePersonalizationStore } from "@/features/shared/stores/personalizationStore";
import { useShallow } from "zustand/react/shallow";
import { SettingsSectionSubItemType } from "@/features/settings/SettingsSections";

type Props = {} & SettingsSectionSubItemType;

const ThemeColorSlider = ({ getTranslationKey, textStyle, width }: Props) => {
  const sliderThinkness = 20;

  const [accentColor, setAccentColor] = usePersonalizationStore(
    useShallow((state) => [state.accentColor, state.setAccentColor]),
  );

  return (
    <>
      <TranslatedText
        style={textStyle}
        translationKey={getTranslationKey("accentColor")}
      />
      <ColorPicker
        value={accentColor}
        style={[{ width: width * 0.55 }]}
        onComplete={(e) => {
          setAccentColor(e.hex);
          console.log(`Accent color changed to ${e.hex}`);
        }}
      >
        <HueSlider
          boundedThumb={true}
          style={{ borderRadius: sliderThinkness / 2 }}
          sliderThickness={sliderThinkness}
        />
      </ColorPicker>
    </>
  );
};

export default ThemeColorSlider;
