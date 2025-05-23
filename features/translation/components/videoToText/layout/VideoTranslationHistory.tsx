import { ScrollView } from "react-native-gesture-handler";

import { useTranslationStore } from "@/features/translation/stores/useTranslationStore";

import VideoTranslationHistoryItem from "./VideoTranslationHistoryItem";

type Props = object;

const VideoTranslationHistory = (props: Props) => {
  const videoTranslationResults = useTranslationStore(
    (state) => state.videoTranslationResults,
  );

  return (
    <ScrollView>
      {videoTranslationResults?.map((item) => (
        <VideoTranslationHistoryItem gloss={item} key={item[0].id} />
      ))}
    </ScrollView>
  );
};

export default VideoTranslationHistory;
