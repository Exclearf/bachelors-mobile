import { useSharedValue } from "react-native-reanimated";
import { useShallow } from "zustand/react/shallow";

import { useSettingsItemWidth } from "@/features/settings/hooks/useSettingsItemWidth";
import { SettingsSectionSubItemType } from "@/features/settings/SettingsSections";
import Slider from "@/features/shared/components/input/Slider";
import TranslatedText from "@/features/shared/components/text/TranslatedText";
import { useTranslationStore } from "@/features/translation/stores/useTranslationStore";

import SettingsMenuEntryText from "../../shared/SettingsMenuEntryText";
import { useTheme } from "@/features/shared/hooks/useTheme";

const VideoClassificationTopK = ({
  getTranslationKey,
  textStyle,
}: SettingsSectionSubItemType) => {
  const { width } = useSettingsItemWidth();
  const [topK, setTopK] = useTranslationStore(
    useShallow((state) => [state.topK, state.setTopK]),
  );
  const theme = useTheme();

  const sharedTopK = useSharedValue(topK);

  return (
    <>
      <SettingsMenuEntryText
        textStyle={textStyle}
        textTranslationKey={getTranslationKey("topK")}
        tooltipTranslationKey={getTranslationKey("topKTooltip")}
      />
      <TranslatedText 
        translationKey={`(${topK})`} 
        translate={false} 
        style={{
          color: theme?.secondaryForeground
        }}
      />

      <Slider
        width={width}
        value={sharedTopK}
        totalSteps={10}
        onChangeHandler={(newIndex) => {
          setTopK(Math.floor(Math.pow(newIndex + 1, 1.2)));
        }}
      />
    </>
  );
};

export default VideoClassificationTopK;
