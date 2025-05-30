import React from "react";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { useTranslationStore } from "@/features/translation/stores/useTranslationStore";

import VideoTranslationResult from "../../videoToText/layout/VideoTranslationResult";

type VideoSignTranslationProps = object;

const VideoSignTranslation = (props: VideoSignTranslationProps) => {
  const activeVideoTranslationResult = useTranslationStore(
    (state) => state.activeVideoTranslationResult,
  );

  return (
    <ScrollView style={styles.contrainer}>
      {activeVideoTranslationResult?.map((entry, index) => (
        <VideoTranslationResult gloss={entry} key={entry.rank} />
      ))}
    </ScrollView>
  );
};

export default VideoSignTranslation;

const styles = StyleSheet.create({
  contrainer: {
    padding: 5,
  },
  entry: {
    display: "flex",
    flexDirection: "row",
  },
});
