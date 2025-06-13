import { useShallow } from "zustand/react/shallow";

import { useSettingsItemWidth } from "@/features/settings/hooks/useSettingsItemWidth";
import { SettingsSectionSubItemType } from "@/features/settings/SettingsSections";
import Slider from "@/features/shared/components/input/Slider";
import TranslatedText from "@/features/shared/components/text/TranslatedText";
import { useTranslationStore } from "@/features/translation/stores/useTranslationStore";

import SettingsMenuEntryText from "../../shared/SettingsMenuEntryText";

const VideoClassificationTopK = ({
  getTranslationKey,
  textStyle,
}: SettingsSectionSubItemType) => {
  const { width } = useSettingsItemWidth();
  const [topK, setTopK] = useTranslationStore(
    useShallow((state) => [state.topK, state.setTopK]),
  );

  return (
    <>
      <SettingsMenuEntryText
        textStyle={textStyle}
        textTranslationKey={getTranslationKey("topK")}
        tooltipTranslationKey={getTranslationKey("topKTooltip")}
      />
      <TranslatedText translationKey={`(${topK})`} />

      <Slider
        width={width}
        initialValue={
          // TODO: Unfortunately, due to animation usage, the slider is statefull :<
          topK - 1
        }
        totalSteps={10}
        onChangeHandler={(newIndex) => {
          setTopK(Math.floor(Math.pow(newIndex + 1, 1.2)));
        }}
      />
    </>
  );
};

export default VideoClassificationTopK;
