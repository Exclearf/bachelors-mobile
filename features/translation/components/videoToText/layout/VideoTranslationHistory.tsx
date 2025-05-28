import { ScrollView } from "react-native-gesture-handler";

import { useLocalization } from "@/features/shared/hooks/useLocalization";
import { useTranslationStore } from "@/features/translation/stores/useTranslationStore";

import VideoTranslationHistoryItem from "./VideoTranslationHistoryItem";

type Props = object;

const VideoTranslationHistory = (props: Props) => {
  const videoTranslationResults = useTranslationStore(
    (state) => state.videoTranslationResults,
  );
  const getTranslationKey = useLocalization("translation");

  return (
    <ScrollView>
      {videoTranslationResults?.map((item) => (
        <VideoTranslationHistoryItem
          gloss={item}
          key={item[0].id}
          getTranslationKey={getTranslationKey}
        />
      ))}
    </ScrollView>
  );
};

export default VideoTranslationHistory;
