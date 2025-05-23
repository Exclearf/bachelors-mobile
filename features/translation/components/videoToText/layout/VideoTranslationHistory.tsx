import { StyleSheet, View } from "react-native";
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
        <>
          <VideoTranslationHistoryItem gloss={item} key={item[0].value} />
          <VideoTranslationHistoryItem gloss={item} key={item[1].value} />
          <VideoTranslationHistoryItem gloss={item} key={item[2].value} />
        </>
      ))}
    </ScrollView>
  );
};

export default VideoTranslationHistory;

const styles = StyleSheet.create({});
